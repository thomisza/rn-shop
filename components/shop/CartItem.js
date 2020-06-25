import React from 'react';
import { StyleSheet, View, Text, Image, Button, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import Colors from '../../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CartItem = (props) => {
    let TouchableCompo = TouchableOpacity;

    if(Platform.OS === 'android' && Platform.Version >= 21){
        TouchableCompo = TouchableNativeFeedback
    }
    return(
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <Text style={styles.quantity}>{props.quantity} </Text>
                <Text style={styles.text}>{props.title}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.text}>${props.amount.toFixed(2)} </Text>
                {props.deletable && <TouchableCompo onPress={props.onRemove} style={styles.deleteBtn}>
                    <Ionicons 
                        name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                        size={23}
                        color='red'/>
                </TouchableCompo>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cartItem: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        padding:10,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    itemData:{
        flexDirection:'row',
        alignItems:'center'
    },
    quantity:{
        fontSize: 16,
        color:'#888'
    },
    text:{
        fontSize: 16,
    },
    deleteBtn:{
        marginLeft:20
    }
})

export default CartItem;