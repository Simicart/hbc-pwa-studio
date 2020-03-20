import React, { Component } from 'react';
import Identify from 'src/simi/Helper/Identify';
import { estimateShippingMethods, applyRewardsPoint, totalsInfomation } from 'src/simi/App/hairbowcenter/Model/Cart';
import { Util, Price } from '@magento/peregrine'
import CartTotals from './CartTotals';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
require('./summary.scss');
const $ = window.$;

const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

class Summary extends Component {
    constructor(props) {
        super(props);
        this.storeConfig = Identify.getStoreConfig();
        this.allowedCountries = null
        if (this.storeConfig.simiStoreConfig && this.storeConfig.simiStoreConfig.config && this.storeConfig.simiStoreConfig.config.allowed_countries) {
            this.allowedCountries = this.storeConfig.simiStoreConfig.config.allowed_countries;
        }
        const firstCountry = this.allowedCountries.length > 0 ? this.allowedCountries[0] : null;
        this.country = firstCountry
        this.cartId = this.props.cartId
        this.isSignedIn = this.props.isSignedIn
        // const shippingMethodSave = storage.getItem('shippingMethod')
        // const shippingSave = storage.getItem('shipping_address')
        // const availableShippingMethodSave = storage.getItem('availableShippingMethod')
        // console.log(shippingMethodSave);
        // console.log(shippingSave);
        // console.log(availableShippingMethodSave);
        this.payloadEstimate = {
            country_id: this.country.country_code
        }
        this.shippingMethod = null;
        this.state = {
            newTotals: this.props.totals,
            shipping: null,
            updateState: false
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.totals && props.totals.total_segments) {
            if(state.updateState) {
                return {updateState: false}
            }
            return {newTotals: props.totals}

        }
        return null
    }


    checkFormatPostCode = (code) => {
        return /[0-9]{5}-[0-9]{4}/.test(code) || (/[0-9]{5}/.test(code) && parseInt(code, 10) > 10000);
    }

    loadTotal = (params, selectShippingMethod) => {
        showFogLoading()
        const address = {
            countryId: params.country_id,
            postcode: params.postcode
        }
        if (params.region) {
            address.region = params.region
        }
        if (params.region_id) {
            address.regionId = params.region_id
        }
        let payloadShippingMethod = {}
        if (selectShippingMethod) {
            payloadShippingMethod = {
                shipping_carrier_code: selectShippingMethod.carrier_code,
                shipping_method_code: selectShippingMethod.method_code
            }
        }
        const payload = {
            addressInformation: {
                address,
                ...payloadShippingMethod
            }
        }
        totalsInfomation(this.callBackTotalsInformation, payload, this.isSignedIn, this.cartId)
    }

    loadEstimateShipping = (payload) => {
        showFogLoading()
        estimateShippingMethods(this.callBackEstimateShipping, this.cartId, payload, this.isSignedIn)
    }

    callBackEstimateShipping = (data) => {
        hideFogLoading()
        this.setState({shipping: data, updateState: true});
    }

    callBackTotalsInformation = (data) => {
        hideFogLoading()
        // console.log(data);
        this.setState({newTotals: data, updateState: true});
    }

    handleOnChangeCountry = (e) => {
        const selectedCountry = this.allowedCountries.find(country => country.country_code === e.target.value)
        if (selectedCountry) {
            this.country = selectedCountry
            const newPayloadEstimate = {
                country_id: selectedCountry.country_code
            }
            if (selectedCountry.states.length === 0 && this.payloadEstimate.region) {
                newPayloadEstimate.region = this.payloadEstimate.region
            }
            if (this.payloadEstimate.postcode) {
                newPayloadEstimate.postcode = this.payloadEstimate.postcode
            }
            this.payloadEstimate = newPayloadEstimate
            this.loadEstimateShipping(newPayloadEstimate)
        }
    }

    handleOnChangeState = (e) => {
        const selectedIndex = e.nativeEvent.target.selectedIndex;
        if (selectedIndex) {
            this.payloadEstimate['region_id'] = e.target.value
            this.payloadEstimate['region'] = e.nativeEvent.target[selectedIndex].text
            this.payloadEstimate['region_code'] = e.nativeEvent.target[selectedIndex].dataset.regionCode
        } else {
            this.payloadEstimate['region'] = e.target.value
        }
        this.loadEstimateShipping(this.payloadEstimate)
    }

    handleOnBlurPostCode = (e) => {
        const postCode = e.target.value;
        if (!this.checkFormatPostCode(postCode)) {
            $('#postcode-alert').show()
        } else {
            $('#postcode-alert').hide()
        }
        this.payloadEstimate['postcode'] = e.target.value
        this.loadEstimateShipping(this.payloadEstimate)
    }

    handleOnSelectShipingMethod = (e) => {
        const { shipping } = this.state;
        const methodCode = e.target.value
        let selectShippingMethod = shipping
        if (shipping instanceof Array) {
            selectShippingMethod = shipping.find(item => item.method_code === methodCode);
        }

        if (selectShippingMethod) {
            this.shippingMethod = selectShippingMethod;
            this.loadTotal(this.payloadEstimate, selectShippingMethod)
        }
    }

    mergeShippingMethods = (shipping) => {
        const shippingMethod = {}
        shipping.forEach(item => {
            if (shippingMethod[item.carrier_code]) {
                shippingMethod[item.carrier_code].push(item);
            } else {
                shippingMethod[item.carrier_code] = [item]
            }
        })
        return shippingMethod;
    }

    handleApplyPoint = (cancel = false) => {
        const point = $('#points_amount').val()
        const payload = {}
        payload['remove-points'] = cancel ? 1 : 0
        if (!isNaN(point) && parseInt(point, 10) <= this.props.rewardPoint.chechout_rewards_points_max) {
            payload.points_amount = point
        } else {
            payload.points_amount = this.props.rewardPoint.chechout_rewards_points_max
            payload['points_all'] = 'on'
            $('#points_all').prop('checked', true)
            $('#points_amount').val(this.props.rewardPoint.chechout_rewards_points_max)
        }
        if (!payload.points_all) {
            if ($('#points_all').is(':checked')) {
                payload['points_all'] = 'on'
            }
        }
        showFogLoading()
        applyRewardsPoint(this.callBackApplyRewardsPoint, payload);
    }

    callBackApplyRewardsPoint = (data) => {
        if (data.success && data.message) {
            $('.rewards-message-block > div').html(
                `<div class="message message-success success">${data.message}</div>`
            )
            $('.rewards-message-block > div').slideDown();
            $('#points_amount').val(data.spend_points);
            setTimeout(() => {
                $('.rewards-message-block > div').slideUp();
            }, 10000)
            this.loadTotal(this.payloadEstimate, this.shippingMethod)
        }
    }

    handleToggleBlock = () => {
        const selector = $('#block-rewards-form .title')
        if (!selector.hasClass('block-active')) {
            selector.addClass('block-active');
            $('#block-rewards-form .block-rewards-points-form').show();
        } else {
            selector.removeClass('block-active')
            $('#block-rewards-form .block-rewards-points-form').hide();
        }

    }

    handleMoveCheckOut = () => {
        saveShippingAddress(this.payloadEstimate)
        saveAvailableShippingMethod(this.state.shipping)
        saveShippingMethod(this.shippingMethod)
        this.props.history.push('/checkout.html')
    }

    renderEstimateShipping = () => {
        const { shipping, newTotals } = this.state;
        const shippingEle = [];
        if (shipping) {
            if (shipping.length) {
                const shippingMethods = this.mergeShippingMethods(shipping)
                for (let i in shippingMethods) {
                    const shippingMethod = shippingMethods[i];
                    if (shippingMethod.length > 0) {
                        const firstShippingMethod = shippingMethod[0];
                        let itemShippingMethod = null;
                        if (firstShippingMethod.error_message) {
                            itemShippingMethod = (
                                <div className="message error">
                                    {firstShippingMethod.error_message}
                                </div>
                            )
                        } else {
                            itemShippingMethod = shippingMethod.map((itemShipping, index) => (
                                <div className="field choice item" key={index}>
                                    <input value={itemShipping.method_code} type="radio" className="radio" name="shipping-method-select" onChange={this.handleOnSelectShipingMethod} />
                                    <label htmlFor="" className="label">
                                        {itemShipping.method_title}
                                        <span className="price"><Price currencyCode={newTotals.base_currency_code} value={itemShipping.amount} /></span>
                                    </label>
                                </div>
                            ))
                        }

                        shippingEle.push(
                            <React.Fragment>
                                <dt className="item-title">
                                    <span>{firstShippingMethod.carrier_title}</span>
                                </dt>
                                <dd className="item-options">
                                    {itemShippingMethod}
                                </dd>
                            </React.Fragment>
                        )
                    }
                }
            } else if (shipping.carrier_title && shipping.method_title) {
                shippingEle.push(
                    <React.Fragment>
                        <dt className="item-title">
                            <span>{shipping.carrier_title}</span>
                        </dt>
                        <dd className="item-options">
                            <div className="field choice item">
                                <input value={shipping.method_code} type="radio" className="radio" name="shipping-method-select" onChange={this.handleOnSelectShipingMethod} />
                                <label htmlFor="" className="label">
                                    {shipping.method_title}
                                    <span className="price"><Price currencyCode={newTotals.base_currency_code} value={shipping.amount} /></span>
                                </label>
                            </div>
                        </dd>
                    </React.Fragment>
                )
            }
            return (
                <form id="co-shipping-method-form">
                    <fieldset className="fieldset rate">
                        <dl className="items methods">
                            {shippingEle}
                        </dl>
                    </fieldset>
                </form>
            )
        }
        return null
    }

    renderSelectConutry = () => {
        const countries = [];
        if (this.allowedCountries) {
            this.allowedCountries.forEach((country, index) => {
                countries.push(<option key={index} value={country.country_code}>{country.country_name}</option>)
            })
        }
        return (
            <select name="country_id" className="select" onChange={this.handleOnChangeCountry}>
                {countries}
            </select>
        )
    }

    renderSelectState = () => {
        if (this.country.states && this.country.states.length > 0) {
            const stateElement = [<option value="" key={Identify.randomString(2)}>{Identify.__('Please select a region, state or province')}</option>]
            this.country.states.forEach((state, index) => {
                stateElement.push(<option key={index} data-region-code={state.state_code} value={state.state_id}>{state.state_name}</option>)
            })

            return (
                <select name="state" className="select" onChange={this.handleOnChangeState}>
                    {stateElement}
                </select>
            )
        }
        return (
            <input type="text" className="input-text" name="state" onBlur={this.handleOnChangeState} />
        )
    }

    render() {
        const { rewardPoint } = this.props
        const { newTotals } = this.state
        const { shippingMethod } = this;
        return (
            <div className="cart-summary">
                <strong className="summary title">{Identify.__('Summary')}</strong>
                {rewardPoint && <div id="block-rewards-form" className="block shipping">
                    <div className="title" onClick={() => this.handleToggleBlock()}>
                        <strong className="block-rewards-form-heading">{Identify.__('Use Reward Points')}</strong>
                    </div>
                    <div className="block-rewards-points-form" style={{ display: 'none' }}>
                        <form id="reward-points-form" action="" method="POST">
                            <div className="rewards-message-block">
                                <div className="messages"></div>
                            </div>
                            <div className="rewards__checkout-cart-usepoints">
                                <div className="discount-form">
                                    <p className="">
                                        <span>{Identify.__('You have ')}</span>
                                        <b>{rewardPoint.chechout_rewards_points_availble}</b>
                                        <span>{Identify.__(' available.')}</span>
                                    </p>
                                    <div className="input-box">
                                        <input id="points_amount" type="text" className="input-text valid" name="points_amount" defaultValue={rewardPoint.chechout_rewards_points_used} />
                                        <label htmlFor="points_amount">
                                            <span>{Identify.__('Enter amount of points to spend')}</span>
                                        </label>
                                    </div>
                                    <div className="buttons-container">
                                        <button type="button" className="button action" style={{ marginRight: '5px' }} onClick={() => this.handleApplyPoint(false)}>
                                            <span>{Identify.__('Apply Points')}</span>
                                        </button>
                                        <button type="button" className="button action" onClick={() => this.handleApplyPoint(true)}>
                                            <span>{Identify.__('Cancel Points')}</span>
                                        </button>
                                    </div>
                                    <div className="onestepcheckout-newsletter checkbox-group">
                                        <input type="checkbox" id="points_all" name="points_all" value={rewardPoint.chechout_rewards_points_max} className="checkbox osc-additional-data" onClick={(e) => $('#points_amount').val(e.target.value)} />
                                        <label htmlFor="points_all" className="label--checkbox">
                                            <span>{Identify.__('Use maximum ')}</span>
                                            <b>{`${rewardPoint.chechout_rewards_points_max} ${Identify.__('Reward Points')}`}</b>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>}
                <div className="block shipping">
                    <div className="title">
                        <strong>{Identify.__('Estimate Shipping and Tax')}</strong>
                    </div>
                    <div className="block-summary">
                        <form action="" method="post" id="shipping-zip-form">
                            <fieldset className="fieldset estimate">
                                <div className="field">
                                    <label htmlFor="country" className="label">
                                        <span>{Identify.__('Country')}</span>
                                    </label>
                                    <div className="control">
                                        {this.renderSelectConutry()}
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="state" className="label">
                                        <span>{Identify.__('State/Province')}</span>
                                    </label>
                                    <div className="control">
                                        {this.renderSelectState()}
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="postcode" className="label">
                                        <span>{Identify.__('Zip/Postal Code')}</span>
                                    </label>
                                    <div className="control">
                                        <input type="text" className="input-text" name="postcode" onBlur={this.handleOnBlurPostCode} />
                                        <div className="message warning" id="postcode-alert" style={{ display: 'none' }}>
                                            {Identify.__('Provided Zip/Postal Code seems to be invalid. Example: 12345-6789; 12345. If you believe it is the right one you can ignore this notice.')}
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                        {this.renderEstimateShipping()}
                    </div>
                </div>
                <CartTotals totals={newTotals} shippingMethod={shippingMethod} rewardPoint={rewardPoint} />
                <ul className="checkout methods items checkout-methods-items">
                    <li className="item">
                        <button className="action primary checkout" onClick={() => this.handleMoveCheckOut()}>
                            <span>{Identify.__('Go to Checkout')}</span>
                        </button>
                    </li>
                </ul>
            </div>
        )
    }
}

async function saveShippingMethod(method) {
    return storage.setItem('shippingMethod', method);
}

async function saveShippingAddress(address) {
    if (address.hasOwnProperty('region') && address.region instanceof Object) {
        address = (({ region, ...others }) => ({ ...others }))(address)
    }

    address = (({ id, default_billing, default_shipping, ...others }) => ({ ...others }))(address);
    return storage.setItem('shipping_address', address);
}

async function saveAvailableShippingMethod(methods) {
    return storage.setItem('availableShippingMethod', methods);
}


export default Summary;
