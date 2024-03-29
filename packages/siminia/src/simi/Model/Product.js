import { sendRequest } from 'src/simi/Network/RestMagento';


export const uploadFile = (callBack, postData) =>{
    sendRequest(`rest/V1/simiconnector/uploadfiles`, callBack, 'POST', {}, postData)
}

export const getProductDetail = (callBack, productId) => {
    sendRequest(`rest/V1/simiconnector/products/${productId}`, callBack);
}

export const getReviews = (callBack, id) => {
    sendRequest(`rest/V1/simiconnector/reviews`, callBack, 'GET', {'filter[product_id]': id, limit: 999}, {})
}

export const submitReview =(callBack, params)=>{
    sendRequest(`rest/V1/simiconnector/reviews`, callBack, 'POST', {}, params)
}

export const getQuestions = (callBack, id) => {
    sendRequest(`rest/V1/simiconnector/questions/${id}`, callBack, 'GET', {limit: 999});
}

export const submitQuestion = (callBack, params) => {
    sendRequest(`rest/V1/simiconnector/questions`, callBack, 'POST', {}, params)
}

export const getDownloadableProducts = (callBack) => {
    sendRequest(`rest/V1/simiconnector/downloadableproducts`, callBack, 'GET', {})
}
