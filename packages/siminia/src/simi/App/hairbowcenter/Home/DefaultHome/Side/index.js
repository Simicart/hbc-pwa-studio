import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import AdsBanner from 'src/simi/App/hairbowcenter/BaseComponents/Blocks/AdsBanner';
import {getEasyBanner} from '../../../Helper'
require('./side.scss')

const Side = props => {
    const { simiStoreConfig } = Identify.getStoreConfig();
    let dataBanner1 = null;
    let dataBanner2 = null;
    if(simiStoreConfig.config && simiStoreConfig.config.home_configs) {
        const homeConfigs = simiStoreConfig.config.home_configs
        if(homeConfigs.home_banner_side_1) {
            dataBanner1 = getEasyBanner(homeConfigs.home_banner_side_1) || null
        }
        if(homeConfigs.home_banner_side_2) {
            dataBanner2 = getEasyBanner(homeConfigs.home_banner_side_2) || null
        }
    }

    return (
        <div className="side-area">
            {dataBanner1 && <div className="item1">
                <AdsBanner data={dataBanner1}/>
            </div>}
            {dataBanner2 && <div className="item2">
                <AdsBanner data={dataBanner2}/>
            </div>}
        </div>
    );
}

export default Side;