import React from 'react';
import { func, string } from 'prop-types';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { updateCoupon } from 'src/simi/Model/Cart';
import {smoothScrollToView} from 'src/simi/Helper/Behavior'
import Identify from 'src/simi/Helper/Identify';

require ('./style.scss')

const Coupon = (props) => {
    const { value, toggleMessages, getCartDetails } = props;
    let countClick = false;
    let clearCoupon = false;
    const handleCoupon = (type = '') => {
        let coupon = document.querySelector('#coupon_code').value;
        if (!coupon && type !== 'clear') {
            toggleMessages([{ type: 'error', message: 'Please enter coupon code', auto_dismiss: true }]);
            return null;
        }
        if(type === 'clear'){
            clearCoupon = true
            coupon = ''
        }
        showFogLoading()
        const params = {
            coupon_code: coupon
        }
        updateCoupon(processData, params)
    }

    const processData = (data) => {
        let text = '';
        let success = false;
        if (data.message) {
            const messages = data.message;
            for (let i in messages) {
                const msg = messages[i];
                text += msg + ' ';
            }
        }
        if (data.total && data.total.coupon_code) {
            success = true;
        }
        if(clearCoupon){
            clearCoupon = false
            success = true
            document.querySelector('#coupon_code').value = ''
        }
        if (text) {
            toggleMessages([{ type: success ? 'success' : 'error', message: text, auto_dismiss: false }]);
            smoothScrollToView($('#root'));
        }
        getCartDetails();
        hideFogLoading();
    }

    const handleOpenDiscount = () => {
        if(window.innerWidth < 768) {
            if(countClick) {
                countClick = false
                document.querySelector('#coupon-field').classList.remove('coupon-open')
            } else {
                countClick = true
                document.querySelector('#coupon-field').classList.add('coupon-open')
            }
           
        }
     
    }

    return (
        <div className="cart-discount">
            <div className="block-discount"> 
                <div className="title" onClick={() => handleOpenDiscount()}>
                    <strong id="block-discount-heading">{Identify.__('Apply Discount Code')}</strong>
                </div>
                <div className="content" id="coupon-field">
                    <div className="fieldset-coupon">
                        <div className="field">
                            <div className="control">
                                <input type="text" className="input-text" id="coupon_code" placeholder="Enter discount code" defaultValue={value}/>
                            </div>
                        </div>
                        <div className="actions-toolbar">
                            <div className="primary">
                                <button className="button-primary" onClick={() => handleCoupon()}>{Identify.__('Apply Discount')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    // <div className='coupon-code'>
    //     <div className="coupon-code-title">{Identify.__('Promo code')}</div>
    //     <div className="coupon-code-area-tablet">
    //         <input id="coupon_field" type="text" placeholder={Identify.__('enter code here')}  />
    //         {value && <button className='btn-clear-coupon' onClick={()=>handleCoupon('clear')}>
    //                     <Close style={{width:15,height:15}}/>
    //                 </button>   }
    //     </div>
    //     <Whitebtn id="submit-coupon" className={`${Identify.isRtl() ? "submit-coupon-rtl" : 'submit-coupon'}`}  text={Identify.__('Apply')} />
    // </div>
}

Coupon.propTypes = {
    value: string,
    toggleMessages: func,
    getCartDetails: func
}
export default Coupon;
