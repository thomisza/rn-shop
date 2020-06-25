import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import Colors from '../../constants/Colors';
import CartItem from './CartItem';

const OrderItem = (props) => {
    const [showDetails, setShowDetails] = useState(false);

    return(
        <View style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.amount}>${props.amount.toFixed(2)} </Text>
                <Text style={styles.date}>{props.date}</Text>
            </View>
            <Button 
                color={Colors.primaryColor} 
                title={showDetails ? "Hide Details" : 'Show Details'} 
                onPress={() => setShowDetails(prevState => !prevState)}
            />
            {showDetails && <View style={styles.detailItems}>
                {props.items.map(cartItem => (
                    <CartItem
                        key={cartItem.productId}
                        quantity={cartItem.quantity} 
                        amount={cartItem.sum} 
                        title={cartItem.productTitle}
                        deletable={false}
                    />
                ) )}
            </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    orderItem: {
        shadowColor:'black',
        shadowOpacity:0.26,
        shadowOffset: {width: 0, height:2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius:10,
        backgroundColor: 'white',
        margin:20,
        padding:10,
        alignItems:'center'
    },
    summary:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'100%',
        marginBottom:15
    },
    amount:{
        fontSize: 16,
        color:'#888'
    },
    date:{
        fontSize: 16,
        color:'#888'
    },
    detailItems:{
        width:'100%'
    }
})

export default OrderItem;