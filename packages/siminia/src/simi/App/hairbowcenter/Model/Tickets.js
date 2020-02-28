import { sendRequest } from 'src/simi/Network/RestMagento';

export const getListTickets = (callBack, department = false) => {
    let params = {}
    if(department) params.department = 1
    sendRequest(`/rest/V1/simiconnector/tickets`, callBack, 'GET', params)
}

export const postTicket = (callBack, payload) => {
    sendRequest(`rest/V1/simiconnector/tickets`, callBack, "POST", {}, payload);
}

export const uploadFiles = (callBack, payload) => {
    sendRequest(`rest/V1/simiconnector/uploadfiles`, callBack, "POST", {}, payload);
}
