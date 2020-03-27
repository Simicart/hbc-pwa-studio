import React, { Component, Fragment } from 'react';
import { connect } from 'src/drivers';
import PropTypes from 'prop-types';
import {
    getCartDetails
} from 'src/actions/cart';

import { cancelCheckout, editOrder, submitPaymentMethod } from 'src/actions/checkout';

require('./checkout.scss')

import { submitShippingAddress, submitBillingAddress, submitOrder, submitShippingMethod, /* submitPaymentMethod */ beginCheckout } from 'src/simi/Redux/actions/simiactions';

import TitleHelper from 'src/simi/Helper/TitleHelper';
import Identify from 'src/simi/Helper/Identify';
import BreadCrumb from "src/simi/BaseComponents/BreadCrumb";
import OrderSummary from "./OrderSummary/index";
import { configColor } from 'src/simi/Config';
import { Colorbtn } from 'src/simi/BaseComponents/Button';
import isObjectEmpty from 'src/util/isObjectEmpty';
import CheckoutStep from './checkoutStep';
import Authentication from './components/Authentication';
import { toggleMessages, simiSignedIn } from 'src/simi/Redux/actions/simiactions';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';

const $ = window.$

class Checkout extends Component {
    constructor(...args) {
        super(...args);
        const storeConfig = Identify.getStoreConfig();
        this.checkoutRedirect(storeConfig);
        this.autoFocusCheckout = false;
    }

    shouldComponentUpdate(nextProps) {
        if (this.showAPIloading(nextProps) || this.autoFocusCheckout) {
            this.autoFocusCheckout = false;
            showFogLoading()
            return false
        }

        hideFogLoading()
        return true
    }

    async componentDidMount() {
        const { props, check3DSecure } = this;
        const { beginCheckout, getCartDetails } = props;
        try {
            // get cart detail
            await getCartDetails();
            //beginning checkout
            await beginCheckout();
            await check3DSecure();
        } catch (err) {
            console.warn(err)
        }
    }

    check3DSecure = () => {
        const { convertUrlQuery, props } = this;
        const { submitPaymentMethod } = props;
        const query = convertUrlQuery();
        const cc_3DSecure_stripe = Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'cc_3DSecure_stripe');
        if (query.hasOwnProperty('confirmed_3d_secure') && query.confirmed_3d_secure === 'stripe' && cc_3DSecure_stripe && !isObjectEmpty(cc_3DSecure_stripe)) {
            cc_3DSecure_stripe.data['three_d_client_secret'] = query.client_secret;
            cc_3DSecure_stripe.data['three_d_src'] = query.source;
            submitPaymentMethod(cc_3DSecure_stripe);
        }
    }

    convertUrlQuery = () => {
        const params = new URLSearchParams(window.location.search)
        const json = {}
        for (const param of params.entries()) {
            const [key, value] = param;
            json[key] = value
        }
        return json
    }

    get breadcrumb() {
        return <BreadCrumb breadcrumb={[{ name: 'Home', link: '/' }, { name: 'Basket', link: '/cart.html' }, { name: 'Checkout', link: '/checkout.html' }]} />
    }

    get pageTitle() {
        return <div className='checkout-page-title'>{Identify.__("Checkout")}</div>;
    }

    handleLink(link) {
        this.props.history.push(link)
    }

    get cartDetail() {
        const { cart, history } = this.props;
        const hasCart = cart && cart.details && cart.details.items
        if (hasCart) {
            if (!cart.details.items.length)
                history.push('/')
            return true
        }
        return false
    }

    get cartCurrencyCode() {
        const { cart } = this.props;
        return (
            cart &&
            cart.details &&
            cart.details.currency &&
            cart.details.currency.quote_currency_code
        );
    }

    get userSignedIn() {
        const { user } = this.props;
        return user && user.isSignedIn;
    }

    get is_virtual() {
        const { cart } = this.props
        return cart.details && cart.details.is_virtual
    }

    showAPIloading = (props) => {
        const { cartDetail } = this;
        const { cart } = props;
        const { cartId, isLoading } = cart;
        const cartLoading = (!cartDetail && cartId && !isLoading && (!cart.details || !cart.details.item))
        if (!cartDetail || cartLoading)
            return true
        if (props.checkout && props.checkout.submitting)
            return true
        if (props.simiCheckoutUpdating)
            return true
        if (props.simiPaymentInformationMessage) return false
        return false
    }

    isCheckoutReady = checkout => {
        const { billingAddress, paymentData, shippingAddress, shippingMethod } = checkout;
        const { is_virtual } = this
        const objectsToCheck = [
            billingAddress,
            paymentData,
        ]
        if (!is_virtual)
            objectsToCheck.push(shippingAddress)
        const objectsHaveData = objectsToCheck.every(data => {
            return !!data && !isObjectEmpty(data);
        });

        const stringsHaveData = shippingMethod && shippingMethod.length > 0
        return objectsHaveData && (is_virtual || stringsHaveData)
    };


    placeOrder = () => {
        const { submitOrder, checkout, toggleMessages, history } = this.props;
        const { paymentData, shippingAddress, shippingMethod, billingAddress } = checkout;
        const { is_virtual } = this

        if (toggleMessages) {
            if (!is_virtual && (!shippingAddress || isObjectEmpty(shippingAddress))) {
                smoothScrollToView($("#id-message"));
                toggleMessages([{ type: 'error', message: Identify.__('Please choose a shipping address'), auto_dismiss: true }])
                return;
            }
            if (!billingAddress || isObjectEmpty(billingAddress)) {
                smoothScrollToView($("#id-message"));
                toggleMessages([{ type: 'error', message: Identify.__('Please choose a billing address'), auto_dismiss: true }])
                return;
            }
            if (!is_virtual && (!shippingMethod || !shippingMethod.length)) {
                smoothScrollToView($("#id-message"));
                toggleMessages([{ type: 'error', message: Identify.__('Please choose a shipping method '), auto_dismiss: true }])
                return;
            }
            if (!paymentData || isObjectEmpty(paymentData)) {
                smoothScrollToView($("#id-message"));
                toggleMessages([{ type: 'error', message: Identify.__('Please choose a payment method'), auto_dismiss: true }])
                return;
            }
        }
        if (paymentData && paymentData.value === 'paypal_express')
            history.push('/paypal_express.html')
        else {
            this.autoFocusCheckout = true;
            showFogLoading();
            submitOrder();
        }
    }

    get btnPlaceOrder() {
        const isCheckoutReady = this.isCheckoutReady(this.props.checkout)
        return (
            <div className='btn-place-order'>
                <Colorbtn
                    style={{ backgroundColor: isCheckoutReady ? configColor.button_background : '#aeaeae', opacity: isCheckoutReady ? 1 : 0.8, color: configColor.button_text_color, width: '100%' }}
                    className="go-place_order"
                    onClick={() => { if (isCheckoutReady) this.placeOrder() }} text={Identify.__('PLACE ORDER')} />
            </div>
        )
    }

    checkoutRedirect = (merchant) => {
        const { user, history } = this.props;
        const { isSignedIn } = user;

        const guest_checkout = merchant && merchant.simiStoreConfig.config.checkout.enable_guest_checkout ? merchant.simiStoreConfig.config.checkout.enable_guest_checkout : 1;
        if (!isSignedIn && parseInt(guest_checkout, 10) === 0) {
            const location = {
                pathname: '/login.html',
                pushTo: '/checkout.html'
            };
            history.push(location);
        }
    }

    handleCloseSideBarPopup = () => {
        $('.custom-slide').removeClass('show')
        $('.modal-custom-overlay').removeClass('has-modal')
    }

    get checkoutInner() {
        const { props, cartCurrencyCode, btnPlaceOrder, userSignedIn, is_virtual} = this;
        const { cart, checkout, directory, editOrder, submitShippingMethod, submitShippingAddress, submitOrder, submitPaymentMethod,
            submitBillingAddress, user, simiSignedIn, toggleMessages, getCartDetails, simiPaymentInformationMessage, simiUserBalance } = props;
        const { shippingAddress, submitting, availableShippingMethods, shippingMethod, billingAddress, paymentData, paymentCode,
            invalidAddressMessage, isAddressInvalid, shippingTitle, editing } = checkout;
        const { paymentMethods } = cart;
        const stepProps = {
            availableShippingMethods, billingAddress, cancelCheckout, cart, cartCurrencyCode, directory, editOrder, editing,
            hasPaymentMethod: !!paymentData && !isObjectEmpty(paymentData),
            hasShippingAddress: !!shippingAddress && !isObjectEmpty(shippingAddress),
            hasShippingMethod: !!shippingMethod && !isObjectEmpty(shippingMethod),
            invalidAddressMessage, isAddressInvalid, is_virtual, paymentCode, paymentData, paymentMethods,
            ready: this.isCheckoutReady(checkout),
            shippingAddress, shippingMethod, shippingTitle, simiSignedIn, submitShippingAddress, submitOrder, submitPaymentMethod,
            submitBillingAddress, submitShippingMethod, submitting, toggleMessages, user,
            placeOrder: this.placeOrder,
            simiPaymentInformationMessage,
            simiUserBalance
        };

        let cpValue = "";
        if (cart.totals.coupon_code) {
            cpValue = cart.totals.coupon_code;
        }

        const childCPProps = {
            value: cpValue,
            toggleMessages,
            getCartDetails
        }

        if (checkout.step && checkout.step === 'receipt') {
            sessionStorage.removeItem('cc_card_data');
            sessionStorage.removeItem('cc_3DSecure_stripe');
            sessionStorage.removeItem('localSelectedShippingMethod');
            sessionStorage.removeItem('payment_selected_local');
            sessionStorage.removeItem('checkout_step');

            hideFogLoading();
            const locate = {
                pathname: '/thankyou.html',
                state: {
                    isUserSignedIn: userSignedIn
                }
            };
            this.handleLink(locate);
        }

        if (simiPaymentInformationMessage){
            hideFogLoading();
            smoothScrollToView($("#id-message"));
            toggleMessages([{ type: 'error', message: simiPaymentInformationMessage, auto_dismiss: true }])
        }

        const grandTotal = cart && cart.totals && Object.keys(cart.totals).length > 0 ? cart.totals.grand_total : 0
        const qty = cart && cart.details ? cart.details.items_qty : 0

        return <Fragment>
            <div className='checkout-column'>
                <div className='checkout-col-1'>
                    <CheckoutStep qty={qty} grandTotal={grandTotal} childCPProps={childCPProps} stepProps={stepProps} is_virtual={is_virtual} />
                </div>
                <div className='checkout-col-3 custom-slide'>
                    <div className='col-3-content'>
                        {!userSignedIn && <Authentication simiSignedIn={simiSignedIn} toggleMessages={toggleMessages} />}
                        <OrderSummary parent={this} cart={cart} cartCurrencyCode={cartCurrencyCode}
                            checkout={checkout} panelClassName='checkout-panel' />
                        {/* {btnPlaceOrder} */}
                    </div>
                </div>
                <div className="modal-custom-overlay" onClick={this.handleCloseSideBarPopup}></div>
            </div>
        </Fragment>
    }

    render() {
        return (
            <div className={`checkout-bg ${Identify.isRtl() ? 'checkout-bg-rtl' : ''}`}>
                <div className="container">
                    {TitleHelper.renderMetaHeader({
                        title: Identify.__('Checkout')
                    })}
                    {this.checkoutInner}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ cart, checkout, directory, user, simireducers }) => {
    const { simiCheckoutUpdating, simiPaymentInformationMessage, simiUserBalance } = simireducers;
    return {
        cart,
        checkout,
        directory,
        user,
        simiCheckoutUpdating,
        simiPaymentInformationMessage,
        simiUserBalance
    }
}

const mapDispatchToProps = {
    getCartDetails,
    beginCheckout,
    cancelCheckout,
    editOrder,
    submitShippingAddress,
    submitOrder,
    submitShippingMethod,
    submitBillingAddress,
    submitPaymentMethod,
    toggleMessages,
    simiSignedIn
};


Checkout.propTypes = {
    beginCheckout: PropTypes.func,
    cancelCheckout: PropTypes.func,
    cart: PropTypes.shape({
        details: PropTypes.shape({
            items_count: PropTypes.number
        })
    }),
    checkout: PropTypes.shape({
        availableShippingMethods: PropTypes.array,
        billingAddress: PropTypes.object,
        editing: PropTypes.oneOf(['address', 'billingAddress', 'paymentMethod', 'shippingMethod']),
        invalidAddressMessage: PropTypes.string,
        isAddressInvalid: PropTypes.bool,
        paymentCode: PropTypes.string,
        paymentData: PropTypes.object,
        shippingAddress: PropTypes.object,
        shippingMethod: PropTypes.string,
        shippingTitle: PropTypes.string,
        step: PropTypes.oneOf(['cart', 'form', 'receipt']).isRequired,
        submitting: PropTypes.bool
    }).isRequired,
    directory: PropTypes.object,
    editOrder: PropTypes.func,
    submitOrder: PropTypes.func,
    submitPaymentMethod: PropTypes.func,
    submitShippingAddress: PropTypes.func,
    submitShippingMethod: PropTypes.func,
    submitBillingAddress: PropTypes.func,
    user: PropTypes.object,
    simiSignedIn: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
