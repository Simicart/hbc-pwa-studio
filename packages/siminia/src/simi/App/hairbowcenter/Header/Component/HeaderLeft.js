import React from 'react';
import Identify from "src/simi/Helper/Identify";
import ReactHTMLParser from 'react-html-parser';

const HeaderLeft = (props) => {
    const storeConfigs = Identify.getStoreConfig();
    if (!storeConfigs) return null;

    const hasHeadTopConfig = storeConfigs && storeConfigs.simiStoreConfig.config && storeConfigs.simiStoreConfig.config.header_configs;
    if (!hasHeadTopConfig) return null;

    return hasHeadTopConfig ? <div className="custom-block-left">
        {ReactHTMLParser(hasHeadTopConfig.header_left.toString().replace(/\/Store/g, '').replace(/\/contacts/g, '/contact.html'))}
    </div> : null;
}

export default HeaderLeft;
