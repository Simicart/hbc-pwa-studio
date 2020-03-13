import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import {submitQuestion} from 'src/simi/Model/Product';
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'
import {smoothScrollToView} from 'src/simi/Helper/Behavior'
import {getGooglePublicKey} from '../../../../Helper';
import ReCAPTCHA from "react-google-recaptcha";
const $ = window.$;

const QuestionForm = props => {
    const {productId, toggleMessages, setOpen} = props
    const publicKey = getGooglePublicKey()
    let reCaptchaResponse = null

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value
        if(value) {
            $(`#question-${name}`).text('');
        }
    }

    const checkFormatEmail = (email) => {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    }

    const checkValidation = (data) => {
        let countError = 0;
        const params = {};
        data.forEach(value => {
            if(value.value.trim() === '') {
                countError += 1;
                $(`#question-${value.name}`).text('This field is required.');
            }

            if(value.name === 'email' && !checkFormatEmail(value.value)) {
                $(`#question-email`).text('Email is not valid');
                countError += 1;
            }
            if(value.name !== 'g-recaptcha-response') {
                params[value.name] = value.value;
            }
        
        }) 
        
        if(publicKey) {
            if(reCaptchaResponse) {
                params['g-captcha-response'] = reCaptchaResponse
            } else {
                countError += 1;
                $('#g-recaptcha').text('Please check the captcha box')
            }
        }


        return { isValid: countError === 0, params} ;
    }

    const handleChangeCaptcha = (value) => {
        $('#g-recaptcha').text('')
        reCaptchaResponse = value
    }

    const callBackSubmitQuestion = (data) => {
        setOpen(true);
        hideFogLoading()
        smoothScrollToView($('#root'));
        if (data.message) {
            $('#question-form input.input-text').val('')
            $('#question-form textarea.input-text').val('')
            if(window.grecaptcha) {
                window.grecaptcha.reset()
            }
            toggleMessages([{
                type: 'success',
                message: Array.isArray(data.message)?data.message[0]:data.message,
                auto_dismiss: false
            }])
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = $('#question-form').serializeArray();
        const checkValid = checkValidation(data)
        if(checkValid.isValid) {
            showFogLoading()
            submitQuestion(callBackSubmitQuestion, checkValid.params);
        }
    }

    return (
        <div className="block">
            <div className="title block-title">
                <strong>{Identify.__('Ask Your Question')}</strong>
            </div>
            <div className="block-content">
                <form method="post" onSubmit={handleSubmit} id="question-form">
                    <div className="field note no-label">{Identify.__('Jot us a note and we’ll get back to you as quickly as possible.')}</div>
                    <input type="hidden" value={1} name="type_item_id"/>
                    <input type="hidden" value={productId} name="item_id"/>
                    <div className="question-fieldset">
                        <div className="field name required">
                            <label htmlFor="customer_name" className="label">
                                <span>{Identify.__('Name')}</span>
                            </label>
                            <div className="control">
                                <input type="text" name="customer_name" id="customer_name" className="input-text" onChange={(e) => handleChange(e)}/>
                            </div>
                            <div id="question-customer_name" className="form-validate" style={{color: 'red'}}></div>
                        </div>
                        <div className="field email required">
                            <label htmlFor="email" className="label">
                                <span>{Identify.__('Email')}</span>
                            </label>
                            <div className="control">
                                <input type="email" name="email" id="email" className="input-text" onChange={(e) => handleChange(e)}/>
                            </div>
                            <div id="question-email" className="form-validate" style={{color: 'red'}}></div>
                        </div>
                        <div className="field text required">
                            <label htmlFor="text" className="label">
                                <span>{Identify.__('Question')}</span>
                            </label>
                            <div className="control">
                                <textarea name="text" id="text" cols="5" rows="3" className="input-text" onChange={(e) => handleChange(e)}></textarea>
                            </div>
                            <div id="question-text" className="form-validate" style={{color: 'red'}}></div>
                        </div>

                        {publicKey && <div className="g-recaptcha">
                            <ReCAPTCHA
                                sitekey={publicKey}
                                onChange={handleChangeCaptcha}
                            />
                            <div id="g-recaptcha" className="form-validate" style={{color: 'red', marginBottom: '5px'}}></div>
                        </div>} 
                        <div className="actions-toolbar"> 
                            <div className="primary">
                                <button className="action submit primary" type="submit">
                                    <span>{Identify.__('Submit')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default QuestionForm;