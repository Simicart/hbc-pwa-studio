import React, { useCallback, Fragment, useState } from 'react';
import { Util } from '@magento/peregrine';
import Checkbox from 'src/components/Checkbox';
import Button from 'src/components/Button';
import Select from 'src/components/Select';
import Identify from 'src/simi/Helper/Identify';
import { checkExistingCustomer, simiSignIn } from 'src/simi/Model/Customer';
import isObjectEmpty from 'src/util/isObjectEmpty';
import { Link } from 'react-router-dom';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import * as Constants from 'src/simi/Config/Constants'
import LoadingImg from 'src/simi/BaseComponents/Loading/LoadingImg';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import SearchAddress from './SearchAddress';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();
require('./formFields.scss');
const $ = window.$;

const listAddress = (addresses) => {
    let html = [];
    if (addresses && addresses.length) {
        html = addresses.map(address => {
            const labelA = address.firstname + ' ' + address.lastname + ', ' + address.city + ', ' + address.region.region;
            return { value: address.id, label: labelA };
        });

    }
    const ctoSelect = { value: '', label: Identify.__('Please choose') };
    html.unshift(ctoSelect);

    const new_Address = { value: 'new_address', label: Identify.__('New Address') };
    html.push(new_Address);
    return html;
}

const listState = (states) => {
    let html = null;
    if (states && states.length) {
        html = states.map(itemState => {
            return { value: itemState.code, label: itemState.name };
        });
        const ctoState = { value: '', label: Identify.__('Please choose') };
        html.unshift(ctoState);
    }
    return html;
}

const FormFields = (props) => {
    const {
        formId,
        billingForm,
        validationMessage,
        initialCountry,
        selectableCountries,
        submitting,
        submit,
        user,
        billingAddressSaved,
        submitBilling,
        simiSignedIn,
        countries,
        configFields,
        handleFormReset,
        is_virtual,
        initialValues
    } = props;

    const { isSignedIn, currentUser } = user;

    const { addresses, default_billing, default_shipping } = currentUser;

    const checkCustomer = false;

    const [shippingNewForm, setShippingNewForm] = useState(false);
    const [handlingEmail, setHandlingEmail] = useState(false)
    const [existCustomer, setExistCustomer] = useState(checkCustomer);
    const [selectedCountry, setSelectedCountry] = useState(-1);

    let sameBL = billingForm === true;
    if (billingForm && initialValues && !isObjectEmpty(initialValues) && !initialValues.hasOwnProperty('sameAsShippingAddress')) {
        sameBL = false;
    }
    const [usingSameAddress, setUsingSameAddress] = useState(sameBL);

    const storageShipping = Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'shipping_address');
    const storageBilling = Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'billing_address');

    const initialShipping = !billingForm && isSignedIn && storageShipping ? storageShipping : default_shipping ? default_shipping : null;
    const initialBilling = billingForm && isSignedIn && storageBilling ? storageBilling : default_billing ? default_billing : null;

    const resetForm = useCallback(
        () => {
            handleFormReset()
        },
        [handleFormReset]
    )

    const handleSubmitBillingSameFollowShipping = useCallback(
        () => {
            const billingAddress = {
                sameAsShippingAddress: true
            }
            submitBilling(billingAddress);
        },
        [submitBilling]
    )

    const handleChooseAddedAddress = () => {
        const selected_address_field = $(`#${formId} select[name=selected_address_field]`).val()
        if (selected_address_field !== 'new_address') {
            setShippingNewForm(false);
            const shippingFilter = addresses.find(
                ({ id }) => id === parseInt(selected_address_field, 10)
            );
            if (shippingFilter) {
                if (!shippingFilter.email) shippingFilter.email = currentUser.email;

                if (shippingFilter.id) {
                    if (billingForm) {
                        Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'billing_address', shippingFilter.id);
                    } else {
                        Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'shipping_address', shippingFilter.id);
                    }
                }
                handleSubmit(shippingFilter);
                if (!billingForm && !billingAddressSaved) {
                    handleSubmitBillingSameFollowShipping();
                }
            }
        } else {
            if (billingForm) {
                Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'billing_address', 'new_address');
            } else {
                Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'shipping_address', 'new_address');
            }
            setShippingNewForm(true);
            resetForm();
        }
    }

    const handleSubmit = useCallback(
        values => {
            if (values.hasOwnProperty('selected_address_field')) delete values.selected_address_field
            if (values.hasOwnProperty('password')) delete values.password
            if (values.hasOwnProperty('default_billing')) delete values.default_billing
            if (values.hasOwnProperty('default_shipping')) delete values.default_shipping
            if (values.save_in_address_book) {
                values.save_in_address_book = 1;
            } else {
                values.save_in_address_book = 0;
            }
            submit(values);
        },
        [submit]
    );

    const processData = (data) => {
        setHandlingEmail(false);
        if (data.hasOwnProperty('customer') && !isObjectEmpty(data.customer) && data.customer.email) {
            setExistCustomer(true);
        } else {
            setExistCustomer(false);
        }
    }

    const checkMailExist = () => {
        const email = $(`#${formId} input[name=emailaddress]`).val()
        if (!email || !Identify.validateEmail(email)) return;
        setHandlingEmail(true);
        checkExistingCustomer(processData, email)
    }

    const handleActionSignIn = useCallback(
        (value) => {
            simiSignedIn(value);
        },
        [simiSignedIn]
    )

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
            if (props.toggleMessages) {
                props.toggleMessages([{ type: 'error', message: Identify.__('The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.'), auto_dismiss: true }])
            }
        }
    }

    const handleSignIn = () => {
        const email = $(`#${formId} input[name=emailaddress]`).val()
        const password = $(`#${formId} input[name=password]`).val()
        if (!email || !password || !email.trim() || !password.trim()) {
            smoothScrollToView($("#id-message"));
            if (props.toggleMessages) {
                props.toggleMessages([{ type: 'error', message: Identify.__('Email and password is required to login!'), auto_dismiss: true }])
            }
            return;
        }
        const username = email;
        simiSignIn(setDataLogin, { username, password })
        showFogLoading()
    }

    const onHandleSelectCountry = () => {
        const country_id = $(`#${formId} select[name=country_id]`).val();
        changeInput()
        setSelectedCountry(country_id)
    }

    const onHandleSelectState = () => {
        changeInput()
    }

    const renderRegionField = (selectedCountry, initialCountry, countries, configFields, initialValues) => {
        const country_id = (selectedCountry !== -1) ? selectedCountry : initialCountry
        if (!country_id || !countries) return
        const country = countries.find(({ id }) => id === country_id);
        if (!country) return
        const { available_regions: regions } = country;
        if (!configFields || (configFields && configFields.hasOwnProperty('region_id_show') && configFields.region_id_show)) {
            return (
                <div className='region_code'>
                    <div className={`address-field-label ${((configFields && configFields.hasOwnProperty('region_id_show') && configFields.region_id_show === 'req') || (country.available_regions && Array.isArray(regions) && regions.length)) ? 'req' : ''}`}>{Identify.__("State/Province")}</div>
                    {
                        (country.available_regions && Array.isArray(regions) && regions.length) ?
                            <Select
                                id='administrative_area_level_1'
                                initialValue={initialValues.region_code}
                                key={Identify.randomString(3)}
                                field="region_code" items={listState(regions)}
                                onBlur={() => onHandleSelectState()}
                                isrequired={'isrequired'}
                            /> :
                            <input type="text" id='administrative_area_level_1' name='region_code' defaultValue={initialValues.region_code} />
                    }
                </div>
            )
        }
    }

    const forgotPasswordLocation = {
        pathname: '/login.html',
        state: {
            forgot: true
        }
    }

    const listOptionsAddress = (addresses) => {
        let html = null;
        if (addresses && addresses.length) {
            html = addresses.map((address, idx) => {
                const labelA = address.firstname + ' ' + address.lastname + ', ' + address.city + ', ' + address.region.region;
                return <option value={address.id} key={idx}>{labelA}</option>
            });
        }
        return <Fragment>
            <option value="">{Identify.__('Please choose')}</option>
            {html}
            <option value="new_address">{Identify.__('New Address')}</option>
        </Fragment>;
    }

    const changeInput = () => {

        $(function () {
            const form = $(`#${formId}`);
            const queryString = form.serializeArray();
            let validCheck = true;
            const submitValues = {};
            for (const key in queryString) {
                const item = queryString[key];
                const itemName = item.name;
                const itemValue = item.value;
                const inputItem = form.find(`input[name='${itemName}']`);
                const slbItem = form.find(`select[name='${itemName}']`);
                if (inputItem.length || slbItem.length) {
                    if (inputItem.length && inputItem.hasClass('isrequired') && !itemValue) {
                        validCheck = false;
                    }
                    if (slbItem.length && slbItem.attr('isrequired') === 'isrequired' && !itemValue) {
                        validCheck = false;
                    }
                }

                if (itemName) {
                    if (itemName === 'street[0]') {
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

            if (validCheck && Object.keys(submitValues).length) {
                if (!submitValues['email'] && isSignedIn && currentUser) {
                    submitValues['email'] = currentUser.email;
                }
                if (props.s_address && billingForm && !isObjectEmpty(props.s_address)) {
                    submitValues['email'] = props.s_address.email;
                }
                submit(submitValues);
                if (!billingForm && !billingAddressSaved) {
                    handleSubmitBillingSameFollowShipping();
                }
            }
        });
    }

    const viewFields = (!usingSameAddress) ? (
        <Fragment>
            {isSignedIn && <div className='shipping_address'>
                <div className={`address-field-label ${(!configFields || configFields.country_id_show === 'req') ? 'req' : ''}`}>{billingForm ? Identify.__("Select Billing") : Identify.__("Select Shipping")}</div>
                <select name="selected_address_field"
                    defaultValue={billingForm ? initialBilling : initialShipping}
                    onChange={() => handleChooseAddedAddress()}>
                    {listOptionsAddress(addresses)}
                </select>
            </div>}
            {!isSignedIn || shippingNewForm || ((billingForm && storageBilling === 'new_address') || (!billingForm && storageShipping === 'new_address')) ?
                <Fragment>
                    {!isSignedIn && !billingForm && <div className='email _with-tooltip'>
                        <div className={`address-field-label req`}>{Identify.__("Email Address")}</div>
                        <input
                            type="email" name="emailaddress" className="isrequired" id='email'
                            onBlur={() => !billingForm && !user.isSignedIn && checkMailExist()}
                            defaultValue={initialValues.email}
                        />
                        <div className="field-tooltip toggle">
                            <span className="field-tooltip-action action-help" />
                            <div className="field-tooltip-content">{Identify.__("We'll send your order confirmation here.")}</div>
                        </div>
                        <span className="note">
                            <span>{Identify.__("You can create an account after checkout.")}</span>
                        </span>
                        {handlingEmail && <LoadingImg divStyle={{ marginTop: 5 }} />}
                    </div>}
                    {existCustomer && <Fragment>
                        <div className='password'>
                            <div className={`address-field-label req`}>{Identify.__("Password")}</div>
                            <input id="password" type="password" name="password" className="isrequired" />
                            <span style={{ marginTop: 6, display: 'block' }}>{Identify.__('You already have an account with us. Sign in or continue as guest')}</span>
                        </div>
                        <div className='btn_login_exist'>
                            <Button
                                className='button'
                                style={{ marginTop: 10 }}
                                type="button"
                                onClick={() => handleSignIn()}
                            >{Identify.__('Login')}</Button>
                            <Link style={{ marginLeft: 5 }} to={forgotPasswordLocation}>{Identify.__('Forgot password?')}</Link>
                        </div>
                    </Fragment>
                    }
                    <div className='firstname'>
                        <div className={`address-field-label req`}>{Identify.__("First Name")}</div>
                        <input type="text" id='firstname' name='firstname' className="isrequired" defaultValue={initialValues.firstname} onBlur={() => changeInput()} />
                    </div>
                    <div className='lastname'>
                        <div className={`address-field-label req`}>{Identify.__("Last Name")}</div>
                        <input type="text" id='lastname' name='lastname' className="isrequired" defaultValue={initialValues.lastname} onBlur={() => changeInput()} />
                    </div>
                    {!configFields || configFields && configFields.hasOwnProperty('company_show') && configFields.company_show ?
                        <div className='company'>
                            <div className={`address-field-label ${configFields && configFields.hasOwnProperty('company_show') && configFields.company_show === 'req' ? 'req' : ''}`}>{Identify.__("Company")}</div>
                            <input type="text" id='company' name='company' className={configFields && configFields.hasOwnProperty('company_show') && configFields.company_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.company} onBlur={() => changeInput()} />
                        </div>
                        : null}
                    {!configFields || (configFields && configFields.hasOwnProperty('street_show') && configFields.street_show) ?
                        <div className='street0'>
                            <div className={`address-field-label ${!configFields || (configFields && configFields.hasOwnProperty('street_show') && configFields.street_show === 'req') ? 'req' : ''}`}>{Identify.__("Street Address")}</div>
                            {/* <input type="text" id="street_number" name='street[0]' className={configFields && configFields.hasOwnProperty('street_show') && configFields.street_show === 'req' ? 'isrequired' : ''} defaultValue={(initialValues.street && initialValues.street[0]) ? initialValues.street[0] : ''} /> */}
                            <SearchAddress configFields={configFields} initialValues={initialValues} changeInput={changeInput} />
                            <input type="text" id="route" name='street[1]' defaultValue={(initialValues.street && initialValues.street[1]) ? initialValues.street[1] : ''} />
                            <input type="text" id="sublocality_level_1" name='street[2]' defaultValue={(initialValues.street && initialValues.street[2]) ? initialValues.street[2] : ''} />
                        </div>
                        : null}
                    {!configFields || (configFields && configFields.hasOwnProperty('city_show') && configFields.city_show) ?
                        <div className='city'>
                            <div className={`address-field-label ${!configFields || (configFields && configFields.hasOwnProperty('city_show') && configFields.city_show === 'req') ? 'req' : ''}`}>{Identify.__("City")}</div>
                            <input type="text" id='locality' name='city' className={'isrequired'} defaultValue={initialValues.city} onBlur={() => changeInput()} />
                        </div> : null}
                    {!configFields || (configFields && configFields.hasOwnProperty('zipcode_show') && configFields.zipcode_show) ?
                        <div className='postcode'>
                            <div className={`address-field-label ${!configFields || (configFields && configFields.hasOwnProperty('zipcode_show') && configFields.zipcode_show === 'req') ? 'req' : ''}`}>{Identify.__("Zip/Postal Code")}</div>
                            <input type="text" id='postal_code' name='postcode' className={configFields && configFields.hasOwnProperty('zipcode_show') && configFields.zipcode_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.postcode} onBlur={() => changeInput()} />
                        </div> : null}
                    {!configFields || (configFields && configFields.hasOwnProperty('country_id_show') && configFields.country_id_show) ?
                        <div className='country'>
                            <div className={`address-field-label ${(!configFields || configFields.country_id_show === 'req') ? 'req' : ''}`}>{Identify.__("Country")}</div>
                            <Select
                                field="country_id"
                                id="country"
                                key={initialCountry /*change key to change initial value*/}
                                initialValue={initialCountry}
                                onChange={() => onHandleSelectCountry()} onBlur={() => onHandleSelectCountry()}
                                items={selectableCountries}
                                isrequired={(!configFields || (configFields && configFields.hasOwnProperty('country_id_show') && configFields.country_id_show === 'req')) ? 'isrequired' : ''}
                            />
                        </div> : null}
                    {renderRegionField(selectedCountry, initialCountry, countries, configFields, initialValues)}
                    {!configFields || (configFields && configFields.hasOwnProperty('telephone_show') && configFields.telephone_show) ?
                        <div className='telephone _with-tooltip'>
                            <div className={`address-field-label ${!configFields || (configFields && configFields.hasOwnProperty('telephone_show') && configFields.telephone_show === 'req') ? 'req' : ''}`}>{Identify.__("Phone Number")}</div>
                            <input type="tel" id='telephone' name='telephone' className={!configFields || (configFields && configFields.hasOwnProperty('telephone_show') && configFields.telephone_show === 'req') ? 'isrequired' : ''} defaultValue={initialValues.telephone} onBlur={() => changeInput()} />
                            <div className="field-tooltip toggle">
                                <span className="field-tooltip-action action-help" />
                                <div className="field-tooltip-content">{Identify.__("For delivery questions.")}</div>
                            </div>
                        </div> : null}
                    {configFields && configFields.hasOwnProperty('fax_show') && configFields.fax_show ?
                        <div className='fax'>
                            <div className={`address-field-label ${configFields && configFields.hasOwnProperty('fax_show') && configFields.fax_show === 'req' ? 'req' : ''}`}>{Identify.__("Fax")}</div>
                            <input type="tel" id='fax' name='fax' className={configFields && configFields.hasOwnProperty('fax_show') && configFields.fax_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.fax} />
                        </div>
                        : null}
                    {configFields && configFields.hasOwnProperty('prefix_show') && configFields.prefix_show ?
                        <div className='prefix'>
                            <div className={`address-field-label ${configFields && configFields.hasOwnProperty('prefix_show') && configFields.prefix_show === 'req' ? 'req' : ''}`}>{Identify.__("Prefix")}</div>
                            <input type="text" id='prefix' name='prefix' className={configFields && configFields.hasOwnProperty('prefix_show') && configFields.prefix_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.prefix} />
                        </div>
                        : null}
                    {configFields && configFields.hasOwnProperty('suffix_show') && configFields.suffix_show ?
                        <div className='suffix'>
                            <div className={`address-field-label ${configFields && configFields.hasOwnProperty('suffix_show') && configFields.suffix_show === 'req' ? 'req' : ''}`}>{Identify.__("Suffix")}</div>
                            <input type="text" id='suffix' name='suffix' className={configFields && configFields.hasOwnProperty('suffix_show') && configFields.suffix_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.suffix} />
                        </div>
                        : null}
                    {configFields && configFields.hasOwnProperty('taxvat_show') && configFields.taxvat_show ?
                        <div className='vat_id'>
                            <div className={`address-field-label ${configFields && configFields.hasOwnProperty('taxvat_show') && configFields.taxvat_show === 'req' ? 'req' : ''}`}>{Identify.__("VAT")}</div>
                            <input type="text" id='vat_id' name='vat_id' className={configFields && configFields.hasOwnProperty('taxvat_show') && configFields.taxvat_show === 'req' ? 'isrequired' : ''} defaultValue={initialValues.vat_id} />
                        </div>
                        : null}
                    {/* <div className='save_in_address_book'>
                        <Checkbox field="save_in_address_book" label={Identify.__('Save in address book.')} />
                    </div> */}
                    <div className='validation'>{validationMessage}</div>
                </Fragment> : null}
        </Fragment>
    ) : null;
    const viewSubmit = !usingSameAddress && (!isSignedIn || shippingNewForm || ((billingForm && storageBilling === 'new_address') || (!billingForm && storageShipping === 'new_address'))) ? (
        <div className='footer'>
            <Button
                className='button'
                style={{ marginTop: 10, float: 'right' }}
                type="submit"
                priority="high"
                disabled={submitting}
            >{Identify.__('Save Address')}</Button>
        </div>
    ) : null;

    const toggleSameShippingAddress = () => {
        const sameAsShippingAddress = !usingSameAddress
        let billingAddress;
        if (sameAsShippingAddress) {
            billingAddress = {
                sameAsShippingAddress
            };
            submit(billingAddress);
        }
        setUsingSameAddress(sameAsShippingAddress)
    }

    const handleCheckBoxBilling = (label) => {
        if (label === 'diff') {
            setUsingSameAddress(false)
        } else {
            setUsingSameAddress(true)
            submit({ sameAsShippingAddress: true });
        }
    }

    const renderJs = () => {
        $(document).ready(function () {
            const tooltipAction = $('.field-tooltip');
            tooltipAction.unbind().click(function () {
                $('.field-tooltip-content').hide();
                $(this).closest('.form-fields-body').find('.field-tooltip-content').toggle()
            });

            $('body').unbind().on('click', function (e) {
                if ($(e.target).closest('.field-tooltip').length == 0) {
                    $('.form-fields-body').find('.field-tooltip-content').hide();
                }
            });
        })
    }

    return (
        <React.Fragment>
            <div className='body form-fields-body'>
                {(billingForm && is_virtual) && <React.Fragment>
                        <span className="edit-virtual-billing" role={"presentation"} onClick={() => handleCheckBoxBilling('diff')}>{Identify.__("Edit")}</span>
                        {!usingSameAddress && <span className="cancel-virtual-billing" role={"presentation"} onClick={() => setUsingSameAddress(true)}>{Identify.__("Cancel")}</span>}
                    </React.Fragment>}
                {(billingForm && !is_virtual) && <div className="billing-same">
                    {/* <Checkbox
                                fieldState={{ value: usingSameAddress }}
                                field="addresses_same" label={Identify.__("Billing address same as shipping address")}
                                onChange={() => toggleSameShippingAddress()} /> */}
                    <div className="new-billing-address-same-custom">
                        <input type="radio" name="new-billing-address-custom" id="new-billing-address-same-braintree" defaultChecked={usingSameAddress} onChange={() => handleCheckBoxBilling('same')} />
                        <label htmlFor="new-billing-address-same-braintree">
                            <span>{Identify.__("Same as shipping address")}</span>
                        </label>
                    </div>
                    <div className="new-billing-address-diff-custom">
                        <input type="radio" name="new-billing-address-custom" id="new-billing-address-diff-braintree" defaultChecked={!usingSameAddress} onChange={() => handleCheckBoxBilling('diff')} />
                        <label htmlFor="new-billing-address-diff-braintree">
                            <span>{Identify.__("Use a different billing address")}</span>
                        </label>
                    </div>
                </div>}
                {viewFields}
            </div>
            {/* {viewSubmit} */}
            {renderJs()}
        </React.Fragment>
    )
}

export default FormFields;

async function setToken(token) {
    // TODO: Get correct token expire time from API
    return storage.setItem('signin_token', token, 3600);
}
