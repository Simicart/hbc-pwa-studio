import React from 'react';
import { resourceUrl } from 'src/simi/Helper/Url'
import {SocialShare} from '../../../../Model/Product'
import {cateUrlSuffix} from 'src/simi/Helper/Url';
const $ = window.$;

const Pinterest = props => {
    const {product, url} = props 
    const baseURl = window.location.origin;
    let img = product.media_gallery_entries && product.media_gallery_entries.length > 0 ? baseURl + resourceUrl(product.media_gallery_entries[0].file, { type: 'image-product'}) : null;
    if(product.simiExtraField && product.simiExtraField.attribute_values && product.simiExtraField.attribute_values.share_image) {
        img = product.simiExtraField.attribute_values.share_image
    }
    const name = encodeURIComponent(product.name)

    const handleCallBack = (data) => {
        if(data.message) {
            $('#status-message').text(data.message);
        }
    }

    const handleRewardPoint = () => {
        const payload = {
            url: product.url_key + cateUrlSuffix(),
            type: 'pinterest'
        }
        SocialShare(handleCallBack, payload);
    }

    return (
        <div id="buttons-pinterest-pin" className="buttons-pinterest-pin" >
            <a href={`https://www.pinterest.com/pin/create/button/?url=${url}&media=${img}&description=${name}`} data-pin-do="buttonPin" data-pin-config="none" target="_blank" onClick={handleRewardPoint}>
                <img src="//assets.pinterest.com/images/pidgets/pin_it_button.png" alt="printerest-share" />
            </a>
        </div>
    );
    
}

export default Pinterest;