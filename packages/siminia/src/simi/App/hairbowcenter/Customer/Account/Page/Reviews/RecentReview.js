import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import { Link } from 'src/drivers';
import { StaticRate } from 'src/simi/App/hairbowcenter/BaseComponents/Rate'

const RecentReview = (props) => {
    const { recentData } = props;

    if (!recentData || recentData.total < 1) return null;
    const pathLocation = {
        pathname: '/product-reviews.html',
        state: { reviewData: recentData }
    }

    const arrayDataRecent = recentData.customerreviews.slice(0, 3);

    const renderBlockContent = () => {
        let html = null;
        if (arrayDataRecent.length) {
            const reV = arrayDataRecent.map((review, idx) => {
                const detailLocation = {
                    pathname: `/review-detail.html/${review.entity_id}`,
                    state: {
                        reviewData: review
                    }
                }

                return <li className="item" key={idx}>
                    <strong className="product-name">
                        <Link to={detailLocation}>{Identify.__(review.name)}</Link>
                    </strong>
                    <div className="rating-summary">
                        <span className="label"><span>{Identify.__("Rating:")}</span></span>
                        <StaticRate rate={review.rate_points} classes={{}} />
                    </div>
                </li>
            });
            html = <ol className="items">
                {reV}
            </ol>
        }
        return html;
    }


    return <div className="block block-reviews-dashboard">
        <div className="block-title">
            <strong>{Identify.__("My Recent Reviews")}</strong>
            <Link to={pathLocation} className="action view"><span>{Identify.__("View All")}</span></Link>
        </div>
        <div className="block-content">
            {renderBlockContent()}
        </div>
    </div>
}

export default RecentReview;
