import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';



const HomeScreen = ({ navigation }: any) => {

    changeNavigationBarColor('#ff5700', false, false);

    const onPressVideoCall = () => {
        navigation.navigate("videocall_home");
    }

    const onPressTest = () => {
        navigation.navigate("examples");
    }

    /*
 
        ____ ___  __  __ ____   ___  _   _ _____ _   _ _____ ____  
       / ___/ _ \|  \/  |  _ \ / _ \| \ | | ____| \ | |_   _/ ___| 
      | |  | | | | |\/| | |_) | | | |  \| |  _| |  \| | | | \___ \ 
      | |__| |_| | |  | |  __/| |_| | |\  | |___| |\  | | |  ___) |
       \____\___/|_|  |_|_|    \___/|_| \_|_____|_| \_| |_| |____/ 
                                                                   
 
    */

    const VideoCallButton = () => {
        return (
            <Pressable
                onPress={onPressVideoCall}
                android_ripple={{
                    color: '#225599'
                }}
                style={styles.button}
            >
                <Text
                // style={styles.button}
                >VideoCall</Text>
            </Pressable>
        );
    }

    const TestScreenButton = () => {
        return (
            <Pressable
                onPress={onPressTest}
                android_ripple={{
                    color: '#225599'
                }}
                style={styles.button}
            >
                <Text
                >Examples</Text>
            </Pressable>
        );
    }

    return (
        <View style={styles.container}>
            <Text>Home screen</Text>
            <VideoCallButton />
            <TestScreenButton />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        padding: 10,
        backgroundColor: '#ff570033'
    },
    button: {
        margin: 10,
        padding: 10,
        backgroundColor: '#ff5700',
        borderRadius: 10,
        textAlign: 'center',
    }
})

export default HomeScreen;