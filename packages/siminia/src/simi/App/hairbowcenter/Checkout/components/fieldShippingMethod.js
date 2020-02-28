import React, { Fragment, useCallback } from 'react';
import { useFormState } from 'informed';
import { formatLabelPrice } from 'src/simi/Helper/Pricing';
import Select from 'src/components/Select';
import Identify from "src/simi/Helper/Identify";
require('./fieldShippingMethod.scss')
const $ = window.$;

const fieldShippingMethod = (props) => {
    const { initialValue, selectableShippingMethods, cancel, submit } = props;

    // const formState = useFormState();

    const handleSelectMethod = useCallback(
        (shippingMethod) => {
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
            // cancel();
        },
        [selectableShippingMethods, cancel, submit]
    )

    /* const handleShippingMethod = () => {
        const shippingMethod = formState.values['shippingMethod'];
        if (shippingMethod) handleSelectMethod(shippingMethod);
    } */

    const onChangeShippingMethod = (e) => {
        handleSelectMethod(e.currentTarget.value);
    }

    const renderAllShippingMethod = () => {
        let html = null;
        if (selectableShippingMethods && selectableShippingMethods.length) {
            html = selectableShippingMethods.map((method, idx) => {
                const extTooltip = method.hasOwnProperty('extension_attributes') && method.extension_attributes && method.extension_attributes.hasOwnProperty('tooltip') ? method.extension_attributes.tooltip : null;
                return <div className="method-item" key={idx} >
                    {method.available ? <input type="radio" value={method.carrier_code} id={`method-item-${idx}-${method.method_code}`} defaultChecked={method.carrier_code === initialValue} onChange={onChangeShippingMethod} name="shipping_method" /> : <span style={{ width: 20, margin: '3px 0.5ex' }} />}
                    <label htmlFor={`method-item-${idx}-${method.method_code}`}>
                        <div className="method-item-price">{formatLabelPrice(method.amount)}</div>
                        <div className="method-item-title">{method.method_title}</div>
                        <div className="method-item-carrier-title">{method.carrier_title}</div>
                        {extTooltip && <div className="method-item-tooltip">
                            <span className="field-tooltip-action">
                                <span>{Identify.__("More information")}</span>
                            </span>
                            <div className="field-tooltip-content">
                                <span>{extTooltip}</span>
                            </div>
                        </div>}
                    </label>
                    {method.hasOwnProperty('error_message') && method.error_message ? <div className="error message">
                        <div>
                            {method.error_message}
                        </div>
                    </div> : ''}
                </div>
            })
        } else {
            html = <div className="no-quotes-block">{Identify.__("Sorry, no quotes are available for this order at this time")}</div>
        }
        return html;
    }

    const renderJs = () => {
        $(document).ready(function () {
            const tooltipAction = $('.field-tooltip-action');
            tooltipAction.unbind().click(function () {
                $('.method-item-tooltip').find('.field-tooltip-content').hide();
                $(this).closest('.method-item-tooltip').find('.field-tooltip-content').toggle()
            });
        })
    }

    return <Fragment>
        <div
            className="ship-method_field"
            id="shippingMethod"
        >
            {renderAllShippingMethod()}
            {renderJs()}
        </div>
    </Fragment>

}
export default fieldShippingMethod;
