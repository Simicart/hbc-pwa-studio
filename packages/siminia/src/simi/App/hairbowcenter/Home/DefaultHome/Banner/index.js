import React from 'react'
import {Carousel} from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Identify from "src/simi/Helper/Identify";
import BannerItem from "./BannerItem";
require('./banner.scss');

const Banner = props => {
    const { history, isPhone} = props;
    const data = props.data.home.homebanners;
    const bannerCount = data.length;

    const slideSettings = {
        autoPlay: true,
        showArrows: false,
        showThumbs: false,
        showIndicators: (bannerCount && bannerCount !== 1) || isPhone ? false : true,
        showStatus: false,
        infiniteLoop: true,
        rtl: Identify.isRtl() === true,
        lazyLoad: true,
        dynamicHeight : true,
        transitionTime : 500
    }

    const bannerData = [];
    const bannersSorted = data.homebanners.sort((a, b) => a.sort_order - b.sort_order);
    bannersSorted.forEach((item, index) => {
        if (item.banner_name || item.banner_name_tablet) {
            bannerData.push(
                <div
                    key={index}
                    style={{cursor: 'pointer'}}
                >
                    <BannerItem item={item}  history={history} isPhone={isPhone}/>
                </div>
            )
        }

    })

    return (
        <div className="slide-area">
            <div className={`banner-homepage ${Identify.isRtl() ? 'banner-home-rtl' : ''}`}>
                <div className={`home-container`}>
                    <Carousel {...slideSettings}>
                        {bannerData}
                    </Carousel>
                </div>
            </div>
        </div>
    ) ;
}

export default Banner;
