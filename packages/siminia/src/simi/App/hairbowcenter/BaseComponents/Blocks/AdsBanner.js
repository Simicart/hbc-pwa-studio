import React from 'react';
import { countEasyBannerPoint } from 'src/simi/App/hairbowcenter/Model/EasyBanner';
import { Link } from 'src/drivers';
require("./ads-banner.scss");

const AdsBanner = (props) => {
    const { data } = props;
    const { target } = data;

    const countPoint = () => {
        if (!data.banner_id) {
            return;
        }

        countEasyBannerPoint(countCallBack, data.banner_id);
    }

    function countCallBack(data) {
        console.log(data)
    }

    const img = <img src={data.image} alt={data.title} />;

    let linkHTML = null;
    const pattern = /^((http|https|ftp):\/\/)/;

    if (pattern.test(data.url)) {
        linkHTML = <a href={data.url} onClick={() => countPoint()} className="easybanner-image-link">
            {img}
        </a>
    } else {
        let optimizeLink = data.url;
        const dtaUrl = data.url;
        if (dtaUrl.charAt(0) !== '/') {
            optimizeLink = '/' + optimizeLink;
        }
        linkHTML = <Link to={optimizeLink} onClick={() => countPoint()} className="easybanner-image-link">
            {img}
        </Link>
    }


    return <div {...props} className="easybanner-banner banner-left-sidebar-reviews-banner">
        {linkHTML}
    </div>
}

export default AdsBanner;
