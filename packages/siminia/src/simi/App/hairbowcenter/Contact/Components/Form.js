/* eslint-disable prefer-const */
import React, { Component } from 'react';
import Identify from 'src/simi/Helper/Identify';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading'
import { sendContact } from '../../../../Model/Contact';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import { getListTickets } from 'src/simi/App/hairbowcenter/Model/Tickets';
import ReCAPTCHA from "react-google-recaptcha";
import {getGooglePublicKey} from '../../Helper'
import {validateEmail, validateEmpty} from 'src/simi/Helper/Validation'
import Loading from 'src/simi/BaseComponents/Loading'
import {smoothScrollToView} from 'src/simi/Helper/Behavior'

const $ = window.$;

class Form extends Component {
    constructor(props) {
        super(props);
        this.googlePublicKey = getGooglePublicKey();
        this.reCaptchaResponse = null
        this.state = {
            departments: null
        }
    }

    componentDidMount() {
        if (!this.state.tickets) {
            getListTickets(this.callBackGetTickets, true)
        }
    }

    callBackGetTickets = (data) => {
        if (data.errors) {

        } else if (data.departments) {
            this.setState({departments: data.departments});
        }
    }

    proceedData = (data) => {
        if (data) {
            hideFogLoading()
            if (data.errors && data.err) {
                const errors = data.errors.map(error => {
                    return {
                        type: 'error',
                        message: error.message,
                        auto_dismiss: true
                    }
                });
                smoothScrollToView($('#root')) 
                this.props.toggleMessages(errors)
                if(window.grecaptcha) {
                    grecaptcha.reset();
                }
            } else {
                $('#contact-form input').val('')
                $('#contact-form textarea').val('')
                if(window.grecaptcha) {
                    grecaptcha.reset();
                }
                smoothScrollToView($('#root'))
                this.props.toggleMessages([{ type: 'success', message: Identify.__('Thank you, we will contact you soon'), auto_dismiss: true }])
            }
        } 
    }

    validateForm = (form) => {
        let isAllow = true;
        const data = {}
        form.map((value, index) => {
            if(!validateEmpty(value.value) && value.name !== 'phone') {
                isAllow = false
                $(`#${value.name}`).addClass('mage-error')
                $(`#${value.name}-error`).text('This is a required field.')
            } else if (value.name === 'email' && !validateEmail(value.value)) {
                isAllow = false
                $(`#${value.name}`).addClass('mage-error')
                $(`#${value.name}-error`).text('Please enter a valid email address (Ex: johndoe@domain.com).')
            } else {
                $(`#${value.name}`).removeClass('mage-error')
                $(`#${value.name}-error`).text('')
                data[value.name] = value.value
            }
        })

        if(this.googlePublicKey) {
            if(this.reCaptchaResponse) {
                data['g-recaptcha-response'] = this.reCaptchaResponse
            } else {
                $(`#captcha-message-error`).text('Please check captcha checkbox')
            }
        }


        return {isAllow, data}
    };

    // onChange = (e) => {
    //     if (e.target.value !== '' || e.target.value !== null) {
    //         $(e.target).removeClass('is-invalid');
    //         $(e.target).removeAttr('style')
    //     }
    // }

    handleChangeCaptcha = (value) => {
        this.reCaptchaResponse = value
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const form = $('#contact-form').serializeArray();
        const isValidated = this.validateForm(form);
        if (isValidated.isAllow) {
            showFogLoading();
            sendContact(isValidated.data, this.proceedData)
        }
    }

    renderDepartment(departments) {
        let dpt = [];
        for (const key in departments) {
            dpt.push(<option value={key} key={key}>{departments[key]}</option>);
        }

        return (
            <div className="field required">
                <label htmlFor="phone" className="label">{Identify.__('Department')}</label>
                <div className="control">
                    <select id="department_id" name="department_id">
                        {dpt}
                    </select>
                </div>
            </div>
        )
    }

    render() {
        // const errorEmail = <small className="invalid-email" style={{ display: 'none', color: "#fa0a11" }}>{Identify.__("Invalid email")}</small>
        const {departments} = this.state;
        if(!departments) return <Loading />
        return (
            <div className={'form-container'}>
                <form id="contact-form" onSubmit={this.handleSubmit}>
                    <div className="contacts-title">{Identify.__("Write")} <b>{Identify.__("Us")}</b></div>
                    <div className="row">
                        <div className="fieldset col-md-6">
                            <div className='field required'>
                                <label htmlFor="name" className="label">{Identify.__('Name')}</label>
                                <div className="control">
                                    <input type="text" onChange={this.onChange} className={`input-text`} name="name" id="name"/>
                                </div>
                                <div className="mage-error" id="name-error"></div>
                            </div>
                            <div className='field required'>
                                <label htmlFor="email" className="label">{Identify.__('Email')}</label>
                                <div className="control">
                                    <input type="text" onChange={this.onChange} className={`input-text`} name="email" id="email"/>
                                </div>
                                <div className="mage-error" id="email-error"></div>
                            </div>
                            <div className='field'>
                                <label htmlFor="phone" className="label">{Identify.__('Phone Number')}</label>
                                <div className="control">
                                    <input type="text" onChange={this.onChange} className={`input-text`} name="phone" />
                                </div>
                            </div>

                            {departments ? this.renderDepartment(departments) : null}

                            <div className="field required">
                                <label htmlFor="phone" className="label">{Identify.__('What’s on your mind?')}</label>
                                <div className="control">
                                    <textarea onChange={this.onChange} className={`input-text`} name="message" cols="30" rows="5" id="message"></textarea>
                                </div>
                                <div className="mage-error" id="message-error"></div>
                            </div>
                            {this.googlePublicKey && <div className="g-recaptcha">
                                <ReCAPTCHA
                                    sitekey={this.googlePublicKey}
                                    onChange={this.handleChangeCaptcha}
                                />
                                <div className="mage-error" id="captcha-message-error"></div>
                            </div>}

                            <div className="actions-toolbar">
                                <button type="submit" className="action submit primary">
                                    <span>{Identify.__('Submit')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

const mapDispatchToProps = {
    toggleMessages,
}

export default connect(null, mapDispatchToProps)(Form);
