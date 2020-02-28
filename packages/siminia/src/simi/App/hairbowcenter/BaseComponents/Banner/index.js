import React from 'react';
import { Link } from 'react-router-dom';
import Identify from 'src/simi/Helper/Identify';

const Banner = props => {
    const { simiStoreConfig } = Identify.getStoreConfig();
    const easyBanner = simiStoreConfig.config.easy_banners
    const renderItem = () => {
        const banner = easyBanner.items.find(item => item.identifier === props.bannerIdentify);
        if(banner) {
            return (
                <Link to={banner.url} className={props.className}>
                    <img className="img-responsive" src={banner.image} alt=""/>
                </Link>
            )
        }

        return null;
    }

    return renderItem()
}

export default Banner;