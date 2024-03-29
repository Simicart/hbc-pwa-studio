import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import { Whitebtn } from 'src/simi/BaseComponents/Button'
import { SwipeableRate } from 'src/simi/BaseComponents/Rate'
import { submitReview } from 'src/simi/Model/Product'
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'
import {showToastMessage} from 'src/simi/Helper/Message'
import {smoothScrollToView} from 'src/simi/Helper/Behavior'

require('./newReview.scss');

const NewReview = props => {
    const {product} = props
    if (!product.simiExtraField || !product.simiExtraField.app_reviews || !product.simiExtraField.app_reviews.form_add_reviews || !product.simiExtraField.app_reviews.form_add_reviews.length) {
        return ''
    }
        
    const form_add_review = product.simiExtraField.app_reviews.form_add_reviews[0]
    const { rates } = form_add_review
    if (!rates) {
        return ''
    }
        

    const setData = (data) => {
        hideFogLoading()
        smoothScrollToView($('#root'))
        if (data.errors) {
            if (data.errors.length) {
                const errors = data.errors.map(error => {
                    return {
                        type: 'error',
                        message: error.message,
                        auto_dismiss: false
                    }
                })
                props.toggleMessages(errors)
            }
        } else {
            const message = [];
            if (data.message && data.message.length > 0) {
                data.message.map(mess => {
                    message.push({type: 'success', message: mess, auto_dismiss: false});
                })
                props.toggleMessages(message)
            }
        }
    }

    const handleSubmitReview = () => {
        const nickname = $('#new-rv-nickname').val()
        const title = $('#new-rv-title').val()
        const detail = $('#new-rv-detail').val()
        if (!nickname || !title || !detail) {
            showToastMessage(Identify.__('Please fill in all required fields'));
        } else {
            const params = {
                product_id: product.id,
                ratings: {},
                nickname,
                title,
                detail
            };
            const star = $('.select-star');
            for (let i = 0; i < star.length; i++) {
                const rate_key = $(star[i]).attr('data-key');
                const point = $(star[i]).attr('data-point');
                params.ratings[rate_key] = point;
            }
            showFogLoading()
            submitReview(setData, params)
        }
    }
    
    return (
        <div className="review-form">
            <h2 className="review-list-title">
                <span>{Identify.__("You're reviewing: ")}</span> 
                <strong>{Identify.__(product.name)}</strong>
            </h2>
            <div className="add-review-form" style={{padding: '8px 0'}}>
                <p className="your-rating-title">{Identify.__('Your Rating')}</p>
                <table className="table">
                    <tbody>
                    {rates.map((item, index) => {
                        return (
                            <tr key={index}>
                                {/* <td className="label-item" width="50px">{Identify.__(item.rate_code)}</td> */}
                                <td id={item.rate_code}><SwipeableRate rate={1} size={25} rate_option={item.rate_options} rate_code={item.rate_code} change={true}/></td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                <div className="form-content">
                    <div className="form-group">
                        <p className="label-item">{Identify.__('Nickname')}<span className="rq"> *</span></p>
                        <input type="text" id="new-rv-nickname" className="form-control" name="nickname" required/>
                    </div>
                    <div className="form-group">
                        <p className="label-item">{Identify.__('Summary')}<span className='rq'> *</span></p>
                        <input type="text" id="new-rv-title" className="form-control" name="title"  required/>
                    </div>
                    <div className="form-group">
                        <p className="label-item">{Identify.__('Detail')}<span className="rq"> *</span></p>
                        <textarea id="new-rv-detail" name="detail" className={`form-control`} rows="3" cols="5"></textarea>
                    </div>
                    <div className="btn-submit-review-ctn">
                        <button className="btn-submit-review" onClick={handleSubmitReview}>{Identify.__('Submit Review')}</button>
                    </div>
                </div>
            </div>
        </div>
            
    )
}

export default NewReview