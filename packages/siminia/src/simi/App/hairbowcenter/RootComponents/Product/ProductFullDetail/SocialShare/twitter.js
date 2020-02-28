import React, { useEffect } from 'react';
import {SocialShare} from '../../../../Model/Product'
import {cateUrlSuffix} from 'src/simi/Helper/Url';
const $ = window.$

const Twitter = props => {
    const {url, product} = props

    const handleCallBack = (data) => {
        if(data.message) {
            $('#status-message').text(data.message);
        }
    }

    const loadRewardApi = () => {
        const payload = {
            url: product.url_key + cateUrlSuffix(),
            type: 'twitter'
        }
        SocialShare(handleCallBack, payload);
    }

    useEffect(() => {
        if(!window.twttr) {
            window.twttr = (function (d, s, id) {
                var t, js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src= "https://platform.twitter.com/widgets.js";
                fjs.parentNode.insertBefore(js, fjs);
                return window.twttr || (t = { _e: [], ready: function (f) { t._e.push(f) } });
              }(document, "script", "twitter-wjs"))
        }
  
        window.twttr.ready(function(twttr) {
            twttr.widgets.createShareButton(
                url,
                document.getElementById('twitter-embed')
            )
            twttr.events.bind('tweet', function(event) {
                //add ur post tweet stuff here 
                loadRewardApi()
            });
        });

        return () => {
            window.twttr.events.unbind('tweet')
        }
    }, []);

    return (
        <div id="twitter-embed" className="buttons-twitter-like">
            {/* <a href={`https://twitter.com/share?${url}`} className="twitter-share-button" data-show-count="false">Tweet</a> */}
        </div>
    );
    
}

export default Twitter;