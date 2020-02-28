import { sendRequest } from 'src/simi/Network/RestMagento';

export const setRememberMe = (callBack, rememberMe, setCheckout = false) => {
    sendRequest(`rest/V1/simiconnector/setrememberme`, callBack, 'GET', {remember_me: rememberMe, set_checkout: setCheckout}, {})
}

export const forgotPassword = (callBack, email, reGaptchaResponse) => {
    sendRequest('rest/V1/simiconnector/customers/forgetpassword', callBack, 'GET', {email, g_capcha_response: reGaptchaResponse});
}

export const getCustomerReviews = (callBack) => {
    sendRequest('rest/V1/simiconnector/customerreviews', callBack, 'GET', {});
}
export const getCustomerReviewById = (callBack, id) => {
    sendRequest(`rest/V1/simiconnector/customerreviews/${id}`, callBack, 'GET', {});
}
