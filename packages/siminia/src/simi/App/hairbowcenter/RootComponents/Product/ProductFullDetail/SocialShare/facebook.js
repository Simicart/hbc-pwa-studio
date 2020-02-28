import React, { useEffect } from 'react';
import {SocialShare, UnShare} from '../../../../Model/Product'
import {cateUrlSuffix} from 'src/simi/Helper/Url';
const $ = window.$;

const Facebook = props => {
    const {url, facebook, product} = props

    const callBackSocialShare = (data) => {
        if(data.message) {
            $('#status-message').text(data.message);
        }
    }

    const callBackUnShare = (data) => {
        if(data.message) {
            $('#status-message').text(data.message);
        }
    }

    const loadAddRewardPoint = (type) => {
        const payload = {
            url: product.url_key + cateUrlSuffix(),
            type: 'facebook-like'
        }
        SocialShare(callBackSocialShare, payload)
    }

    const loadRemoveRewardPoint = () => {
        const payload = {
            url: product.url_key + cateUrlSuffix(),
            type: 'unlike'
        }
        UnShare(callBackUnShare, payload)

    }

    const callBackLike = () => {
        loadAddRewardPoint()
    }

    const callBackUnlike = () => {
        loadRemoveRewardPoint()
    }

    const loadFacebookApi = () => {
            // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/" + facebook.fb_local_code + "/all.js#xfbml=1&appId=" + facebook.fb_app_id + "&version=" + facebook.fb_version;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        if(!window.FB) {
            window.fbAsyncInit = function() {   
                FB.Event.subscribe('xfbml.render', function(b) {
                    FB.Event.subscribe('edge.create', callBackLike);
                    FB.Event.subscribe('edge.remove', callBackUnlike);
                });
            };
        } else {
            window.FB.XFBML.parse(document.getElementById('facebook-like'));
        }
    }

    useEffect(() => {
        loadFacebookApi()
    }, [])

    const handleShareFacebook = () => {
        FB.ui({
            method: 'share',
            display: 'popup',
            href: url,
        }, function (response) {
            if (response === null) {
                console.log('post was not shared');
            } else {
                loadRewardPoint('facebook-share')
            }
        });
    }

    const renderButtonLike = () => {
        return (
            <div id="facebook-like" className="buttons-facebook-like">
                <div className="fb-like" 
                    data-href={url} 
                    data-layout="button"
                    data-action="like"
                    data-show-faces="false"
                    data-share="false"
                    data-font="arial"
                    data-width="61"
                    data-height="20"
                    data-colorscheme="light">
                </div>
            </div>
        )
    }

    const renderShareButton = () => {
        return (
            <div className="buttons-fb-share">
                <div id="rewards_fb_share" onClick={() => handleShareFacebook()}>
                    <span className="_49vg"><img className="_1pbs inlineBlock img" src="https://www.facebook.com/rsrc.php/v3/yq/r/5nnSiJQxbBq.png" alt="" width="16" height="16" /></span>
                    <span className="title">Share</span>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            {facebook && facebook.like_is_active && renderButtonLike()}
            {facebook && facebook.share_is_active && renderShareButton()}
        </React.Fragment>   
        
    );
}

export default Facebook;