import React from 'react';
import Identify from "src/simi/Helper/Identify";
import ReactHTMLParser from 'react-html-parser';

const HeaderWelcome = (props) => {
    const storeConfigs = Identify.getStoreConfig();
    if (!storeConfigs) return null;

    const hasHeadTopConfig = storeConfigs && storeConfigs.simiStoreConfig.config && storeConfigs.simiStoreConfig.config.header_configs;
    if (!hasHeadTopConfig) return null;

    return hasHeadTopConfig && <li className="greet welcome">
        <span>{ReactHTMLParser(hasHeadTopConfig.header_welcome)}</span>
    </li>
}

export default HeaderWelcome;
