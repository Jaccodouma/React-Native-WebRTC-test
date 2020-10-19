import React from 'react';
import { Text, View } from 'react-native';
import Canvas from 'react-native-canvas';

const CanvasExample = (props: any) => {

    const handleCanvas = async (canvas: Canvas) => {
        const ctx = canvas.getContext('2d');

        // Interesting shape 
        ctx.beginPath();

        ctx.moveTo(20, 20);

        ctx.lineTo(40, 20);
        ctx.quadraticCurveTo(40, 40, 60, 40);
        ctx.quadraticCurveTo(80, 40, 80, 20);
        ctx.lineTo(100, 20);
        ctx.lineTo(100, 100);
        ctx.lineTo(20, 100);

        let gradient = await ctx.createLinearGradient(20, 20, 100, 100);
        gradient.addColorStop(1, "black");
        gradient.addColorStop(0, "red");

        ctx.fillStyle = gradient;
        ctx.fill();
    }

    return (
        <View>
            <Text>
                Canvas example:
            </Text>
            <Canvas ref={handleCanvas} />
        </View>
    )
}

export default CanvasExample;