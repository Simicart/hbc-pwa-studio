import { sendRequest } from 'src/simi/Network/RestMagento';

export const getCrossSellProducts = (callBack, cartId) => {
    sendRequest(`rest/V1/simiconnector/crosssellproducts`, callBack, 'GET', {quote_id: cartId})
}

export const SocialShare = (callBack, payload) => {
    sendRequest(`rest/V1/simiconnector/socialshare`, callBack, "POST", {}, payload);
}

export const UnShare = (callBack, payload) => {
    sendRequest(`rest/V1/simiconnector/unshare`, callBack, "POST", {}, payload);
}

export const addProductStockAlert = (callBack, payload) => {
    sendRequest(`rest/V1/simiconnector/addproductstockalert`, callBack, "POST", {}, payload);
}