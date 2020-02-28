import React from 'react'
import Identify from "src/simi/Helper/Identify";
import {showFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'

require('./settings.scss')

import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

const Setting  = (props) => {
    const merchantConfigs = Identify.getStoreConfig()

    const selectedStore = (store) => {
        showFogLoading()
        let appSettings = Identify.getAppSettings()
        const cartId = storage.getItem('cartId')
        const signin_token = storage.getItem('signin_token')
        const simiSessId = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, Constants.SIMI_SESS_ID)
        appSettings = appSettings?appSettings:{}
        CacheHelper.clearCaches()
        appSettings.store_id = parseInt(store.store_id, 10);
        if (cartId)
            storage.setItem('cartId', cartId)
        if (signin_token)
            storage.setItem('signin_token', signin_token)
        Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, Constants.SIMI_SESS_ID, simiSessId)
        Identify.storeAppSettings(appSettings);
        window.location.reload()
    }

    if (!merchantConfigs || !merchantConfigs.simiStoreConfig) {
        return ''
    }
        
    try {
        const storeList = merchantConfigs.simiStoreConfig.config.stores.stores
        if (storeList.length >= 1) {
            return storeList.map((store, index) => {
                return store.storeviews.storeviews.map((storeview, newIndex) => (
                    <div id="navigation-setting" className="mobile-navigation switcher language switcher-language" key={newIndex} style={{display: 'none'}}>
                        <div className="actions dropdown options switcher-options">
                            <div className="action toggle switcher-trigger" onClick={() => selectedStore(storeview)}>
                                <strong className="view-default">
                                    <span>{storeview.name}</span>
                                </strong>
                            </div>
                        </div>
                    </div>
                    
                ))
                
            })
        }
    } catch(err) {
        console.log(err)
    }
    return ''
}
export default Setting