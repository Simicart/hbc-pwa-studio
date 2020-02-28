import { sendRequest } from 'src/simi/Network/RestMagento';

export const getCategoryTrees = (callBack) => {
    sendRequest(`/rest/V1/simiconnector/categorytrees`, callBack)
}
