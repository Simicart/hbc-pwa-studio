import { sendRequest } from 'src/simi/Network/RestMagento';

export const getCatalogFeaturedList = (callBack) => {
    sendRequest(`/rest/V1/simiconnector/categoryfeaturedlistes`, callBack, 'GET', {});
}
