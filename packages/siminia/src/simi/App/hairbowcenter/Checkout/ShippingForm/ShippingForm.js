import React, { useCallback } from 'react';
import { Form } from 'informed';
import { array, func, shape, string } from 'prop-types';
import { formatLabelPrice } from 'src/simi/Helper/Pricing';
import Identify from 'src/simi/Helper/Identify';
import FieldShippingMethod from '../components/fieldShippingMethod';
import Loading from 'src/simi/BaseComponents/Loading/ReactLoading'
import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();
require('./ShippingForm.scss')

const ShippingForm = props => {
    const {
        availableShippingMethods,
        cancel,
        shippingMethod,
        submit
    } = props;

    let initialValue;
    let selectableShippingMethods = [];
    const individualAvailable = storage.getItem('availableShippingMethod');

    if (availableShippingMethods.length) {
        selectableShippingMethods = availableShippingMethods;
        initialValue = shippingMethod
    } else {

        if (individualAvailable){
            selectableShippingMethods = individualAvailable;
            initialValue = shippingMethod;
        }else{
            selectableShippingMethods = [];
            initialValue = '';
        }
        // return <Loading />
    }

    const handleSubmit = useCallback(
        ({ shippingMethod }) => {
            const selectedShippingMethod = selectableShippingMethods.find(
                ({ carrier_code }) => carrier_code === shippingMethod
            );

            if (!selectedShippingMethod) {
                console.warn(
                    `Could not find the selected shipping method ${selectedShippingMethod} in the list of available shipping methods.`
                );
                cancel();
                return;
            }

            submit({ shippingMethod: selectedShippingMethod });
        },
        [availableShippingMethods, cancel, submit]
    );

    const childFieldProps = {
        initialValue,
        selectableShippingMethods,
        submit,
        cancel
    }

    return (
        <Form className="root" onSubmit={handleSubmit} id="shipping-method-form">
            <div className="body">
                <FieldShippingMethod {...childFieldProps} />
            </div>
        </Form>
    );
};

ShippingForm.propTypes = {
    availableShippingMethods: array.isRequired,
    cancel: func.isRequired,
    shippingMethod: string,
    submit: func.isRequired
};

ShippingForm.defaultProps = {
    availableShippingMethods: [{}]
};

export default ShippingForm;
