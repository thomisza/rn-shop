import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import { ProductsNavigator } from './ShopNavigator';

//const MyStack = createStackNavigator();

const AppNavigator = (props) => {
    //const isAuth = useSelector(state => )

    return (
        <NavigationContainer>
            <ProductsNavigator />
        </NavigationContainer>
    );
}

export default AppNavigator