import React, { useState, useEffect } from 'react';
import {getReviews} from 'src/simi/Model/Product';
import Loading from 'src/simi/BaseComponents/Loading';
import Identify from 'src/simi/Helper/Identify';
import Pagination from 'src/simi/App/hairbowcenter/BaseComponents/Pagination';
import StaticRate from '../../Component/StaticRate';
require('./reviewList.scss');

const ReviewList = props => {

    const {product_id} = props;
    const api_data = Identify.ApiDataStorage('product_list_review');
    const initData = (api_data && api_data instanceof Object && api_data.hasOwnProperty(product_id))?api_data[product_id]:null

    const [data, setData] = useState(initData)

    const renderListItem = () => {
        if(data && data.reviews && data.reviews.length) {
            return (
                <div className="list-review-item">
                    <Pagination data={data.reviews} renderItem={renderItem} showPerPageOptions={false} showInfoItem={false} limit={10} scrollEffect='#reviews'/>
                </div>
            )
        }
        return null;
    };

    const renderItem = (item)=>{
        if(item.hasOwnProperty('votes')){
            const rating_votes = item.votes.map((rate, index) => {
                const point = rate.value;
                return (
                   <div className="rating-votes" key={index}>
                       <div className="label-rate">{Identify.__(rate.label)}</div>
                       <div className="item-rating"><Rate rate={parseInt(point,10)} size={13}/></div>
                   </div>
               )
            });
            const created = (
                        <div className="item-created flex">
                            <span>{item.created_at}</span>
                            <span style={{margin : '0 5px'}}>{Identify.__('By')}</span>
                            <span>{item.nickname}</span>
                        </div>
                    )
            return(
                
                <div className="review-item item" key={item.review_id}>
                    <div className="item-title flex">{item.title}</div>
                    <div className="review-item-detail">
                        <div className="item-votes">
                            {rating_votes}
                        </div>
                        <div className="item-review-content" >
                            <div className="item-detail">{item.detail}</div>
                            {created}
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </div>
            )
        }

        return(
            <li className="item review-item" key={item.review_id}>
                <div className="review-title">{item.title}</div>
                <div className="review-ratings">
                    <div className="rating-summary item">
                        <span className="label rating-label">
                            <span>Rating</span>
                        </span>
                        <div className="rating-result"><StaticRate rate={item.rate_points} size={15}/></div>
                    </div>
                </div>
                <div className="review-content">{item.detail}</div>
                <div className="review-details">
                    <p className="review-author">
                        <span className="review-details-label">By </span>
                        <strong className="review-details-value">{item.nickname}</strong>
                    </p>
                    <p className="review-date">
                        <time>{' ' + item.created_at}</time>
                    </p>
                </div>
            </li>
        )
    };

    useEffect(() => {
        if(!data) {
            getReviews(apiCallBack, product_id)
        }
    });

    const apiCallBack = (data) => {
        if (data.errors) {
            const errors = data.errors;
            let text = "";
            for (const i in errors) {
                const error = errors[i];
                text += error.message + ' ';
            }
            if (text !== "") {
                Identify.showToastMessage(text);
            }
        } else {
            setData(data)
            const api_data = {};
            api_data[props.product_id] = data
            Identify.ApiDataStorage('product_list_review','update',api_data)
        }
    }

    if(!data){
        return (<Loading />);
    }

    if(data && data.reviews && data.reviews.length) {
        return (
            <div className="block review-list">
                <div className="block-title">
                    <strong>Customer Reviews</strong>
                </div>
                <div className="block-content">
                <ol className="items review-items">
                    {renderListItem()}
                </ol>
                </div>
            </div>
        )
    }

    return null
    
}
export default ReviewList