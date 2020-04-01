import React, { useEffect, useState } from 'react';
import Identify from 'src/simi/Helper/Identify';
import { StaticRate } from 'src/simi/App/hairbowcenter/BaseComponents/Rate'

require("./blog-rating.scss");
const $ = window.$;

const BlogRating = (props) => {
    const {type} = props;
    
    const { simiStoreConfig } = Identify.getStoreConfig();
    let data = null;
    if(simiStoreConfig && simiStoreConfig.config && simiStoreConfig.config.review_json && simiStoreConfig.config.review_json[type]) {
        data = simiStoreConfig.config.review_json[type];
    }

    if (!data || !type) {
        return null;
    }

    const [loop, setLoop] = useState('');
    let ivl;

    const renderRandom = (total) => {
        $(function () {
            var n = 0;
            ivl = setInterval(function () {
                n = Math.floor((Math.random() * total));
                $(".sa-review-wrapper").hide();
                $(".blog-ratings-wrapper").find('.sa-review-wrapper:eq(' + n + ')').show();
            }, 3000);
        });
    }

    useEffect(() => {
        // Return a callback in useEffect and it will be called before unmounting.
        return () => {
          clearInterval(ivl);
        };
      }, []);


    let html = null;
    let renderJs = null;

    if (data.length && data.length > 0) {
        html = data.map((review, idx) => {
            const url = review.review_url[0] ? review.review_url[0] : null;
            const name = review.review_name[0] ? review.review_name[0] : null;
            const date = review.review_date[0] ? review.review_date[0] : null;
            const rating = (review.review_rating * 5)/100;
            return <div className="sa-review-wrapper" key={idx} onClick={() => window.open(url, "shopper approved", "width=500,height=600")}>
                <div className="rate-outer">
                    <StaticRate rate={Number(rating)} classes={{}} />
                </div>
                {name && <div className="shopper_approved_author">{name}</div>}
                {date && <span>{date}</span>}
                {review.review_comment && <div className="sa-comments">{review.review_comment}</div>}
            </div>
        });

        if (data.length > 1) {
            renderJs = renderRandom(data.length);
        } else {
            clearInterval(ivl);
        }


        return <div className="blog-ratings-wrapper">
            {html}
            {renderJs}
        </div>
    }

    return null;
}

export default BlogRating;
