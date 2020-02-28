import Identify from 'src/simi/Helper/Identify';

const { simiStoreConfig } = Identify.getStoreConfig(); 

export const getGooglePublicKey = () => {
    if(simiStoreConfig.config && simiStoreConfig.config.google_public_key) {
        return simiStoreConfig.config.google_public_key
    }

    return null
}

export const getEasyBanner = (id) => {
    if(simiStoreConfig.config && simiStoreConfig.config.easy_banners) {
        return simiStoreConfig.config.easy_banners.items.find(item => item.identifier === id);
    }

    return null
}

export const getProductLabel = () => {
    if(simiStoreConfig.config && simiStoreConfig.config.product_label) {
        return simiStoreConfig.config.product_label;
    }

    return null
}