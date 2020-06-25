import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Platform, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item  } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';

const OrdersScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    const loadOrders = async () => {
        await dispatch(ordersActions.fetchOrders())
    }

    useEffect(() => {
        setIsLoading(true);
        loadOrders();
        setIsLoading(false);
    },[loadOrders])

    if(isLoading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primaryColor} />
            </View>
        )
    }

    return(
        <FlatList 
            data={orders}
            renderItem={itemData => (
            <OrderItem 
                amount={itemData.item.totalAmount}
                date={itemData.item.readableDate} 
                items={itemData.item.items}
            />
            )}
        />
    );
} 

OrdersScreen.navigationOptions = (navData) => {
    return {
        headerTitle:'Orders Screen',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item 
                    title="Menu"
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={()=> {navData.navigation.toggleDrawer(); }}
                />
            </HeaderButtons>
        ),
    };
}
/*
export const screenOptions = navData => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Menu"
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        )
    }
}
*/
const styles = StyleSheet.create({
    centered:{
        flex:1, 
        justifyContent:'center', 
        alignItems:'center'
    }
})

export default OrdersScreen