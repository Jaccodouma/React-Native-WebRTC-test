import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';

const LoadingScreen = ({navigation}: any) => {
    hideNavigationBar();

    setTimeout(() => {
        showNavigationBar();
        navigation.navigate('home');
    }, 3000);

    return(
        <View style={[styles.container, styles.background]}>
            <Image 
                style={styles.dutchNow}
                source={require('../resources/images/Logo__DutchNow.png')}
            />
            <ActivityIndicator size="large" color='#ff5700'/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        backgroundColor: '#444',
        padding: '20%',
    },
    dutchNow: {
        resizeMode: 'contain',
        width: '100%',
        flex: 5,
    }
});

export default LoadingScreen;