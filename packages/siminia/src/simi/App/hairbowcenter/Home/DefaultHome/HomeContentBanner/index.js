import React from 'react';
import AdsBanner from 'src/simi/App/hairbowcenter/BaseComponents/Blocks/AdsBanner';
import Identify from 'src/simi/Helper/Identify';
import {getEasyBanner} from '../../../Helper'
require('./homecontentbanner.scss');

const HomeContentBanner = () => {
    const { simiStoreConfig } = Identify.getStoreConfig();
    let bannerData = null;
    if(simiStoreConfig.config && simiStoreConfig.config.home_configs) {
        const homeConfigs = simiStoreConfig.config.home_configs
        if(homeConfigs.home_banner_side_content) {
            bannerData = getEasyBanner(homeConfigs.home_banner_side_content);
        }
    }


    if(!bannerData)  return null
    
    return (
        <div className="home-banner-content">
            <h2 className="filterproduct-title">
                <hr className="home-middle-line banner"/>
            </h2>
            <div className="banner-wrapper">      
                <AdsBanner data={bannerData} className="easybanner-image-link"/>
            </div>
        </div>
    );
}

export default HomeContentBanner;