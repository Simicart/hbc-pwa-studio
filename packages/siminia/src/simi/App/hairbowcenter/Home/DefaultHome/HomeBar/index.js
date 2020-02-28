import React from 'react';
import Identify from 'src/simi/Helper/Identify';
require('./homebar.scss');

const HomeBar = props => {
    const { simiStoreConfig } = Identify.getStoreConfig();

    const renderItems = (items) => {
        return items.map((item, index) => (
            <div className="col-md-4" key={index}>
                <em className={item.icon_class}></em>
                <div className="text-area">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                </div>
            </div>
        ))
    }

    if(simiStoreConfig.config && simiStoreConfig.config.shop_support) {
        const items = simiStoreConfig.config.shop_support;
        return (
            <div className="container">
                <div className="row">
                    {renderItems(items)}
                </div>
            </div>
        );
    }


}

export default HomeBar;