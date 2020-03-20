import React, { useState, useEffect } from 'react';
import EmptyData from './../../Components/EmptyData';
import Identify from 'src/simi/Helper/Identify';
import Loading from "src/simi/BaseComponents/Loading";
import { getCustomerReviewById } from 'src/simi/App/hairbowcenter/Model/Customer';
import { StaticRate } from 'src/simi/App/hairbowcenter/BaseComponents/Rate'
import Image from 'src/simi/BaseComponents/Image'
import { productUrlSuffix, resourceUrl } from 'src/simi/Helper/Url';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { Link } from 'src/drivers';

const ReviewDetail = (props) => {
    const { history, reviewId } = props;
    smoothScrollToView($('#root'));
    const defaultData = history.location.state.hasOwnProperty('reviewData') && history.location.state.reviewData ? history.location.state.reviewData : null;
    const [data, setData] = useState(defaultData);

    function callbackReviewDetail(data) {
        setData(data);
    }

    useEffect(() => {
        if (!data && reviewId) {
            getCustomerReviewById(callbackReviewDetail, reviewId)
        }
    }, []);

    if (!data)
        return <EmptyData message={Identify.__("Not found review id.")} />

    const productLocation = `/${data.product_url}${productUrlSuffix()}`;

    let date = Date.parse(data.review_created_at);
    date = new Date(date);
    let m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    date = date.getDate() + "/" + m + "/" + date.getFullYear();
    const image = data.product_image ? resourceUrl(data.product_image, { type: 'image-product', width: 640 }) : null;

    return <div className="customer-review view">
        <div className="product-details">
            <div className="product-media">
                <Link to={productLocation}>
                    {<Image src={image} alt={data.name} />}
                </Link>
            </div>
            <div className="product-info">
                <h2 className="product-name">{data.name}</h2>
                <div className="product-reviews-summary">
                    <div className="rating-summary">
                        <StaticRate rate={data.reviews_product.rate} classes={{}} />
                    </div>
                    <div className="reviews-actions">
                        <Link className="action view" to={productLocation}>
                            {data.reviews_product.number} {Identify.__("Reviews")}
                        </Link>
                        <Link className="action add" to={productLocation}>{Identify.__("Add Your Review")}</Link>
                    </div>
                </div>
            </div>
        </div>
        <div className="review-details">
            <div className="title">
                <strong>{Identify.__("Your review")}</strong>
            </div>
            <div className="customer-review-rating">
                <div className="rating-summary item">
                    <span>{Identify.__("Rating ")}</span>
                    <StaticRate rate={data.rate_points} classes={{}} />
                </div>
                <div className="review-title">
                    {data.title}
                </div>
                <div className="review-content">
                    {data.detail}
                </div>
                <div className="review-date">
                    {Identify.__("Submitted on ")}
                    <time className="date">{date}</time>
                </div>
            </div>
        </div>
    </div>
}

export default ReviewDetail;
