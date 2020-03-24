import { sendRequest } from 'src/simi/Network/RestMagento';

import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const estimateShippingMethods = (callBack, cartId, params, isSignedIn) => {
    const newParams = {
        address: params
    }
    if (isSignedIn) {
        sendRequest(`rest/default/V1/carts/mine/estimate-shipping-methods`, callBack, 'POST', {}, newParams)
    } else {
        sendRequest(`rest/default/V1/guest-carts/${cartId}/estimate-shipping-methods`, callBack, 'POST', {}, newParams)
    }

}

export const applyRewardsPoint = (callBack, params) => {
    sendRequest(`rest/V1/simiconnector/applypoint`, callBack, 'POST', {}, params)
}

export const updateRewards = (callBack, params = {}) => {
    sendRequest(`rest/default/V1/rewards/mine/update`, callBack, 'POST', {}, params)
}

export const totalsInfomation = (callBack, params, isSignedIn, cartId = null) => {
    if (isSignedIn) {
        sendRequest(`rest/default/V1/carts/mine/totals-information`, callBack, 'POST', {}, params)
    } else {
        sendRequest(`rest/default/V1/guest-carts/${cartId}/totals-information`, callBack, 'POST', {}, params)
    }

}

export const multiAddToCart = (callBack, params) => {
    let getParams = storage.getItem('cartId');
    getParams = getParams ? { quote_id: getParams } : {}
    sendRequest('rest/V1/simiconnector/multiquoteitems', callBack, 'POST', getParams, params)
}

export const moveCartItemToWl = (callBack, id) => {
    getParams = {
        move_to_wishlist: 1
    }
    sendRequest(`rest/V1/simiconnector/quoteitems/${id}`, callBack, 'GET', getParams)
}
