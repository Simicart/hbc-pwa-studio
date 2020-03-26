import React, { useCallback, Fragment, useState, useMemo } from 'react';
import { asField, BasicRadioGroup } from 'informed';
import { array, bool, func } from 'prop-types';
import { isRequired } from 'src/util/formValidators';

import Button from 'src/components/Button';
import Radio from 'src/components/RadioGroup/radio';
import TextInput from 'src/components/TextInput';
import Field from 'src/components/Field';
import isObjectEmpty from 'src/util/isObjectEmpty';
import Identify from 'src/simi/Helper/Identify';
import BraintreeDropin from './paymentMethods/braintreeDropin';
import CCType from './paymentMethods/ccType';
import AddressItem from 'src/simi/App/hairbowcenter/BaseComponents/Address';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
require('./paymentsFormItems.scss');

const $ = window.$;

/**
 * This component is meant to be nested within an `informed` form. It utilizes
 * form state to do conditional rendering and submission.
 */
const CustomRadioPayment = asField(({ fieldState, ...props }) => (
    <BasicRadioGroup {...props} fieldState={fieldState} />
));

const PaymentsFormItems = props => {

    const {
        setIsSubmitting,
        submit,
        isSubmitting,
        paymentMethods,
        initialValues,
        paymentCode,
        cart,
        cartCurrencyCode,
        billingAddr,
        billingAddress,
        shippingAddress,
        placeOrder,
        toggleMessages
    } = props;

    // Currently form state toggles dirty from false to true because of how
    // informed is implemented. This effectively causes this child components
    // to re-render multiple times. Keep tabs on the following issue:
    //   https://github.com/joepuzzo/informed/issues/138
    // If they resolve it or we move away from informed we can probably get some
    // extra performance.

    // const formState = useFormState();
    let initialV = null;
    if (paymentCode) {
        if (Identify.ApiDataStorage('payment_selected_local')) {
            if (paymentCode === Identify.ApiDataStorage('payment_selected_local')) {
                initialV = paymentCode;
            } else {
                initialV = Identify.ApiDataStorage('payment_selected_local');
            }
        } else {
            initialV = paymentCode;
        }
    } else {
        if (Identify.ApiDataStorage('payment_selected_local')) {
            initialV = Identify.ApiDataStorage('payment_selected_local');
        }
    }

    const [selectedPMethod, setSelectedPMethod] = useState(initialV);

    const handleError = useCallback(() => {
        setIsSubmitting(false);
    }, [setIsSubmitting]);


    let selectablePaymentMethods;

    if (paymentMethods && paymentMethods.length) {
        selectablePaymentMethods = paymentMethods.map(
            ({ code, title }) => ({
                label: title,
                value: code
            })
        );
    } else {
        selectablePaymentMethods = []
    }

    let thisInitialValue = null;
    if (initialValues && !isObjectEmpty(initialValues)) {
        if (initialValues.value) {
            thisInitialValue = initialValues.value;
        }
    }

    // The success callback. Unfortunately since form state is created first and
    // then modified when using initialValues any component who uses this
    // callback will be rendered multiple times on first render. See above
    // comments for more info.
    const handleSuccess = useCallback(
        value => {
            setIsSubmitting(false);
            submit({
                code: value.value,
                data: value
            });
        },
        [setIsSubmitting, submit]
    );


    const handleSubmit = useCallback(() => {
        setIsSubmitting(true);
    }, [setIsSubmitting]);

    const handleSavePO = () => {

        /* if (formState.values.purchaseorder) {
            const { values } = formState;
            handleSuccess(JSON.parse(JSON.stringify(values)));
        } */
    }

    const renderBilling = () => {

        return <div className="checkout-billing-address">
            <div className="billing-address-same-as-shipping-block field choice">
                <h3>{Identify.__("Billing address")}</h3>
                <div style={{ paddingBottom: '10px' }}>
                    <span>{Identify.__("Select the address that matches your card or payment method")}</span>
                </div>
                {billingAddr}
            </div>

            {billingAddress && !isObjectEmpty(billingAddress) && shippingAddress && !isObjectEmpty(shippingAddress) ?
                (!billingAddress.hasOwnProperty('sameAsShippingAddress') ? <AddressItem data={billingAddress} /> : <AddressItem data={shippingAddress} />)
                : null}
        </div>
    }

    const changeRadioMethod = (stCode) => {
        setSelectedPMethod(stCode);
        Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'payment_selected_local', stCode);

        let parseData = {};

        if (paymentMethods && paymentMethods.length) {
            const selectedPayment = paymentMethods.find(({ code }) => stCode === code);
            if (selectedPayment) {
                if (selectedPayment.code === 'braintree') {
                    // handleSubmit();
                } else if (selectedPayment.code === 'checkmo' || (selectedPayment.hasOwnProperty('simi_payment_data') && !isObjectEmpty(selectedPayment.simi_payment_data) && parseInt(selectedPayment.simi_payment_data.show_type, 10) === 0)) {
                    // payment type 0
                    parseData = selectablePaymentMethods.find(
                        ({ value }) => value === stCode
                    );

                    handleSuccess(parseData)
                }
            }

        }
    }

    const handlePlaceOrder = () => {
        placeOrder();
    }

    const checkFormAddressData = (form, queryString) => {
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

    const customSubmit = () => {
        if ($('#billingAddressForm').find('input#new-billing-address-diff-braintree') && $('#billingAddressForm').find('input#new-billing-address-diff-braintree').is(":checked")) {
            const form = $(`#billingAddressForm`);
            const queryStringRaw = form.serializeArray();
            const queryString = queryStringRaw.filter(item => item.name !== "new-billing-address-custom");
            const validCheck = checkFormAddressData(form, queryString);
            if (validCheck) {
                handleSubmit();
            } else {
                toggleMessages([{ type: 'error', message: Identify.__('Required field is empty!'), auto_dismiss: true }]);
                smoothScrollToView($("#root"));
            }
        } else {
            handleSubmit();
        }
    }

    const renderMethod = () => {
        let mt = null;
        if (paymentMethods.length) {
            let paymentMethodsConfirm = paymentMethods;
            if (cart && !isObjectEmpty(cart) && cart.hasOwnProperty('details') && cart.hasOwnProperty('totals')) {
                if (cart.details.is_virtual && cart.totals.grand_total === 0) {
                    paymentMethodsConfirm = paymentMethods.filter(itemT => itemT.code === 'free');
                }
            }

            mt = paymentMethodsConfirm.filter(itemT => itemT.code !== 'braintree_paypal' && itemT.code !== 'braintree_paypal_credit').map(ite => {
                let frameCard = '';
                if (selectedPMethod === ite.code) {
                    if (ite.code === 'purchaseorder') {
                        frameCard = <Fragment>
                            <Field label={Identify.__("Purchase Order Number")} required>
                                <TextInput
                                    id='purchaseorder'
                                    field="purchaseorder"
                                    validate={isRequired}
                                />

                            </Field>
                            <Button
                                className='button'
                                style={{ marginTop: 10, marginBottom: 20 }}
                                type="submit"
                                onClick={() => handleSavePO()}
                            >{Identify.__('Save')}</Button>
                        </Fragment>
                    } else if (ite.code === 'braintree') {
                        // const childBrainTree = useMemo(() => <BraintreeDropin shouldRequestPaymentNonce={isSubmitting} method={ite.code} onError={handleError} onSuccess={handleSuccess} />, [handleSuccess]);

                        frameCard = <Fragment>
                            {renderBilling()}
                            <BraintreeDropin shouldRequestPaymentNonce={isSubmitting} method={ite.code} cart={cart} cartCurrencyCode={cartCurrencyCode} paymentMethods={paymentMethods} onError={handleError} onSuccess={handleSuccess} toggleMessages={toggleMessages} />
                            <div className="actions-toolbar">
                                <div className="primary">
                                    <button className="action primary" onClick={() => customSubmit()}>{Identify.__('Place Order')}</button>
                                </div>
                            </div>
                        </Fragment>
                    } else if (ite.hasOwnProperty('simi_payment_data') && !isObjectEmpty(ite.simi_payment_data)) {
                        if (parseInt(ite.simi_payment_data.show_type, 10) === 1) {
                            // payment type 1
                            frameCard = <CCType onSuccess={handleSuccess} paymentContent={ite.simi_payment_data} cartCurrencyCode={cartCurrencyCode} cart={cart} payment_method={ite.code} />
                        }
                        if (parseInt(ite.simi_payment_data.show_type, 10) === 3) {
                            // payment type 3
                            frameCard = 'Coming soon!'
                        }
                        if (parseInt(ite.simi_payment_data.show_type, 10) === 0) {
                            frameCard = <Fragment>
                                {renderBilling()}
                                <div className="actions-toolbar">
                                    <div className="primary">
                                        <button className="action primary" onClick={() => handlePlaceOrder()}>{Identify.__('Place Order')}</button>
                                    </div>
                                </div>
                            </Fragment>
                        }
                    } else {
                        frameCard = <Fragment>
                            {renderBilling()}
                            <div className="actions-toolbar">
                                <div className="primary">
                                    <button className="action primary" onClick={() => handlePlaceOrder()}>{Identify.__('Place Order')}</button>
                                </div>
                            </div>
                        </Fragment>
                    }
                }

                return <Fragment key={ite.code}>
                    <Radio label={ite.title} value={ite.code} onChange={() => changeRadioMethod(ite.code)} />
                    {frameCard && <div className="payment-method-content">
                        {frameCard}
                    </div>}
                </Fragment>
            });
        }
        return mt;
    }

    return (
        <Fragment>
            <div className='body'>
                <div className='payment-method-item'>
                    <CustomRadioPayment initialValue={initialV} field="payment_method" key={thisInitialValue} /* onChange={() => selectPaymentMethod()} */>
                        {renderMethod()}
                    </CustomRadioPayment>
                </div>
            </div>

        </Fragment>
    );
};

PaymentsFormItems.propTypes = {
    cancel: func.isRequired,
    countries: array,
    isSubmitting: bool,
    setIsSubmitting: func.isRequired,
    submit: func.isRequired,
    submitting: bool
};

export default PaymentsFormItems;
