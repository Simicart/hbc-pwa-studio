import { sendRequest } from 'src/simi/Network/RestMagento';

export const estimateShippingMethods = (callBack, cartId, params, isSignedIn) => {
    const newParams = {
        address : params
    }
    if(isSignedIn) {
        sendRequest(`rest/default/V1/carts/mine/estimate-shipping-methods`, callBack, 'POST', {}, newParams)
    } else {
        sendRequest(`rest/default/V1/guest-carts/${cartId}/estimate-shipping-methods`, callBack, 'POST', {}, newParams)
    }

}

export const applyRewardsPoint = (callBack, params) => {
    sendRequest(`rest/V1/simiconnector/applypoint`, callBack, 'POST', {}, params) 
}

export const updateRewards = (callBack) => {
    sendRequest(`rest/default/V1/rewards/mine/update`, callBack, 'POST', {}, {}) 
}

export const totalsInfomation = (callBack, params, isSignedIn, cartId = null) => {
    if(isSignedIn) {
        sendRequest(`rest/default/V1/carts/mine/totals-information`, callBack, 'POST', {}, params)
    } else {
        sendRequest(`rest/default/V1/guest-carts/${cartId}/totals-information`, callBack, 'POST', {}, params)
    }

}