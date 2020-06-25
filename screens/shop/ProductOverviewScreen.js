import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, Platform, Button, ActivityIndicator } from 'react-native';
import ProductItem from '../../components/shop/ProductItem';
import { useSelector, useDispatch } from 'react-redux';
import * as cartActions  from '../../store/actions/cart';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import { HeaderButtons, Item  } from 'react-navigation-header-buttons';
import Colors from '../../constants/Colors';
import * as productActions from '../../store/actions/products';

const ProductOverviewScreen = (props) => {
    const products = useSelector(state => state.products.availableProducts)
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try{
            await dispatch(productActions.getProducts())
        } catch (err){
            setError(err.message)
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError])

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', () => {
            loadProducts();
        });
        return () => {
            willFocusSub.remove();
        }
    },[loadProducts])

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(()=> {
            setIsLoading(false)
        });
   },[dispatch,loadProducts])

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId : id, 
            productTitle : title});
    }

    if(error){
       return(
            <View style={styles.centered}>
                <Text>An error occured</Text>
                <Button title="Try Again" onPress={() => loadProducts()} />
            </View>
       );
    }

    if(isLoading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primaryColor} />
            </View>
        )
    }

    if(!isLoading && products.length === 0){
        return (
            <View style={styles.centered}>
                <Text>No products found</Text>
            </View>
        )
    }

     return(
        <FlatList 
            onRefresh={() => loadProducts()}
            refreshing={isRefreshing}
            data={products}
            renderItem={itemData => (
                <ProductItem 
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={ () => {
                        selectItemHandler(itemData.item.id, itemData.item.title)
                    } }
                >
                    <Button 
                        color={Colors.primaryColor} 
                        title="View Details" 
                        onPress={() => {
                            selectItemHandler(itemData.item.id, itemData.item.title)
                        }}
                    />
                    <Button 
                        color={Colors.primaryColor} 
                        title="To Cart" 
                        onPress={() => { dispatch(cartActions.addToCart(itemData.item)); }}
                    />
                </ProductItem>
            )}
        />
    );
} 

ProductOverviewScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'All Products',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item 
                    title="Menu"
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={()=> {navData.navigation.toggleDrawer(); }}
                />
            </HeaderButtons>
        ),
        headerRight: () => ( <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item 
                title="Cart" 
                iconName={Platform.OS==='android' ? 'md-cart' : 'ios-cart'}
                onPress={() => {navData.navigation.navigate('Cart')}}/>
        </HeaderButtons>)
    }
  
}
/*
export const screenOptions = navData => {
    return {
        headerTitle: 'All Products',
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
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Cart"
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => {
                        navData.navigation.navigate('Cart');
                    }}
                />
            </HeaderButtons>
        ),
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

export default ProductOverviewScreen