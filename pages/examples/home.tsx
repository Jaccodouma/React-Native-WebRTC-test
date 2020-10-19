import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Tabs
import CanvasExample from './canvas';

const Tab = createBottomTabNavigator();

const Home = (props: any) => {
    return (
        <View>
            <Text>
                Hello fren (:
            </Text>
        </View>
    )
}

const Examples_Home = (props: any) => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Canvas" component={CanvasExample} />
        </Tab.Navigator>
    )
}

export default Examples_Home;