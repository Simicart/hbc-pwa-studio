import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import ReactHTMLParse from 'react-html-parser'
require('./intro.scss')

const Intro = props =>  {
    const { simiStoreConfig } = Identify.getStoreConfig();
    if(simiStoreConfig && simiStoreConfig.config && simiStoreConfig.config.home_configs && simiStoreConfig.config.home_configs.our_company_config) {
        const config = simiStoreConfig.config.home_configs.our_company_config;
        return (
            <div className="company-intro"> 
                <h2 className="filterproduct-title">
                    <span className="content"><strong>Our Company</strong></span>
                    <hr className="home-middle-line"/>
                </h2>
                {ReactHTMLParse(config)}
            </div>
        );
    }

    return null;
}

export default Intro;