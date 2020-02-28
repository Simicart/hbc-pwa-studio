import { sendRequest } from 'src/simi/Network/RestMagento';

export const subscribers = (callBack, email) => {
    const params = {
        email
    }
    sendRequest(`/rest/V1/simiconnector/subscribers`, callBack, 'POST', {}, params)
}
