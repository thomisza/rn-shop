import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, Button, ActivityIndicator } from 'react-native';
import ProductItem from '../../components/shop/ProductItem';
import { useSelector } from 'react-redux';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';

import { HeaderButtons, Item  } from 'react-navigation-header-buttons';
import { useDispatch } from 'react-redux';
import * as authActions  from '../../store/actions/auth';
import Colors from '../../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';

const FORM_UPDATE = 'UPDATE'

const formReducer = (state, action) => {
    if(action.type === FORM_UPDATE){
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for(const key in updatedValidities){
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        }
    }
}

const AuthScreen = (props) => {
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [error, setError] = useState();

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const authHandler = async () => {

        let action;
        if(isSignedUp){
            action = authActions.signup(formState.inputValues.email, formState.inputValues.password);
        } else {
            action = authActions.login(formState.inputValues.email, formState.inputValues.password)
        }
        setError(null)
        setIsLoading(true);
        try{
            await dispatch(action)
            props.navigation.navigate('Shop')
        } catch(error){
            setError(error.message)
            setIsLoading(false)
        }
    }
    
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email:'',
            password:''
        }, 
        inputValidities: {
            email: false,
            password: false
        }, 
        formIsValid: false
    })

    useEffect(() => {
        if(error){
            Alert.alert('An error occured !', error, [{text: 'Okay'}])
        }
    },[error])

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            input: inputIdentifier
        })
    },[])

    return(
        <KeyboardAvoidingView 
            style={styles.screen}
           >
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input 
                            id="email" 
                            label="E-Mail" 
                            keyboardType='email-address' 
                            required 
                            email 
                            autoCapitalize="none"
                            errorText="Please enter a valid email address"
                            onInputChange={inputChangeHandler}
                            initialValue="" 
                        />
                        <Input 
                            id="password" 
                            label="Password" 
                            keyboardType='default' 
                            secureTextEntry
                            required 
                            minLength={5} 
                            autoCapitalize="none"
                            errorText="Please enter a valid password"
                            onInputChange={inputChangeHandler}
                            initialValue="" 
                        />
                        <View style={styles.btnContainer}>
                            {isLoading ? <ActivityIndicator size='small'/> : (
                                <Button title={isSignedUp ? "Sign Up" : "Login"} color={Colors.primaryColor} onPress={authHandler}/> 
                            )}
                             
                        </View>
                        <View style={styles.btnContainer}>
                            <Button title={`Switch to ${isSignedUp ? "Login" : "Sign up"}`} color={Colors.accentColor} onPress={ () => {
                                setIsSignedUp(prevState => !prevState)
                            }}/>
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
} 

AuthScreen.navigationOptions = (navData) => {
    return {
        headerTitle:"Authenticate"
    }
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

export default AuthScreen