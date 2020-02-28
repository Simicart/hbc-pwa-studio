import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import AdsBanner from 'src/simi/App/hairbowcenter/BaseComponents/Blocks/AdsBanner';
import {getEasyBanner} from '../../../../Helper'

const SideBanner = props => {
    const {simiStoreConfig} = Identify.getStoreConfig();
    let bannerData = null
    if(simiStoreConfig.config.product_detail_configs && simiStoreConfig.config.product_detail_configs.banner_config) {
       bannerData = getEasyBanner(simiStoreConfig.config.product_detail_configs.banner_config);
    }

    if(!bannerData) return null;

    return (
        <div className="product-detail-banner-sidebar"> 
            <AdsBanner data={bannerData}/>
        </div>
    );
    
}

export default SideBanner;