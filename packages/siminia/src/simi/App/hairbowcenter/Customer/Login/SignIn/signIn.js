import React, { Fragment } from 'react';
import Identify from 'src/simi/Helper/Identify'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import {Link} from 'react-router-dom'
import {validateEmail} from 'src/simi/Helper/Validation'

require('./signIn.scss');

const SignIn = props => {
    const {getRememberMe} = props

    const checkValidate = (inputs) => {
        let isAllow = 0;
        const validData = {}
        inputs.forEach((input) => {
            if(input.value === '' && input.name !== 'remember_me') {
                isAllow += 1
                document.querySelector(`#${input.name}`).classList.add('mage-error')
                document.querySelector(`#${input.name}-error`).textContent = Identify.__('This is a required field.')
            } else if (input.name === 'email' && !validateEmail(input.value)) {
                isAllow += 1
                document.querySelector(`#${input.name}`).classList.add('mage-error')
                document.querySelector(`#${input.name}-error`).textContent = Identify.__('Please enter a valid email address (Ex: johndoe@domain.com).')
            } else {
                if(input.name !== 'remember_me') {
                    validData[input.name] = input.value
                    document.querySelector(`#${input.name}`).classList.remove('mage-error')
                    document.querySelector(`#${input.name}-error`).textContent = ''
                }
                
            }
        })

        return {isAllow: isAllow === 0, validData}
    }

    const handleSigninSubmit = (e) => {
        e.preventDefault()
        const inputs = document.querySelectorAll('#login-form input')
        const checked = checkValidate(inputs)
        if(checked.isAllow && checked.validData) {
            const rememberMe = document.querySelector('#remember_me').checked ? 1 : 0;
            getRememberMe(rememberMe);
            props.onSignIn(checked.validData.email, checked.validData.password)
        }
    }

    return (
        <Fragment>
            {TitleHelper.renderMetaHeader({title: Identify.__('Login')})}
            <div className="page-title-wrapper">
                <h1 className="page-title">
                    <span className="base">{Identify.__('Customer Login')}</span>
                </h1>
            </div>
            <div className="columns">
                <div className="column main">
                    <div className="login-container">
                        <div className="block block-customer-login">
                            <div className="block-title">
                                <strong id="block-customer-login-heading">{Identify.__('Registered Customers')}</strong>
                            </div>
                            <div className="block-content">
                                <form action="" method="POST" id="login-form" className="form form-login" onSubmit={handleSigninSubmit} noValidate="novalidate">
                                    <fieldset className="fieldset login" data-hasrequired="* Required Fields">
                                        <div className="field note">{Identify.__('If you have an account, sign in with your email address.')}</div>
                                        <div className="field email required">
                                            <label htmlFor="email" className="label">
                                                <span>{Identify.__('Email')}</span>
                                            </label>
                                            <div className="control">
                                                <input id="email" type="email" className="input-text" name="email"/>
                                                <div className="mage-error" id="email-error"></div>
                                            </div>
                                        </div>
                                        <div className="field password required">
                                            <label htmlFor="password"><span>{Identify.__('Password')}</span></label>
                                            <div className="control">
                                                <input id="password" type="password" className="input-text" name="password"/>
                                                <div className="mage-error" id="password-error"></div>
                                            </div>
                                        </div>
                                        <div className="field choice persistent" id="remember-me-box">
                                            <input type="checkbox" name="remember_me" className="checkbox" id="remember_me"/>
                                            <label htmlFor="" className="label"><span>{Identify.__('Remember Me')}</span></label>
                                            <span className="tooltip wrapper">
                                                <a className="link tooltip toggle" href="#">{Identify.__("What's this?")}</a>
                                                <span className="tooltip content">
                                                    {Identify.__('Check "Remember Me" to access your shopping cart on this computer even if you are not signed in.')}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="actions-toolbar">
                                            <div className="primary">
                                                <button type="submit" className="action login primary">
                                                    <span>{Identify.__('Sign In')}</span>
                                                </button>
                                            </div>
                                            <div className="secondary">
                                                <Link to="/forgot-password.html" className="action remind">{Identify.__('Forgot Your Password?')}</Link>
                                            </div>
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                        <div className="block block-new-customer">
                            <div className="block-title">
                                <strong id="block-new-customer-heading">{Identify.__('New Customers')}</strong>
                            </div>
                            <div className="block-content">
                                <p>{Identify.__('Creating an account has many benefits: check out faster, keep more than one address, track orders and more.')}</p>
                                <div className="actions-toolbar">
                                    <div className="primary">
                                        <Link to="/create-account.html" className="action create primary" ><span>{Identify.__('Create an Account')}</span></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default SignIn;