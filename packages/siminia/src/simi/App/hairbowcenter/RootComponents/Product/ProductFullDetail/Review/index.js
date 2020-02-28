import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import ReviewList from './ReviewList';
import NewReview from './NewReview';
import { Link } from 'react-router-dom';
require('./reviews.scss');

const Review = props => {
    const {isSignedIn, product, toggleMessages} = props;
    return (
        <div className="product-item-content review" id="reviews">
            <div className="product-review-container">
                <ReviewList product_id={product.id}/>
                <div className="block review-add">
                    <div className="block-content" id="review-form">
                        {isSignedIn ? <NewReview product={product} toggleMessages={toggleMessages}/> : (
                            <div className="message info notlogged">
                                <div>
                                    Only registered users can write reviews. Please 
                                    <Link to="/login.html"> Sign in </Link>
                                    or
                                    <Link to="/create-account.html"> create an account</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
        </div>
    );

}

export default Review;