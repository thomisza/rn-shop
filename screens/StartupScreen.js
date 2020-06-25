import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { StyleSheet, View, Text, AsyncStorage, Platform, ScrollView, Alert, Button, ActivityIndicator } from 'react-native';


import { useDispatch } from 'react-redux';
import * as authActions  from '../store/actions/auth';
import Colors from '../constants/Colors';

const StartupScreen = (props) => {
    const dispatch = useDispatch();

    const tryLogin = async () => {
        const userData = await AsyncStorage.getItem('userData');
        if(!userData){
            props.navigation.navigate('Auth')
            return;
        }
        const transformedData = JSON.parse(userData);
        const {token, userId, expiryDate} = transformedData;
        const expirationDate = new Date(expiryDate);

        if(expirationDate <= new Date() || !token || !userId){
            props.navigation.navigate('Auth')
            return;
        }

        const expirationTime = expirationDate.getTime() - new Date().getTime();

        dispatch(authActions.authenticate(userId, token, expirationTime))
        props.navigation.navigate('Shop')
    }

    useEffect(()=>{
        tryLogin();
    },[dispatch, tryLogin]);

    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large" color={Colors.primaryColor}/>
        </View>
    );
} 


const styles = StyleSheet.create({
    screen:{
        flex:1
    },
    authContainer:{
        width:'80%',
        maxWidth: 400,
        maxHeight: 400,
        padding:20
    },
    gradient:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    btnContainer:{
        marginTop:10
    }
})

export default StartupScreen;