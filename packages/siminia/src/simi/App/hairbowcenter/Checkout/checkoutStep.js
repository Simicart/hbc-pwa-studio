import React from 'react';
import Panel from 'src/simi/BaseComponents/Panel';
import Identify from 'src/simi/Helper/Identify';
import EditableForm from './editableForm';
import Coupon from 'src/simi/BaseComponents/Coupon';
import { formatLabelPrice } from 'src/simi/Helper/Pricing';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
const $ = window.$;

class CheckoutStep extends React.Component {
    constructor(props) {
        super(props);
        const { stepProps } = props;
        this.state = {
            step: stepProps && stepProps.is_virtual ? 2 : (Identify.ApiDataStorage('checkout_step') || 1)
        }
    }


    componentDidUpdate() {
        const { stepProps } = this.props;
        if (stepProps.is_virtual && this.state.step !== 2) {
            this.setState({ step: 2 });
        }
    }

    checkFormAddressData = (form, queryString) => {
        let validCheck = true;
        for (const key in queryString) {
            const item = queryString[key];
            const itemName = item.name;
            const itemValue = item.value.trim();
            const inputItem = form.find(`input[name='${itemName}']`);
            const slbItem = form.find(`select[name='${itemName}']`);

            if (inputItem.length || slbItem.length) {
                if (inputItem.length && inputItem.hasClass('isrequired') && !itemValue) {
                    validCheck = false;
                    inputItem.addClass('warning');
                }
                if (slbItem.length && slbItem.attr('isrequired') === 'isrequired' && !itemValue) {
                    validCheck = false;
                    slbItem.addClass('warning');
                }
            }
        }
        return validCheck;
    }

    changeStep = (step, saveAddress = false) => {
        const { stepProps } = this.props;

        const form = $(`#shippingAddressForm`);
        const queryString = form.serializeArray();
        const validCheck = this.checkFormAddressData(form, queryString);
        if (validCheck) {
            if (step === 2 && (!stepProps.hasShippingAddress)) return;

            Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'checkout_step', step);

            if (saveAddress) {
                this.submitAddress(step)
            } else {
                this.setState({ step });
            }
        } else {
            if (stepProps.toggleMessages) {
                stepProps.toggleMessages([{ type: 'error', message: Identify.__('Required field is empty!'), auto_dismiss: true }])
            }
        }
        smoothScrollToView($("#root"));
    }

    submitAddress = (step) => {
        const { stepProps } = this.props;
        const { submitShippingAddress, submitShippingMethod, shippingAddress } = stepProps;

        $(function () {
            const form = $(`#shippingAddressForm`);
            const queryString = form.serializeArray();
            const submitValues = {};
            for (const key in queryString) {
                const item = queryString[key];
                const itemName = item.name;
                const itemValue = item.value;
                if (itemName) {
                    if (itemName === 'save_in_address_book') {
                        submitValues.save_in_address_book = form.find(`input[name='${itemName}']`).is(":checked") ? 1 : 0;
                    } else if (itemName === 'street[0]') {
                        submitValues.street = [itemValue]
                    } else if (itemName === 'street[1]' || itemName === 'street[2]') {
                        submitValues.street.push(itemValue)
                    } else if (itemName === 'emailaddress') {
                        submitValues['email'] = itemValue
                    } else if (itemName === 'new-billing-address-custom' || itemName === 'selected_address_field') {
                        continue;
                    } else {
                        submitValues[itemName] = itemValue
                    }
                }
            }

            if (Object.keys(submitValues).length && submitShippingAddress) {
                if (shippingAddress && JSON.stringify(submitValues) === JSON.stringify(shippingAddress)) { } else {
                    submitShippingAddress({ formValues: submitValues });
                }
            }

            const localShippingMethod = Identify.ApiDataStorage('localSelectedShippingMethod') || null;
            if (localShippingMethod) {
                submitShippingMethod({ formValues: localShippingMethod });
            }
        });
        setTimeout(() => {
            this.setState({ step });
        }, 500);

    }

    get contentStep1() {
        const { is_virtual, stepProps } = this.props;

        return <React.Fragment>
            {!is_virtual && <div className="shipping-address-frame">
                <div className='checkout-section-title'>{Identify.__('Shipping Address')}</div>
                <EditableForm {...stepProps} editing='address' />
            </div>}
            {!is_virtual && <div className="shipping-method-frame">
                <div className='checkout-section-title'>{Identify.__('Shipping Method')}</div>
                <EditableForm {...stepProps} editing='shippingMethod' />
            </div>}
            {stepProps.hasShippingAddress ? <div className="actions-toolbar">
                <button className={`next-step ${!stepProps.hasShippingMethod && 'hidden'}`} id="checkout-next-step" onClick={() => this.changeStep(2, true)}>{Identify.__("Next")}</button>
            </div> : null}
        </React.Fragment>
    }

    get contentStep2() {
        const { stepProps, childCPProps } = this.props;
        return <React.Fragment>

            <div className="payment-frame">
                <div className='checkout-section-title'>{Identify.__('Payment Method')}</div>
                <EditableForm {...stepProps} editing='paymentMethod' />

                {/* <Panel title={<div className='checkout-section-title'>{Identify.__('Billing Information')}</div>}
                    className='checkout-panel'
                    renderContent={<EditableForm {...stepProps} editing='billingAddress' />}
                    isToggle={true}
                    expanded={true}
                    headerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                /> */}
            </div>

            <Panel title={<div className='checkout-section-title'>{Identify.__('Apply Discount Coupon')}</div>}
                className='checkout-panel-coupon'
                renderContent={<Coupon {...childCPProps} />}
                isToggle={true}
                expanded={false}
                headerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            />
        </React.Fragment>
    }

    renderCheckoutTitle = () => {
        const { step } = this.state;
        const { stepProps } = this.props;
        return <ul className="opc-progress-bar">
            {(stepProps && !stepProps.is_virtual) ? <li className={`opc-progress-bar-item ${step === 1 ? '_active' : ''} ${step === 2 ? '_complete' : ''}`} onClick={() => this.changeStep(1)}>
                <span>{Identify.__("Shipping")}</span>
            </li> : ''}
            <li className={`opc-progress-bar-item ${step === 2 ? '_active' : ''}`} onClick={() => this.changeStep(2)}>
                <span>{Identify.__("Review & Payments")}</span>
            </li>
        </ul>
    }

    handleOpenSidebar = (type) => {
        $('.custom-slide').addClass('show')
        $('.modal-custom-overlay').addClass('has-modal')
        if (type === 'login') {
            $('#order-summary').hide()
            $('.authentication-ck').show()
        } else {
            $('.authentication-ck').hide()
            $('#order-summary').show()
        }
    }

    renderSummaryMobile = () => {
        const { stepProps } = this.props;
        const { user } = stepProps;
        return (
            <div className="opc-estimated-wrapper">
                <div className="estimated-block">
                    <span className="estimated-label">{Identify.__('Estimated Total')}</span>
                    <span className="estimated-price">{formatLabelPrice(this.props.grandTotal)}</span>
                </div>
                <div className="minicart-wrapper">
                    <button type="button" className="action showcart" onClick={() => this.handleOpenSidebar('cart')}>
                        <span className="counter qty">
                            <span className="counter-number">{this.props.qty}</span>
                        </span>
                    </button>
                    {(!user || (user && !user.isSignedIn)) ? <button className="action action-auth-toggle" onClick={() => this.handleOpenSidebar('login')}>
                        <span>{Identify.__('Sign In')}</span>
                    </button> : ''}
                    <div className="clearfix"></div>
                </div>
                <div className="clearfix"></div>
            </div>
        )
    }

    render() {
        const { step } = this.state;
        const { stepProps } = this.props;
        // if (stepProps.is_virtual) this.setState({ step: 2 });
        const { contentStep1, contentStep2 } = this;
        return <React.Fragment>
            {this.renderCheckoutTitle()}
            {this.renderSummaryMobile()}
            {step === 2 ? contentStep2 : contentStep1}
        </React.Fragment>;
    }
}

export default CheckoutStep;
