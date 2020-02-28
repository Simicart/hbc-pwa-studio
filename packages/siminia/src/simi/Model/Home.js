import { sendRequest } from 'src/simi/Network/RestMagento';

export const getHomeData = (callBack, getChildCat = falses) => {
    let params = {};
    if(getChildCat) {
        params = {
            get_child_cat: true
        }
    }
    sendRequest('rest/V1/simiconnector/homes', callBack, 'GET', params);
}