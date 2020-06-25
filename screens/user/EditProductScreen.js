import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import ProductItem from '../../components/shop/ProductItem';
import { useSelector } from 'react-redux';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/Input';
import { HeaderButtons, Item  } from 'react-navigation-header-buttons';
import { useDispatch } from 'react-redux';
import * as productsActions  from '../../store/actions/products';
import Colors from '../../constants/Colors';

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

const EditProductScreen = (props) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const prodId = props.navigation.getParam('productId')
    const editableProduct = useSelector(state => state.products.userProducts.find(prd => prd.id === prodId))

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editableProduct ? editableProduct.title : '',
            imageUrl: editableProduct ? editableProduct.imageUrl : '',
            description: editableProduct ? editableProduct.description : '',
            price: ''
        }, 
        inputValidities: {
            title: editableProduct ? true : false,
            imageUrl: editableProduct ? true : false,
            description: editableProduct ? true : false,
            price: editableProduct ? true : false
        }, 
        formIsValid: editableProduct ? true : false
    })

   
    const dispatch = useDispatch();

    useEffect( ()=> {
        if(error){
            Alert.alert('An error occured ! ', error)
        }
    },[error])

    const submitHandler = useCallback(async () => {
        if(!formState.formIsValid){
            Alert.alert('Wrong Input !', 'Please check the errors in the form', [
                { text: 'Okay'}
            ])
            return;
        }
        setIsLoading(true)
        setError(null);
        try{
            if(editableProduct){
            
                await dispatch(productsActions.updateProduct(
                    prodId,
                    formState.inputValues.title,
                    formState.inputValues.imageUrl,
                    formState.inputValues.description
                ));
            } else {
                await dispatch(productsActions.createProduct(
                    formState.inputValues.title,
                    formState.inputValues.imageUrl,
                    formState.inputValues.description,
                    +formState.inputValues.price
                ));
            }   
            props.navigation.goBack();
        } catch (error){
            setError(error.message)
        }
        setIsLoading(false);
    },[dispatch, prodId, formState])

    useEffect(() => {
        props.navigation.setParams({'onSubmit': submitHandler})
    }, [submitHandler])
    
    const inputChangedHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState])
    
    if(isLoading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primaryColor} />
            </View>
        )
    }

    return(
        <KeyboardAvoidingView style={{flex:1}} behavior="padding" keyboardVerticalOffset={10}>
            <ScrollView>
                <View style={styles.form}>
                    <Input 
                        id='title'
                        label='title'
                        errorText='Please enter a valid title'
                        onInputChange={inputChangedHandler}
                        initialValue={editableProduct ? editableProduct.title : ''}
                        initiallyValid={!!editableProduct}
                        required
                    />
                    <Input 
                        id='imageUrl'
                        label='imageUrl'
                        errorText='Please enter a valid imageUrl'
                        onInputChange={inputChangedHandler}
                        initialValue={editableProduct ? editableProduct.imageUrl : ''}
                        initiallyValid={!!editableProduct}
                        required
                    />
                    {editableProduct ? null : <Input 
                        id='price'
                        label='price'
                        errorText='Please enter a valid price'
                        keyboardType='decimal-pad'
                        onInputChange={inputChangedHandler}
                        required
                        min={0}
                    />}

                    <Input 
                        id='description'
                        label='description'
                        errorText='Please enter a valid description'
                        numberOrLines={3}
                        onInputChange={inputChangedHandler}
                        initialValue={editableProduct ? editableProduct.description : ''}
                        initiallyValid={!!editableProduct}
                        required
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
} 

EditProductScreen.navigationOptions = (navData) => {
    const submitHandler = navData.navigation.getParam('onSubmit')
    return {
        headerTitle:navData.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item 
                    title="Save"
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    onPress={submitHandler}
                />
            </HeaderButtons>
        )
    }
}

/* export const screenOptions = navData => {
    //const submitFn = navData.navigation.getParam('submit')
    return {
        headerTitle: 'Product',
        //headerTitle: navData.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Save"
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                />
            </HeaderButtons>
        ),
    }
}
 */

const styles = StyleSheet.create({
    form:{
        margin:20
    },
    formControl:{
        width:'100%'
    },
    label:{
        marginVertical:8
    },
    input:{
        paddingHorizontal:2,
        paddingVertical: 5,
        borderBottomColor:'#ccc',
        borderBottomWidth:1
    },
    centered:{
        flex:1, 
        justifyContent:'center', 
        alignItems:'center'
    }
})

export default EditProductScreen