import { sendRequest } from 'src/simi/Network/RestMagento';

export const addToWishlist = (callBack , params) => {
    sendRequest('/rest/V1/simiconnector/wishlistitems', callBack, 'POST', {}, params)
}

export const shareWishlist = (callBack , params) => {
    sendRequest('/rest/V1/simiconnector/wishlistitems', callBack, 'POST',{}, params)
}

export const getWishlist = (callBack, params) => {
    sendRequest('/rest/V1/simiconnector/wishlistitems', callBack, 'GET', params)
}

export const removeWlItem = (id, callBack) => {
    sendRequest(`rest/V1/simiconnector/wishlistitems/${id}`, callBack, 'DELETE')
}

export const addWlItemToCart = (id, callBack, qty = 1) =>{
    sendRequest(`rest/V1/simiconnector/wishlistitems/${id}`, callBack, 'GET', {add_to_cart: qty})
}

export const updateItemsToWishlist = (callBack, postData) => {
    sendRequest('rest/V1/simiconnector/wishlistitems/update_all', callBack, 'PUT', {}, postData);
}

export const addAllWlItemToCart = (callBack) =>{
    sendRequest(`rest/V1/simiconnector/wishlistitems/add_all_tocart`, callBack, 'GET')
}
