import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import { ADD_ORDER } from "../actions/orders"
import CartItem from '../../models/cart-item';
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
    items: {},
    totalAmount: 0
}

export default cartReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_TO_CART:
            const addedProduct = action.value;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;

            let cartItem;
            
            if(state.items[addedProduct.id]){
                cartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice, 
                    prodTitle, 
                    state.items[addedProduct.id].sum + prodPrice
                );

            } else {
                cartItem = new CartItem(1,prodPrice,prodTitle, prodPrice);  
            }
            return {
                ...state,
                items: { 
                    ...state.items, 
                    [addedProduct.id]: cartItem, 
                },
                totalAmount: state.totalAmount + prodPrice
            }
        case REMOVE_FROM_CART:
            const currentQty = state.items[action.value].quantity
            const itemToRemove = state.items[action.value]
            let updatedCartItems;
            if(currentQty > 1){
                const updatedCartItem = new CartItem(
                    itemToRemove.quantity - 1,
                    itemToRemove.prodPrice, 
                    itemToRemove.productTitle, 
                    itemToRemove.sum - itemToRemove.productPrice
                );
                updatedCartItems = { ...state.items, [action.value]: updatedCartItem}

            } else {
                updatedCartItems = { ...state.items };
                delete updatedCartItems[action.value];
            }

            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - itemToRemove.productPrice
            }
        case ADD_ORDER:
            return initialState;
        case DELETE_PRODUCT:
            if(!state.items[action.pid]){
                return state;
            } 
            const updatedItems = { ...state.items }
            const itemTotal = state.items[action.pid].sum;
            delete updatedItems[action.pid]
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }
            
    }
    return state
}