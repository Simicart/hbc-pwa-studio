import React, { useCallback } from 'react';
import Identify from 'src/simi/Helper/Identify';
import Button from 'src/components/Button';
import { Link } from 'react-router-dom';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { simiSignIn } from 'src/simi/Model/Customer';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { Util } from '@magento/peregrine';

require('./authentication.scss');

const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();
const $ = window.$;

const Authentication = (props) => {

    const { simiSignedIn, toggleMessages } = props;

    const handleSignIn = () => {
        const email = $(`#form-login-ck input[name=emailaddress]`).val()
        const password = $(`#form-login-ck input[name=password]`).val()
        if (!email || !password || !email.trim() || !password.trim()) {
            smoothScrollToView($("#id-message"));
            if (toggleMessages) {
                toggleMessages([{ type: 'error', message: Identify.__('Email and password is required to login!'), auto_dismiss: true }])
            }
            return;
        }
        const username = email;
        simiSignIn(setDataLogin, { username, password })
        showFogLoading()
    }

    const setDataLogin = (data) => {
        hideFogLoading();
        if (data && !data.errors) {
            if (data.customer_access_token) {
                Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, Constants.SIMI_SESS_ID, data.customer_identity)
                setToken(data.customer_access_token)
                handleActionSignIn(data.customer_access_token)
            } else {
                setToken(data)
                handleActionSignIn(data)
            }
        } else {
            smoothScrollToView($("#id-message"));
            if (toggleMessages) {
                toggleMessages([{ type: 'error', message: Identify.__('The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.'), auto_dismiss: true }])
            }
        }
    }

    const handleActionSignIn = useCallback(
        (value) => {
            simiSignedIn(value);
        },
        [simiSignedIn]
    )

    const forgotPasswordLocation = {
        pathname: '/login.html',
        state: {
            forgot: true
        }
    }

    const renderJs = () => {
        $(document).ready(function () {
            $('.action-auth-toggle').unbind().on('click', function () {
                $(this).closest('.authentication-ck').find('.authentication-dropdown').toggleClass('_show');
                /* if ($(this).closest('.authentication-ck').find('.authentication-dropdown').hasClass('_show')){
                    $(this).closest('.authentication-ck').append('<div class="dropdown-overlay modal-custom-overlay"></div>')
                }else{
                    $(this).closest('.authentication-ck').find('div.modal-custom-overlay').remove();
                } */
            });

            $('.action-close').unbind().on('click', function () {
                if(window.innerWidth < 768) {
                    $('.custom-slide').removeClass('show')
                    $('.modal-custom-overlay').removeClass('has-modal')
                } else {
                    $(this).closest('.authentication-dropdown').removeClass('_show');
                }
        
                /* $(this).closest('.authentication-ck').find('div.modal-custom-overlay').remove(); */
            });

            /* $('.modal-custom-overlay').on('click', function () {
                console.log($(this).remove())
                $(this).closest('.authentication-ck').find('.authentication-dropdown').removeClass('_show');
                $(this).remove();
            }); */

        })
    }

    return <div className="authentication-ck">
        <button type="button" className="action action-auth-toggle">
            <span>{Identify.__("Sign In")}</span>
        </button>
        <aside className="modal-custom authentication-dropdown">
            <div className="modal-inner-wrap">
                <header className="modal-header">
                    <button className="action-close" type="button"><span>{Identify.__("Close")}</span></button>
                </header>
                <div className="modal-content">
                    <div className="block-authentication">
                        <div className="block block-customer-login">
                            <div className="block-title">
                                <strong className="block-customer-login-heading">{Identify.__("Sign In")}</strong>
                            </div>
                            <div className="block-content">
                                <form action="" id="form-login-ck">
                                    <div className='email'>
                                        <div className={`address-field-label req`}>{Identify.__("Email Address")}</div>
                                        <input type="email" name="emailaddress" className="isrequired" id='email-ck' />
                                    </div>
                                    <div className='password'>
                                        <div className={`address-field-label req`}>{Identify.__("Password")}</div>
                                        <input id="password-ck" type="password" name="password" className="isrequired" />
                                    </div>
                                    <div className='btn_login_exist'>
                                        <Button
                                            className='button'
                                            style={{ marginTop: 10 }}
                                            type="button"
                                            onClick={() => handleSignIn()}
                                        >{Identify.__('Sign In')}</Button>
                                        <Link style={{ marginLeft: 5 }} to={forgotPasswordLocation}>{Identify.__('Forgot password?')}</Link>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
        {renderJs()}
    </div>
}

export default Authentication;

async function setToken(token) {
    // TODO: Get correct token expire time from API
    return storage.setItem('signin_token', token, 3600);
}
