import React, { useCallback, Fragment, useEffect } from 'react';
import { array, bool, func, object, oneOf, shape, string } from 'prop-types';

import AddressForm from './AddressForm/AddressForm';
import PaymentsForm from './PaymentsForm/PaymentsForm';
import ShippingForm from './ShippingForm/ShippingForm';
import AddressItem from 'src/simi/BaseComponents/Address';
import isObjectEmpty from 'src/util/isObjectEmpty';
import Identify from 'src/simi/Helper/Identify';

require('./editableForm.scss')
const $ = window.$;
/**
 * The EditableForm component renders the actual edit forms for the sections
 * within the form.
 */

const EditableForm = props => {
    const {
        editing,
        editOrder,
        submitShippingAddress,
        submitShippingMethod,
        submitting,
        isAddressInvalid,
        invalidAddressMessage,
        directory: { countries },
        paymentMethods,
        submitBillingAddress,
        submitPaymentMethod,
        user,
        simiSignedIn,
        paymentCode,
        toggleMessages,
        cartCurrencyCode,
        cart,
        is_virtual,
        placeOrder,
        paymentData,
        ready,
        simiPaymentInformationMessage
    } = props;

    const handleCancel = useCallback(() => {
        editOrder(null);
    }, [editOrder]);

    const handleSubmitAddressForm = useCallback(
        formValues => {
            submitShippingAddress({
                formValues
            });
        },
        [submitShippingAddress]
    );

    /* const handleSubmitPaymentsForm = useCallback(
        formValues => {
            submitPaymentMethodAndBillingAddress({
                formValues
            });
        },
        [submitPaymentMethodAndBillingAddress]
    ); */

    /* const handleSubmitShippingForm = useCallback(
        formValues => {
            submitShippingMethod({
                formValues
            });
        },
        [changeLocalShippingMethod]
    ); */
    const handleSubmitShippingForm = (formValues) => {
        if (formValues && formValues.shippingMethod) {
            Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'localSelectedShippingMethod', formValues)
            $('#checkout-next-step').show();
        }
    }

    const handleSubmitBillingForm = useCallback(
        formValues => {
            submitBillingAddress(formValues);
        },
        [submitBillingAddress]
    );

    const handleSubmitPaymentsForm = useCallback(
        formValues => {

            submitPaymentMethod(formValues);
        },
        [submitPaymentMethod]
    );

    useEffect(() => {
        if (ready && (paymentCode === 'braintree' || paymentCode === 'braintree_paypal' || paymentCode === 'braintree_paypal_credit') && !simiPaymentInformationMessage) {
            placeOrder()
        }
    });

    switch (editing) {
        case 'address': {
            const { billingAddress } = props;
            let { shippingAddress } = props;
            if (!shippingAddress) {
                shippingAddress = undefined;
            }

            return (
                <Fragment>
                    <AddressForm
                        id="shippingAddressForm"
                        cancel={handleCancel}
                        countries={countries}
                        isAddressInvalid={isAddressInvalid}
                        invalidAddressMessage={invalidAddressMessage}
                        initialValues={shippingAddress}
                        submit={handleSubmitAddressForm}
                        submitting={submitting}
                        billingAddressSaved={billingAddress}
                        submitBilling={handleSubmitBillingForm}
                        user={user}
                        simiSignedIn={simiSignedIn}
                        toggleMessages={toggleMessages}
                    />
                    {shippingAddress && !isObjectEmpty(shippingAddress) && simiSignedIn ?
                        <AddressItem data={shippingAddress} /> : null}
                </Fragment>
            );
        }

        case 'billingAddress': {
            let { billingAddress } = props;
            if (!billingAddress) {
                billingAddress = undefined;
            }

            return (
                <Fragment>
                    <AddressForm
                        id="billingAddressForm"
                        cancel={handleCancel}
                        countries={countries}
                        isAddressInvalid={isAddressInvalid}
                        invalidAddressMessage={invalidAddressMessage}
                        initialValues={billingAddress}
                        submit={handleSubmitBillingForm}
                        submitting={submitting}
                        billingForm={true}
                        user={user}
                        is_virtual={is_virtual}
                    />
                    {billingAddress && !isObjectEmpty(billingAddress) && !billingAddress.hasOwnProperty('sameAsShippingAddress') ?
                        <AddressItem data={billingAddress} /> : null}
                </Fragment>

            );
        }

        case 'paymentMethod': {
            let { paymentData, billingAddress, shippingAddress } = props;
            if (!paymentData) {
                paymentData = undefined;
            }
            if (!billingAddress) {
                billingAddress = undefined;
            }
            if (!shippingAddress) {
                shippingAddress = undefined;
            }

            const billingAddr = <Fragment>
                <AddressForm
                    id="billingAddressForm"
                    cancel={handleCancel}
                    countries={countries}
                    isAddressInvalid={isAddressInvalid}
                    invalidAddressMessage={invalidAddressMessage}
                    initialValues={billingAddress}
                    submit={handleSubmitBillingForm}
                    submitting={submitting}
                    billingForm={true}
                    user={user}
                    is_virtual={is_virtual}
                    s_address={shippingAddress}
                />
            </Fragment>

            return (
                <PaymentsForm
                    cancel={handleCancel}
                    countries={countries}
                    initialValues={paymentData}
                    paymentCode={paymentCode}
                    submit={handleSubmitPaymentsForm}
                    submitting={submitting}
                    paymentMethods={paymentMethods}
                    cart={cart}
                    cartCurrencyCode={cartCurrencyCode}
                    key={Identify.randomString()}
                    billingAddr={billingAddr}
                    billingAddress={billingAddress}
                    shippingAddress={shippingAddress}
                    placeOrder={placeOrder}
                />
            );
        }

        case 'shippingMethod': {
            const { availableShippingMethods, shippingMethod } = props;

            return (
                <ShippingForm
                    availableShippingMethods={availableShippingMethods}
                    cancel={handleCancel}
                    shippingMethod={shippingMethod}
                    submit={handleSubmitShippingForm}
                    submitting={submitting}
                    key={Identify.randomString()}
                />
            );
        }

        default: {
            return null;
        }
    }
};

EditableForm.propTypes = {
    availableShippingMethods: array,
    editing: oneOf(['address', 'billingAddress', 'paymentMethod', 'shippingMethod']),
    editOrder: func.isRequired,
    shippingAddress: object,
    shippingMethod: string,
    submitShippingAddress: func.isRequired,
    submitShippingMethod: func.isRequired,
    submitBillingAddress: func.isRequired,
    submitPaymentMethod: func.isRequired,
    submitting: bool,
    isAddressInvalid: bool,
    invalidAddressMessage: string,
    directory: shape({
        countries: array
    }),
    paymentMethods: array,
    user: object
};

export default EditableForm;
