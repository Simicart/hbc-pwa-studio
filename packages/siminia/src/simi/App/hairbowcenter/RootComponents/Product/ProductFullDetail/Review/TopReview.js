import React from 'react'
import Identify from 'src/simi/Helper/Identify'
import StaticRate from '../../Component/StaticRate'
import {smoothScrollToView} from 'src/simi/Helper/Behavior'

require('./topReview.scss')

const TopReview = props => {
    const { app_reviews } = props
    return (
        <div className="product-reviews-summary">
            <div className="rating-summary">
                <StaticRate rate={app_reviews.rate} size={15}/>
            </div>
            
            <div className="reviews-actions">
                <span className="action view" onClick={() => smoothScrollToView($('#reviews'))}>
                    {app_reviews.number} {(app_reviews.number)?Identify.__('Reviews'):Identify.__('Review')}
                </span>
                <span className="action add" onClick={() => smoothScrollToView($('#review-form'))}>
                    {Identify.__('Add Your Review')}
                </span>
            </div>
        </div>
    )
}

export default TopReview