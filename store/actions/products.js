import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';


export const deleteProduct = (productId) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const response = await fetch(`https://rn-complete-guide-f77af.firebaseio.com/products/${productId}.json?auth=${token}`,{
            method:'DELETE'
        })

        if(!response.ok){
            throw new Error('Something went wrong');
        }
        
        dispatch({
            type:DELETE_PRODUCT,
            pid: productId
        })
    }
}

export const createProduct = (title, url, description, price) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId
        const response = await fetch(`https://rn-complete-guide-f77af.firebaseio.com/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                url,
                description,
                price,
                ownerId: userId
            })
        });

        const resData = await response.json();

        dispatch({ 
            type:CREATE_PRODUCT,
            productData: {
                id: resData.name,
                title: title,
                imageUrl: url,
                description: description,
                price: price,
                ownerId: userId
            }
        })
    }
}

export const updateProduct = (productId,title, url, description) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        try{
            const response = await fetch(`https://rn-complete-guide-f77af.firebaseio.com/products/${productId}.json?auth=${token}`,{
                method:'PATCH', 
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    url                    
                })
                
            })

            if(!response.ok){
                throw new Error('Something went wrong');
            }

            dispatch({
                type:UPDATE_PRODUCT,
                pid: productId,
                productData: {
                    title: title,
                    imageUrl: url,
                    description: description,
                }
            })
            
        } catch(error) {

        }
        
    }
}

export const getProducts = () => {
    return async (dispatch, getState) => {
        const token = getState().auth.token
        const userId = getState().auth.userId;

        try {
            const response = await fetch(`https://rn-complete-guide-f77af.firebaseio.com/products.json?auth=${token}`,{
                method:'GET'
            });

            if(!response.ok){
                throw new Error('Something went wrong');
            }

            const resData = await response.json();
            const loadedProducts = [];

            for(const key in resData){
                loadedProducts.push(new Product(
                    key,
                    resData[key].ownerId,
                    resData[key].title,
                    resData[key].url,
                    resData[key].description,
                    resData[key].price
                ))
            };

            dispatch({
               type:SET_PRODUCTS,
               products:loadedProducts,
               userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
            })
        } catch (err){
            throw err;
        }
        
    }
}