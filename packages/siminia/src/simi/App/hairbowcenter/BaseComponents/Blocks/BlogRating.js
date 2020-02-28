import React from 'react';
import { StaticRate } from 'src/simi/App/hairbowcenter/BaseComponents/Rate'

require("./blog-rating.scss");
const $ = window.$;

const BlogRating = (props) => {
    const { data, type } = props;
    if (!data || !type) {
        return null;
    }

    const renderRandom = (total) => {
        $(function () {
            var n = 0;
            setInterval(function () {
                n = Math.floor((Math.random() * total));
                $(".sa-review-wrapper").hide();
                $(".blog-ratings-wrapper").find('.sa-review-wrapper:eq(' + n + ')').show();
            }, 3000);
        });
    }

    let html = null;
    let renderJs = null;

    const parseData = JSON.parse(data);
    if (parseData.hasOwnProperty(`${type}`) && parseData[type]) {
        const typeData = parseData[type];
        html = typeData.map((review, idx) => {
            return <div className="sa-review-wrapper" key={idx} onClick={() => window.open(review.url, "shopper approved", "width=500,height=600")}>
                <div className="rate-outer">
                    <StaticRate rate={Number(review.stars)} classes={{}} />
                </div>
                {review.author && <div className="shopper_approved_author">{review.author}</div>}
                {review.time && <span>{review.time}</span>}
                {review.comment && <div className="sa-comments">{review.comment}</div>}
            </div>
        });

        if (typeData.length > 1) {
            renderJs = renderRandom(typeData.length);
        }
    }

    return <div className="blog-ratings-wrapper">
        {html}
        {renderJs}
    </div>
}

export default BlogRating;
