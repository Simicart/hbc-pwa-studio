import { sendRequest } from 'src/simi/Network/RestMagento';

export const getMyRewardPoints = (callBack) => {
    sendRequest(`/rest/V1/simiconnector/rewards`, callBack, 'GET', {})
}

export const postTicket = (callBack, payload) => {
    sendRequest(`rest/V1/simiconnector/tickets`, callBack, "POST", {}, payload);
}

export const uploadFiles = (callBack, payload) => {
    sendRequest(`rest/V1/simiconnector/uploadfiles`, callBack, "POST", {}, payload);
}
