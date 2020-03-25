import { sendRequest } from 'src/simi/Network/RestMagento';

export const getOptionList = (callBack, params = {}) => {
    const getParams = {
        get_options: 1,
        limit: 9999,
        ...params
    }

    sendRequest(`/rest/V1/simiconnector/attributepages`, callBack, 'GET', getParams)
}

export const getOption = (callBack, id) => {
    sendRequest(`/rest/V1/simiconnector/attributepages/${id}`, callBack, 'GET')
}
