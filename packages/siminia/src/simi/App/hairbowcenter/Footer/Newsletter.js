import React, { useState } from "react";
import TextBox from 'src/simi/BaseComponents/TextBox';
import { Whitebtn } from 'src/simi/BaseComponents/Button';
import Identify from "src/simi/Helper/Identify";
import {validateEmail, validateEmpty} from 'src/simi/Helper/Validation'
import {showToastMessage} from 'src/simi/Helper/Message'
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading'
import {subscribers} from '../Model/Newsletter';
require("./newsletter.scss");

const $ = window.$

const Newsletter = props => {
    const [email, setEmail] = useState('');

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if(!validateEmpty(email)) {
            $('#error-email-subscribe').text('This is a required field.')
        } else if(!validateEmail(email)) {
            $('#error-email-subscribe').text('Please enter a valid email address (Ex: johndoe@domain.com).')
        } else {
            $('#error-email-subscribe').text('')
            showFogLoading()
            subscribers(subscribersCallBack, email)
        }
    }

    const subscribersCallBack = (data) => {
        hideFogLoading()
        if(data.subscriber) {
            showToastMessage('You have been successfully subscribed to our newsletter.')
        }
    }

    return (
        <div className="subscribe-foot">
            <label htmlFor="">Enter your email address</label>
            <form
                className="form subscribe"
                onSubmit={e => handleOnSubmit(e)}
                noValidate
            >
                <TextBox
                    type="email"
                    name="email"
                    defaultValue={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <Whitebtn
                    type="submit"
                    className="btn-secondary"
                    text={Identify.__("Subscribe")}
                />
            </form>
            <div className="mage-error" id="error-email-subscribe"></div>
            {/* <SimiMutation mutation={CUSTOMER_NEWSLETTER_UPDATE}>
                {(updateCustomer, { loading, data }) => {
                    if (loading) return <Loading />
                    return (
                      
                    )
                }}
            </SimiMutation> */}
        </div>
    )
}

export default Newsletter;
