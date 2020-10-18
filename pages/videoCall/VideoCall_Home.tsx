// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling

import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, NativeModules, StyleSheet, Text, View } from 'react-native';
import { mediaDevices, MediaStream, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription, RTCSessionDescriptionType, RTCView } from 'react-native-webrtc';

import DeviceInfo from 'react-native-device-info';

// Socket
import io from 'socket.io-client';
let socket: SocketIOClient.Socket;

// RTCPeerConnection config
const config = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };

// Whether the component is mounted
let mounted = false;

// Type guards
function isMediaStream(stream: MediaStream | boolean): stream is MediaStream {
    return (stream as MediaStream) !== undefined;
}
function isRTCSessionDescription(desc: RTCSessionDescriptionType | undefined): desc is RTCSessionDescriptionType {
    return (desc as RTCSessionDescriptionType) !== undefined;
}

const log = (msg: string) => { console.log(DeviceInfo.getDeviceNameSync() + ": " + msg) }

const VideoCall = (props: any) => {
    /*
 
       _   _  ___   ___  _  ______  
      | | | |/ _ \ / _ \| |/ / ___| 
      | |_| | | | | | | | ' /\___ \ 
      |  _  | |_| | |_| | . \ ___) |
      |_| |_|\___/ \___/|_|\_\____/ 
                                    
 
    */

    const [localStream, setLocalStream] = useState<MediaStream>();
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    // const [pc, setPc] = useState<RTCPeerConnection>();

    const _pc = useRef<RTCPeerConnection>();
    // const pc = _pc.current;

    // Lifecycle effect (runs at start, returns at end)
    useEffect(() => {
        mounted = true;

        // Sockets
        socket = io.connect('http://192.168.0.191:3000');

        socket.on('connect', () => {
            log('Connected to server!');
        })

        socket.on('request-offer', (data: any, callback: Function) => {
            requestOffer(callback);
        })

        socket.on('request-answer', (data: any, callback: Function) => {
            requestAnswer(data, callback);
        })

        socket.on('receive-answer', (data: any) => {
            receiveAnswer(data);
        })

        socket.on('ice-candidate', (data: any) => {
            receiveICECandidate(data);
        });

        return () => {
            // This runs when the component dismounts
            mounted = false;
            const pc = _pc.current;
            pc?.close();
            socket.disconnect();
        }
    }, [])

    // useEffect(() => {
    //     if (remoteStream) {
    //         console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH REMOTESTREAM");
    //         console.log(remoteStream);
    //     }
    // }, [remoteStream])


    /*
 
       _____ _   _ _   _  ____ _____ ___ ___  _   _ ____  
      |  ___| | | | \ | |/ ___|_   _|_ _/ _ \| \ | / ___| 
      | |_  | | | |  \| | |     | |  | | | | |  \| \___ \ 
      |  _| | |_| | |\  | |___  | |  | | |_| | |\  |___) |
      |_|    \___/|_| \_|\____| |_| |___\___/|_| \_|____/ 
                                                          
 
    */

    const receiveICECandidate = (data: any) => {
        // Receive ICE Candidate
        log("Received ICE Candidate!");

        const c = new RTCIceCandidate(data);
        const pc = _pc.current;
        pc?.addIceCandidate(c);
    }

    const openICECandidate = (pc: RTCPeerConnection) => {
        pc.onicecandidate = (candidate) => {
            log("Sending ICE candidate...");
            // send ICE candidate to server
            // console.log(candidate.candidate);
            if (candidate.candidate) socket.emit('ice-candidate', candidate.candidate);
        };
    }

    const findRemoteStream = (pc: RTCPeerConnection) => {
        pc.onaddstream = e => {
            log("Setting remote stream...");
            setRemoteStream(e.stream);
        }
    }

    const receiveAnswer = (data: any) => {
        log("Received answer!");
        const pc = _pc.current;

        pc?.setRemoteDescription(
            new RTCSessionDescription(data)
        )
            .then(() => {
                // console.log("Succesully set remote description! :D (receiveAnswer)");
            }).catch().catch(err => console.error(err));

    }

    const requestAnswer = (data: any, callback: Function): void => {
        log("Creating answer...");

        const pc = new RTCPeerConnection(config);
        _pc.current = pc;

        // Set events on peer connection
        findRemoteStream(pc);
        openICECandidate(pc);

        pc?.setRemoteDescription(
            new RTCSessionDescription(data.description)
        ).then(async () => {
            // console.log("Succesfully set remote description! :D (requestAnswer)");

            await findLocalStream(pc);

            pc.createAnswer().then(answer => {

                pc.setLocalDescription(answer).then(() => {

                    callback(answer);

                }).catch(err => {
                    console.error("Unable to set local description!");
                    console.error(err);
                })

            }).catch(err => {
                console.error("Unable to create answer!");
                console.error(err);
            })

        }).catch(err => {
            console.error("Error setting Remote Description!");
            console.error(err);
        });

    }

    const requestOffer = async (callback: Function): Promise<void> => {
        log("Creating offer...");

        const pc = new RTCPeerConnection(config);
        _pc.current = pc;

        // Set events on peer connection
        openICECandidate(pc);
        findRemoteStream(pc);

        await findLocalStream(pc);

        createOffer(pc).then((description) => {
            // Send offer to server
            callback(description);
        }).catch(err => {
            console.error("Unable to create offer!");
            console.error(err);
        });
    }

    const createOffer = (pc: RTCPeerConnection): Promise<RTCSessionDescriptionType> => {
        return new Promise(async (resolve, reject) => {
            // Create offer 
            const description = await pc?.createOffer();

            // Set local description
            if (isRTCSessionDescription(description)) {
                await pc?.setLocalDescription(description);

                resolve(description);
            } else {
                // Unable to make description
                reject("Can't set local description (isn't RTCSessionDescription)");
            }
        })
    }

    const findLocalStream = (pc: RTCPeerConnection) => {
        log("Finding local stream...");

        return new Promise(async (resolve, reject) => {
            const availableDevices = await mediaDevices.enumerateDevices();
            const { deviceId: sourceId } = availableDevices.find(
                (device: any) => device.kind === 'videoinput' && device.facing === 'front',
            );

            const stream = await mediaDevices.getUserMedia({
                audio: true,
                video: {
                    mandatory: {
                        // Provide your own width, height and frame rate here
                        minWidth: 500,
                        minHeight: 300,
                        minFrameRate: 30,
                    },
                    facingMode: 'user',
                    optional: [{ sourceId }],
                },
            });

            if (isMediaStream(stream)) {
                // Set local stream
                setLocalStream(stream);

                // Add stream to pc 
                if (pc) {
                    pc.addStream(stream);
                }

                resolve(stream);
            } else {
                // There is no stream
                reject();
            }
        })

        // Another way of doing this, for some reason only worked on my tablet
        return new Promise((resolve, reject) => {
            mediaDevices.enumerateDevices().then(sourceInfos => {
                // console.log(sourceInfos);

                let videoSourceId;

                for (let i = 0; i < sourceInfos.length; i++) {
                    const sourceInfo = sourceInfos[i];
                    if (sourceInfo.kind == "videoinput" && sourceInfo.facing == "front") {
                        videoSourceId = sourceInfo.deviceId;
                    }
                }

                mediaDevices.getUserMedia({
                    audio: true,
                    video: {
                        mandatory: {
                            minWidth: 300,
                            minHeight: 300,
                            minFrameRate: 20
                        },
                        facingMode: "user",
                        optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
                    }
                }).then(stream => {
                    if (isMediaStream(stream)) {
                        // Set local stream
                        setLocalStream(stream);

                        // Add stream to pc 
                        if (pc) {
                            pc.addStream(stream);
                        }

                        resolve(stream);
                    } else {
                        // There is no stream
                        reject();
                    }
                }).catch(err => { console.error("Unable to get User Media!") });
            });
        });
    }


    /*
 
        ____ ___  __  __ ____   ___  _   _ _____ _   _ _____ ____  
       / ___/ _ \|  \/  |  _ \ / _ \| \ | | ____| \ | |_   _/ ___| 
      | |  | | | | |\/| | |_) | | | |  \| |  _| |  \| | | | \___ \ 
      | |__| |_| | |  | |  __/| |_| | |\  | |___| |\  | | |  ___) |
       \____\___/|_|  |_|_|    \___/|_| \_|_____|_| \_| |_| |____/ 
                                                                   
 
    */

    const RemoteStream = () => {
        if (remoteStream) {
            // Show remote stream!
            return (
                <View style={styles_remotestream.container}>
                    <RTCView
                        mirror={false}
                        objectFit='cover'
                        streamURL={remoteStream.toURL()}
                        style={styles_remotestream.stream}
                    />
                </View>
            )
        } else {
            // Show loading icon (:
            return (
                <View style={styles_remotestream.container}>
                    <ActivityIndicator
                        size='large'
                        color='#ff5700'
                    />
                </View>
            )
        }
    }

    const RemoteStream2 = () => {
        if (remoteStream) {
            return (
                <View style={styles_remotestream2.container}>
                    <RTCView
                        mirror={true}
                        objectFit='cover'
                        streamURL={remoteStream?.toURL()}
                        style={styles_remotestream2.stream}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles_remotestream2.container}>
                    <ActivityIndicator
                        size='large'
                        color='#ff5700'
                    />
                </View>
            );
        }
    }

    const OwnStream = () => {
        if (localStream) {
            return (
                <View style={styles_ownstream.container}>
                    <RTCView
                        mirror={true}
                        objectFit='cover'
                        streamURL={localStream?.toURL()}
                        style={styles_ownstream.stream}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles_ownstream.container}>
                    <ActivityIndicator
                        size='large'
                        color='#ff5700'
                    />
                </View>
            );
        }
    }

    const Buttons = () => {
        return (
            <View style={styles_buttons.container}>
                <Text>Buttons</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* <RemoteStream /> */}
            <RemoteStream2 />
            <OwnStream />
            {/* <Buttons /> */}
        </View>
    )
}

/*
 
   ____ _______   ___     _____ ____  _   _ _____ _____ _____ ____  
  / ___|_   _\ \ / / |   | ____/ ___|| | | | ____| ____|_   _/ ___| 
  \___ \ | |  \ V /| |   |  _| \___ \| |_| |  _| |  _|   | | \___ \ 
   ___) || |   | | | |___| |___ ___) |  _  | |___| |___  | |  ___) |
  |____/ |_|   |_| |_____|_____|____/|_| |_|_____|_____| |_| |____/ 
                                                                    
 
*/

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333',
        flex: 1,
    }
});

const styles_remotestream = StyleSheet.create({
    container: {
        backgroundColor: '#321',
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
    },
    stream: {
        flex: 1,
    }
})

const styles_ownstream = StyleSheet.create({
    container: {
        backgroundColor: '#444',

        width: 100,
        height: 150,

        borderWidth: 1,
        borderRadius: 20,

        position: 'absolute',
        right: 10,
        top: 10,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    stream: {
        flex: 1,
    },
})
const styles_remotestream2 = StyleSheet.create({
    container: {
        backgroundColor: '#444',

        width: '100%',
        height: '100%',

        borderWidth: 1,
        borderRadius: 20,

        position: 'absolute',
        left: 10,
        top: 10,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    stream: {
        flex: 1,
    },
})

const styles_buttons = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#4444',

        justifyContent: 'center',
        alignItems: 'center',

        position: 'absolute',
        bottom: 20,
    },
})

export default VideoCall; 