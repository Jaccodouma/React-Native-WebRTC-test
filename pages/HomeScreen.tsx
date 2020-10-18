import React, { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';



const HomeScreen = ({navigation}: any) => {

    changeNavigationBarColor('#ff5700', false, false);

    const onPressChats = () => {
        navigation.navigate("chat_home");
    }
    const onPressVideoCall = () => {
        navigation.navigate("videocall_home");
    }

    return(
        <View style={styles.container}>
            <Text>Home screen</Text>
            {/* <Pressable 
                onPress={onPressChats} 
                disabled={true}
                android_ripple={{
                    color: '#225599'
                }}
            >
                <Text
                    style={styles.button}
                >Chats</Text>
            </Pressable> */}
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