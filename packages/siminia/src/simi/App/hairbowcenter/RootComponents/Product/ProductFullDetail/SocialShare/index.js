import React, { Component } from 'react';
import Facebook from './facebook';
import Twitter from './twitter';
import Pinterest from './pinterest';
import Googleplus from './googleplus';
import Identify from 'src/simi/Helper/Identify';
import {cateUrlSuffix} from 'src/simi/Helper/Url';

class SocialShare extends Component {
    constructor(props) {
        super(props);
        this.configs = Identify.getStoreConfig();
    }
    
    render() {
        let currentUrl = window.location.href;
        if(this.props.product.url_key) {
            currentUrl = window.location.origin + '/' + this.props.product.url_key + cateUrlSuffix()
        }
        const { config }  = this.configs.simiStoreConfig;
        if(config.product_detail_configs.social_share) {
            const {social_share} = config.product_detail_configs;
            return (
                <div className="rewardssocial-buttons">
                    {social_share.facebook && <Facebook url={currentUrl} facebook={social_share.facebook} product={this.props.product}/>}
                    {social_share.twitter && social_share.twitter.is_active && <Twitter url={currentUrl} product={this.props.product}/>}
                    {social_share.pinterest && social_share.pinterest.is_active && <Pinterest url={currentUrl} product={this.props.product}/>}
                    {social_share.google_plus && social_share.google_plus.is_active && <Googleplus url={currentUrl} product={this.props.product}/>}
                    <div className="status-message" id="status-message">{Identify.__('Earn Reward Points for sharing!')}</div>
                </div>
            );
        }

        return null
    }
}

export default SocialShare;