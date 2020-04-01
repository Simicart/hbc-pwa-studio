import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import { showToastMessage } from 'src/simi/Helper/Message';
import {
    showFogLoading,
    hideFogLoading
} from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { createPassword } from 'src/simi/App/hairbowcenter/Model/Customer';
import Field from 'src/components/Field';
require('./style.scss');

const $ = window.$;

const ResetPassword = (props) => {
    let token = Identify.findGetParameter('token') ? Identify.findGetParameter('token') : false;

    const handleFormSubmit = e => {
        e.preventDefault()
        const inputs = document.querySelectorAll('#form-password-reset input.input-text')
        const checked = validation(inputs);
        if (checked.isAllow) {
            if (!token) {
                showToastMessage(Identify.__('Your link reset password is invalid !'));
            } else {
                showFogLoading()
                createPassword(createDone, {
                    rptoken: token,
                    password: checked.validData.password
                });
            }

        }
    }

    const validation = (inputs) => {
        let isAllow = 0;
        const validData = {}
        inputs.forEach((input) => {
            if (input.name === 'password') {
                if (input.value.length < 8) {
                    isAllow += 1
                    document.querySelector(`#${input.name}`).classList.add('mage-error')
                    document.querySelector(`#${input.name}-error`).textContent = Identify.__('Minimum length of this field must be equal or greater than 8 symbols. Leading and trailing spaces will be ignored.')
                } else if (!isPasswordComplexEnough(input.value)) {
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
                if (input.name !== 'is_subscribed' && input.name !== 'remember_me') {
                    document.querySelector(`#${input.name}`).classList.remove('mage-error')
                    document.querySelector(`#${input.name}-error`).textContent = ''
                    validData[input.name] = input.value
                }
            }
        })

        return { isAllow: isAllow === 0, validData }
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
    }

    const createDone = data => {
        if (data.errors) {
            let errorMsg = '';
            if (data.errors.length) {
                data.errors.map(error => {
                    errorMsg += error.message;
                });
                hideFogLoading();
                showToastMessage(errorMsg);
            }
        } else {
            hideFogLoading();
            smoothScrollToView($('#root'));
            const successMsg = Identify.__(
                'Updated new password successfully !'
            );
            // reset form
            $('.form')[0].reset();
            // clear user name and password save in local storage
            const savedUser = Identify.getDataFromStoreage(
                Identify.LOCAL_STOREAGE,
                'user_email'
            );
            const savedPassword = Identify.getDataFromStoreage(
                Identify.LOCAL_STOREAGE,
                'user_password'
            );
            if (savedUser && savedPassword) {
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_password');
            }
            showToastMessage(successMsg);
        }
    }

    const handleCheckPassword = (e) => {
        const password = e.target.value
        let error = ''
        if (password.length < 8) {
            error = Identify.__('Minimum length of this field must be equal or greater than 8 symbols. Leading and trailing spaces will be ignored.')
        } else if (!isPasswordComplexEnough(password)) {
            error = Identify.__('Minimum of different classes of characters in password is 2. Classes of characters: Lower Case, Upper Case, Digits, Special Characters.')
        } else {
            error = ''
        }
        if (error) {
            document.querySelector(`#password`).classList.add('mage-error')
        } else {
            document.querySelector(`#password`).classList.remove('mage-error')
        }
        document.querySelector(`#password-error`).textContent = error
        document.querySelector('#password-strength-meter-label').textContent = checkPassStrength(password)
    }

    const checkPassStrength = pass => {
        const score = scorePassword(pass);
        switch (true) {
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

    const scorePassword = pass => {
        let score = 0;
        if (!pass)
            return score;

        // award every unique letter until 5 repetitions
        const letters = {};
        for (let i = 0; i < pass.length; i++) {
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

        return parseInt(score, 10);
    }

    return (
        <React.Fragment>
            {TitleHelper.renderMetaHeader({
                title: Identify.__('Reset a Password')
            })}
            <div className="page-title-wrapper">
                <div className="page-title">
                    <span className="base">{Identify.__('Reset Your Password?')}</span>
                </div>
            </div>
            <div className="columns">
                <div className="column main">
                    <form className="form-password-reset" id="form-password-reset" onSubmit={handleFormSubmit} >
                        <fieldset className="fieldset">
                            <div className="field password required">
                                <label htmlFor="password" className="label"><span>{Identify.__('Password')}</span></label>
                                <div className="control">
                                    <input type="password" name="password" id="password" className="input-text" onChange={handleCheckPassword} />
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
                                <div className="control">
                                    <input type="password" name="password-confirmation" id="password-confirmation" className="input-text" />
                                    <div className="mage-error" id="password-confirmation-error"></div>
                                </div>
                            </div>
                        </fieldset>
                        <div className="actions-toolbar">
                            <div className="primary">
                                <button type="submit" className="action submit primary"><span>{Identify.__('Create password')}</span> </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapDispatchToProps = {
    toggleMessages
};

export default connect(
    null,
    mapDispatchToProps
)(ResetPassword);
