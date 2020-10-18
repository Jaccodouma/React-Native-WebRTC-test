import React, { Component, useCallback, useState } from 'react';
import { Button, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import SocketConnection from '../../helpers/socketConnection';

// https://reactnative.dev/docs/refreshcontrol 
const wait = (timeout: number) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
}

// let isLoggedIn: boolean = false

const Chat_Home = () => {
	const [isLoggedIn, setLoggedIn] = useState(false);

	// Chat Screen
	const ChatScreen = () => {
		return (
			<Text>ChatScreen</Text>
		);
	}

	// Login Screen
	let nameInput: string;
	const LoginScreen = () => {
		return (
			<View style={styles.container}>
				<Text>Enter your name:</Text>
				<TextInput 
					style={styles.nameInput}
					editable
					maxLength={20}
					onChangeText={text => nameInput=text}
					onSubmitEditing={loginButton}
				/>
				<Pressable
					style={styles.loginButton}
					onPressIn={loginButton}
				>
					<Text>{"-->"}</Text>
				</Pressable>
			</View>
		)
	}

	const loginButton = () => {
		// SocketConnection.login(nameInput)
		// .then((res) => {
		// 	console.log("Logged in as: " + res);
		// 	setLoggedIn(true);
		// });
	}

	if (isLoggedIn) {
		return <ChatScreen />
	} else {
		return <LoginScreen />
	}
}

class Chat_Home_OLD extends Component{
    // state: {
    //     refreshing: any,
    // }

    // constructor(props: any) {
    //     super(props);
    //     this.state = {
    //         refreshing: false,
    //     };
    // }

    // _onRefresh() {
    //     this.setState({refreshing: true});
    //     SocketConnection.getChats().then((chats) => {
    //         this.setState({refreshing: false})
    //     });
    // }

    // render() {
    //     return (
    //         <SafeAreaView style={styles.container}>
    //           <ScrollView
    //             contentContainerStyle={styles.scrollView}
    //             refreshControl={
    //               <RefreshControl 
    //                 refreshing={this.state.refreshing} 
    //                 onRefresh={this._onRefresh.bind(this)} />
    //             }
    //           >
    //             <Text>Pull down to see RefreshControl indicator</Text>
    //           </ScrollView>
    //         </SafeAreaView>
    //       );
    // }
}

const styles = StyleSheet.create({
    container: {
		  flex: 1,
		  backgroundColor: '#ffdcab',
		  alignItems: 'center',
		  justifyContent: 'center',
    },
    scrollView: {
		flex: 1,
		backgroundColor: 'pink',
		alignItems: 'center',
		justifyContent: 'center',
	},
	nameInput: {
		backgroundColor: '#f5b051',
		width: 250,
		borderRadius: 10,
		textAlign: 'center',
		margin: 10,
		borderWidth: 1,
	},
	loginButton: {
		backgroundColor: '#ed951c',
		padding: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		borderWidth: 1,
	}
  });

export default Chat_Home;