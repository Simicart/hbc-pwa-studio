import React, { Fragment } from 'react';
import TitleHelper from 'src/simi/Helper/TitleHelper'
import Identify from 'src/simi/Helper/Identify'
import {forgotPassword} from '../../../Model/Customer'
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'
import {showToastMessage} from 'src/simi/Helper/Message';
import {validateEmail, validateEmpty} from 'src/simi/Helper/Validation'
import {getGooglePublicKey} from '../../../Helper'
import ReCAPTCHA from "react-google-recaptcha";

require('./forgotPassword.scss');

const ForgotPassword = props => {
    const {toggleMessages, history} = props;
    const publicKey = getGooglePublicKey()
    let reCaptchaResponse = null

    const handleFormSubmit = (e) => {
        e.preventDefault()
        let isAllow = 0;
        const email = document.querySelector('#email').value;
        if(!validateEmpty(email)) {
            isAllow =+1
            document.querySelector(`#email`).classList.add('mage-error')
            document.querySelector(`#email-error`).textContent = Identify.__('This is a required field.')
        } else if(!validateEmail(email)) {
            isAllow =+1
            document.querySelector(`#email`).classList.add('mage-error')
            document.querySelector(`#email-error`).textContent = Identify.__('Please enter a valid email address (Ex: johndoe@domain.com).')
        } 
        
        if(publicKey) {
            if(!reCaptchaResponse) {
                isAllow =+1
                document.querySelector('#g-recaptcha-error').textContent = dentify.__('Please check the captcha box')
            }
        }
        
        if (isAllow === 0){
            showFogLoading()
            document.querySelector('#g-recaptcha-error').textContent = ''
            document.querySelector(`#email`).classList.remove('mage-error')
            document.querySelector(`#email-error`).textContent = ''

            forgotPassword(resetSubmited, email, reCaptchaResponse)
        }
    }

    const resetSubmited = (data) => {
        hideFogLoading()
        if (data && !data.errors) {
            let text = '';
            if (data.message) {
                const messages = data.message;
                for (const i in messages) {
                    const message = messages[i];
                    text += message + ' ';
                }
            }
            history.push('/login.html')
            toggleMessages([{type: 'success', message: text, auto_dismiss: true}])
        } else {
            let messages = ''
            data.errors.map(value => {
                messages +=  value.message
            })
            showToastMessage(messages)
        }
    }

    const handleChangeCaptcha = (value) => {
        reCaptchaResponse = value
    }

    return (
        <Fragment>
            {TitleHelper.renderMetaHeader({
                title: Identify.__('Forgot password')
            })}
            <div className="page-title-wrapper">
                <div className="page-title">
                    <span className="base">{Identify.__('Forgot Your Password?')}</span>
                </div>
            </div>
            <div className="columns">
                <div className="column main">
                    <form className="form-password-forget" id="form-password-forget" onSubmit={handleFormSubmit} novalidate="novalidate">
                        <fieldset className="fieldset">
                            <div className="field note">{Identify.__('Please enter your email address below to receive a password reset link.')}</div>
                            <div className="field email required">
                                <label htmlFor="email_address" className="label"><span>{Identify.__('Email')}</span></label>
                                <div className="control">
                                    <input type="email" name="email" id="email" className="input-text"/>
                                    <div className="mage-error" id="email-error"></div>
                                </div>
                            </div>
                            {publicKey && <div className="g-recaptcha" id="g-recaptcha">
                                <ReCAPTCHA
                                    sitekey={publicKey}
                                    onChange={handleChangeCaptcha}
                                />
                                <div className="mage-error" id="g-recaptcha-error"></div>
                            </div>}
                        </fieldset>
                        <div className="actions-toolbar">
                            <div className="primary">
                                <button type="submit" className="action submit primary">
                                    <span>{Identify.__('Reset My Password')}</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default ForgotPassword;
