import React, { useEffect } from 'react'
import Popup from '../BaseComponents/Popup';
import Image from 'src/simi/BaseComponents/Image'
import ReactHTMLParse from 'react-html-parser';
import Identify from 'src/simi/Helper/Identify'
import {subscribers} from '../Model/Newsletter';
import {validateEmail, validateEmpty} from 'src/simi/Helper/Validation'
import {showToastMessage} from 'src/simi/Helper/Message'
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading'
const $ = window.$
require('./newletterpopup.scss')

const NewsletterPopup = props => {
    const {config} = props;
    let newsletterConfig = null;
    let email = '';

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if(!validateEmpty(email)) {
            $('#error-email-subscribe-popup').text('This is a required field.')
            $('#subscribe-popup-email').addClass('mage-error');
        } else if(!validateEmail(email)) {
            $('#error-email-subscribe-popup').text('Please enter a valid email address (Ex: johndoe@domain.com).')
            $('#subscribe-popup-email').addClass('mage-error');
        } else {
            $('#error-email-subscribe-popup').text('')
            $('#subscribe-popup-email').removeClass('mage-error');
            showFogLoading()
            subscribers(subscribersCallBack, email)
        }
    }

    const handleOnChangeCheckbox = (e) => {
        if(e.target.checked) {
            Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, 'newsletter_popup', 'dontshowitagain');
        } else {
            Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, 'newsletter_popup', 'shown');
        }
    }

    const subscribersCallBack = (data) => {
        hideFogLoading()
        if(data.subscriber) {
            showToastMessage('You have been successfully subscribed to our newsletter.')
            $('#fancybox').hide()
        }
    }

    if(
        config
        && config.simiStoreConfig
        && config.simiStoreConfig.config
        && config.simiStoreConfig.config.newsletter_popup
    ) {
        newsletterConfig = config.simiStoreConfig.config.newsletter_popup
    }

    if(!newsletterConfig || parseInt(newsletterConfig.enable) === 0) return null;

    if(parseInt(newsletterConfig.enable) === 1 && window.location.pathname !== '/') return null

    useEffect(() => {
        const newsletterPopup = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'newsletter_popup');
        if(!newsletterPopup || newsletterPopup === 'shown') {
            const delay = newsletterConfig.delay || 3000
            setTimeout(() => {
                $('#fancybox').show()
            }, delay)
            Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, 'newsletter_popup', 'dontshowitagain');
        }
    }, [])


    const style = {
        width: newsletterConfig.width,
        height: newsletterConfig.height,
    }
    if(newsletterConfig.bg_image) style.backgroundImage = `url(${newsletterConfig.bg_image})`
    return (
        <Popup width={newsletterConfig.width} height={newsletterConfig.height}>
            <div className="newsletter" id="newsletter_popup" style={style}>
                <div className="block-content">
                    {newsletterConfig.logo_src && <Image src={newsletterConfig.logo_src} alt=""/>}
                    {ReactHTMLParse(newsletterConfig.content)}
                    <form className="form subscribe" onSubmit={(e) => handleOnSubmit(e)}>
                        <div className="field newsletter">
                            <div className="control">
                                <input id="subscribe-popup-email" name="email" type="email" onChange={(e) => email = e.target.value}/>

                            </div>
                            <div className="actions">
                                <button className="action subscribe primary" type="submit">
                                    <span >Go</span>
                                </button>
                            </div>
                            <div className="mage-error" id="error-email-subscribe-popup"></div>
                        </div>
                    </form>
                    <div className="subscribe-bottom">
                        <input type="checkbox" id="newsletter_popup_dont_show_again" defaultChecked={true} onChange={(e) => handleOnChangeCheckbox(e)}/>
                        <label htmlFor="newsletter_popup_dont_show_again">Don't show this popup again</label>
                    </div>
                </div>
            </div>
        </Popup>
    )
}

export default NewsletterPopup;
