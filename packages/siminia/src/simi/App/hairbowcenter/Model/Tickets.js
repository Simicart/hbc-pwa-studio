import { sendRequest } from 'src/simi/Network/RestMagento';

export const getListTickets = (callBack, department = false) => {
    let params = {}
    if (department) params.department = 1
    sendRequest(`/rest/V1/simiconnector/tickets`, callBack, 'GET', params)
}

export const postTicket = (callBack, payload) => {
    sendRequest(`/rest/V1/simiconnector/tickets`, callBack, "POST", {}, payload);
}

export const getTicket = (callBack, id) => {
    sendRequest(`/rest/V1/simiconnector/tickets/${id}`, callBack, "GET", {});
}

export const uploadFiles = (callBack, payload) => {
    sendRequest(`/rest/V1/simiconnector/ticketuploads`, callBack, "POST", {}, payload);
}

export const closeTicket = (callBack, id) => {
    sendRequest(`/rest/V1/simiconnector/tickets/${id}`, callBack, "GET", { close: true });
}

export const replyTicket = (callBack, payload) => {
    sendRequest(`/rest/V1/simiconnector/tickets`, callBack, "POST", { reply: true }, payload);
}
