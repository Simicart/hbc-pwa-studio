import { sendRequest } from 'src/simi/Network/RestMagento';

export const submitComment = (callBack, params) => {
    sendRequest(`/rest/V1/simiconnector/blogcomments`, callBack, 'POST', {}, params)
}
