import React from 'react';
import { StyleSheet, View, Text, Image, Button, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import * as cartActions  from '../../store/actions/cart';

const ProductDetailScreen = (props) => {
    const productId = props.navigation.getParam('productId')
    const dispatch = useDispatch();
    const selectedProduct = useSelector(state => state.products.availableProducts.find(prod => prod.id === productId));

    return(
        <ScrollView>
            <Image style={styles.image} source={{uri : selectedProduct.imageUrl}}/>
            <View style={styles.action}>
                <Button color={Colors.primaryColor} title="Add to Cart" onPress={ () => {
                    dispatch(cartActions.addToCart(selectedProduct))
                } } />
            </View>
            <Text style={styles.price}>${selectedProduct.price}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>
        </ScrollView>

    );
} 

ProductDetailScreen.navigationOptions = (navData) => {
    return {
        headerTitle:navData.navigation.getParam('productTitle')
    };
}
/*
export const screenOptions = navData => {
    return {
        //headerTitle: navData.navigation.getParam('productTitle'),
        headerTitle: 'aezazea'
    }
}
*/
const styles = StyleSheet.create({
    image:{
        width:'100%',
        height:300
    },
    price:{
        fontSize:20,
        color:'#888',
        textAlign:'center',
        marginVertical:20
    },
    description:{
        fontSize:14,
        textAlign:'center'
    },
    action:{
        marginVertical:10,
        marginHorizontal:20,
        alignItems:'center'
    }
})

export default ProductDetailScreen