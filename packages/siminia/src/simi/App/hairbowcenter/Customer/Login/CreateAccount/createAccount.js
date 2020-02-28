import React from 'react';
import { shape, string } from 'prop-types';
import Identify from 'src/simi/Helper/Identify'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import { createAccount } from 'src/simi/Model/Customer'
import {showToastMessage} from 'src/simi/Helper/Message';
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading';
import {validateEmail, validateEmpty} from 'src/simi/Helper/Validation'
import ReCAPTCHA from "react-google-recaptcha";
import {getGooglePublicKey} from '../../../Helper'
require('./createAccount.scss')

const CreateAccount = props => {
    const { createAccountError, getRememberMe } = props;
    const publicKey = getGooglePublicKey()
    const errorMessage = createAccountError && (Object.keys(createAccountError).length !== 0) ? Identify.__('An error occurred. Please try again.'):null
    let registeringEmail = null
    let registeringPassword = null
    let reCaptchaResponse = null

    const initialValues = () => {
        const { initialValues } = props;
        const { email, firstName, lastName, ...rest } = initialValues;

        return {
            customer: { email, firstname: firstName, lastname: lastName },
            ...rest
        };
    }

    const isPasswordComplexEnough = (str = '') => {
        const count = {
            lower: 0,
            upper: 0,
            digit: 0,
            special: 0
        };
    
        for (const char of str) {
            if (/[a-z]/.test(char)) count.lower++;
            else if (/[A-Z]/.test(char)) count.upper++;
            else if (/\d/.test(char)) count.digit++;
            else if (/\S/.test(char)) count.special++;
        }
    
        return Object.values(count).filter(Boolean).length >= 2;
    };

    const scorePassword = pass => {
        let score = 0;
        if (!pass)
            return score;

        // award every unique letter until 5 repetitions
        const letters = {};
        for (let i=0; i<pass.length; i++) {
            letters[pass[i]] = (letters[pass[i]] || 0) + 1;
            score += 5.0 / letters[pass[i]];
        }

        // bonus points for mixing it up
        const variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            nonWords: /\W/.test(pass),
        }

        let variationCount = 0;
        for (let check in variations) {
            variationCount += (variations[check] === true) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;

        return parseInt(score,10);
    }

    const checkPassStrength = pass => {
        const score = scorePassword(pass);
        switch (true){
            case score > 70:
                return "Very Strong";
            case score > 50:
                return "Strong";
            case (score >= 30):
                return "Weak";
            default:
                return "No Password"
        }
    }

    const handleCheckPassword = (e) => {
        const password = e.target.value 
        let error = ''
        if(password.length < 8) {
            error = Identify.__('Minimum length of this field must be equal or greater than 8 symbols. Leading and trailing spaces will be ignored.')
        } else if(!isPasswordComplexEnough(password)) {
            error = Identify.__('Minimum of different classes of characters in password is 2. Classes of characters: Lower Case, Upper Case, Digits, Special Characters.')
        } else {
            error = ''
        }
        if(error) {
            document.querySelector(`#password`).classList.add('mage-error')
        } else {
            document.querySelector(`#password`).classList.remove('mage-error')
        }
        document.querySelector(`#password-error`).textContent = error
        document.querySelector('#password-strength-meter-label').textContent = checkPassStrength(password)
    }

    const handleChangeCaptcha = (value) => {
        reCaptchaResponse = value
    }

    const validation = (inputs) => {
        let isAllow = 0;
        const validData = {}
        inputs.forEach((input) => {
            if(!validateEmpty(input.value) && input.name !== 'remember_me' && input.name !== 'is_subscribed') {
                isAllow =+ 1
                document.querySelector(`#${input.name}`).classList.add('mage-error')
                document.querySelector(`#${input.name}-error`).textContent = Identify.__('This is a required field.')
            } else if (input.name === 'email' && !validateEmail(input.value)) {
                isAllow += 1
                document.querySelector(`#${input.name}`).classList.add('mage-error')
                document.querySelector(`#${input.name}-error`).textContent = Identify.__('Please enter a valid email address (Ex: johndoe@domain.com).')
            } else if (input.name === 'password') {
                if (input.value.length < 8) {
                    isAllow += 1
                    document.querySelector(`#${input.name}`).classList.add('mage-error')
                    document.querySelector(`#${input.name}-error`).textContent = Identify.__('Minimum length of this field must be equal or greater than 8 symbols. Leading and trailing spaces will be ignored.')
                } else if(!isPasswordComplexEnough(input.value)) {
                    isAllow += 1
                    document.querySelector(`#${input.name}`).classList.add('mage-error')
                    document.querySelector(`#${input.name}-error`).textContent = Identify.__('Minimum of different classes of characters in password is 2. Classes of characters: Lower Case, Upper Case, Digits, Special Characters.')
                } else {
                    validData[input.name] = input.value
                }
            } else if (input.name === 'password-confirmation' && input.value !== validData.password) {
                isAllow += 1
                document.querySelector(`#${input.name}`).classList.add('mage-error')
                document.querySelector(`#${input.name}-error`).textContent = Identify.__('Please enter the same value again.')
            } else {
                if(input.name !== 'is_subscribed' && input.name !== 'remember_me') {
                    document.querySelector(`#${input.name}`).classList.remove('mage-error')
                    document.querySelector(`#${input.name}-error`).textContent = ''
                    validData[input.name] = input.value
                }
            }
        })

        if(publicKey) {
            if(reCaptchaResponse) {
                validData['g-captcha-response'] = reCaptchaResponse
            } else {
                isAllow +=1
                document.querySelector('#g-recaptcha-error').textContent = Identify.__('Please check the captcha box')
            }
        }

        
        return {isAllow: isAllow === 0, validData}
    }

    const handleSubmit = e => {
        e.preventDefault()
        const inputs = document.querySelectorAll('#create-account-form input.input-text')
        const checked = validation(inputs)
        if(checked.isAllow) {
            showFogLoading()
            const params = checked.validData
            registeringEmail = params.email
            registeringPassword = params.password
            params.news_letter = document.querySelector('#is_subscribed').checked ? 1 : 0;
            const rememberMe = document.querySelector('#remember_me').checked ? 1 : 0;
            getRememberMe(rememberMe);
            createAccount(registerDone, params)
        }
    };

    const registerDone = (data) => {
        hideFogLoading()
        if (data.errors) {
            let errorMsg = ''
            if (data.errors.length) {
                data.errors.map(error => {
                    errorMsg += error.message
                })
                showToastMessage(errorMsg)
            }
        } else {
            props.onSignIn(registeringEmail, registeringPassword)
        }
    }


    return (
        <React.Fragment>
            {TitleHelper.renderMetaHeader({
                title:Identify.__('Create Account')
            })}
            <div className="page-title-wrapper">
                <h1 className="page-title"><span className="base">{Identify.__('Create New Customer Account')}</span></h1>
            </div>
            <div className="columns">
                <div className="column main">
                    <form id="create-account-form" className="form create account form-create-account" noValidate="novalidate" onSubmit={handleSubmit}>
                        <fieldset className="fieldset create info">
                            <legend className="legend"><span>{Identify.__('Personal Information')}</span></legend>
                            <div className="field field-name-firstname required">
                                <label htmlFor="firstname" className="label"><span>{Identify.__('First Name')}</span></label>
                                <div className="control">
                                    <input type="text" id="firstname" name="firstname" className="input-text required-entry"/>
                                    <div className="mage-error" id="firstname-error"></div>
                                </div>
                            </div>
                            <div className="field field-name-lastname required">
                                <label htmlFor="lastname" className="label"><span>{Identify.__('Last Name')}</span></label>
                                <div className="control">
                                    <input type="text" id="lastname" name="lastname" className="input-text required-entry"/>
                                    <div className="mage-error" id="lastname-error"></div>
                                </div>
                            </div>
                            <div className="field choice newsletter">
                                <input type="checkbox" name="is_subscribed" id="is_subscribed" className="checkbox"/>
                                <label htmlFor="is_subscribed" className="label">
                                    <span>{Identify.__("Yes, I'd like to receive email notifications of Sales, coupons, and new products!")}</span>
                                </label>
                            </div>
                        </fieldset>
                        <fieldset className="fieldset create account">
                            <legend className="legend">
                                <span>{Identify.__('Sign-in Information')}</span>
                            </legend>
                            <div className="field email required">
                                <label htmlFor="email" className="label"><span>{Identify.__('Email')}</span></label>
                                <div className="control">
                                    <input type="text" name="email" id="email" className="input-text required-entry"/>
                                    <div className="mage-error" id="email-error"></div>
                                </div>
                            </div>
                            <div className="field password required">
                                <label htmlFor="password" className="label"><span>{Identify.__('Password')}</span></label>
                                <div className="control">
                                    <input type="password" name="password" id="password" className="input-text" onChange={handleCheckPassword}/>
                                    <div className="mage-error" id="password-error"></div>
                                    <div className="" id="password-strength-meter-container">
                                        <div className="password-strength-meter" id="password-strength-meter">
                                            {Identify.__('Password Strength: ')} <span id="password-strength-meter-label">{Identify.__('No Password')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="field confirmation required">
                                <label htmlFor="password-confirmation" className="label"><span>{Identify.__('Confirm Password')}</span></label>
                                <div className ="control">
                                    <input type="password" name="password-confirmation" id="password-confirmation" className="input-text"/>
                                    <div className="mage-error" id="password-confirmation-error"></div>
                                </div>
                            </div>
                            <div id="remember-me-box" className="field choice persistent">
                                <input type="checkbox" name="remember_me" className="checkbox" id="remember_me"/>
                                <label htmlFor="remember_me" className="label"><span>{Identify.__('Remember Me')}</span></label>
                                <span className="tooltip wrapper">
                                    <a href="#" className="link tooltip toggle">{Identify.__("What's this?")}</a>
                                    <span className="tooltip content">
                                        {Identify.__('Check "Remember Me" to access your shopping cart on this computer even if you are not signed in.')}
                                    </span>
                                </span>
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
                                <button type="submit" className="action submit primary"><span>{Identify.__('Create an Account')}</span> </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
}

CreateAccount.propTypes = {
    createAccountError: shape({
        message: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    })
}

CreateAccount.defaultProps = {
    initialValues: {}
};

export default CreateAccount;
