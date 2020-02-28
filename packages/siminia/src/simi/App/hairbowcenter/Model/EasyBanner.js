import { sendRequest } from 'src/simi/Network/RestMagento';

export const countEasyBannerPoint = (callBack,id) => {
    sendRequest(`/rest/V1/simiconnector/easybanners/${id}`, callBack, 'GET', {})
}
