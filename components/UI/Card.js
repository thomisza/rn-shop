import React from 'react';
import { StyleSheet, View, Text, Image, Button, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import Colors from '../../constants/Colors';

const Card = (props) => {
    return(
        <View style={{...styles.card, ...props.style}}>
            {props.children}
        </View>
    );
}

const styles = StyleSheet.create({
    product: {
        shadowColor:'black',
        shadowOpacity:0.26,
        shadowOffset: {width: 0, height:2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius:10,
        backgroundColor: 'white',
    }
})

export default Card;