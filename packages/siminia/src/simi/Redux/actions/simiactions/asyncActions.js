import { Util, RestApi } from '@magento/peregrine';
import actions from './actions';
import userActions from 'src/actions/user/actions';
import checkoutActions from 'src/actions/checkout/actions';
import checkoutReceiptActions from 'src/actions/checkoutReceipt';
import cartActions from 'src/actions/cart/actions';
import { getCartDetails, clearCartId, removeCart, createCart } from 'src/actions/cart';
import { getUserDetails } from 'src/actions/user';
import isObjectEmpty from 'src/util/isObjectEmpty';
import Identify from 'src/simi/Helper/Identify';
import { refresh } from 'src/util/router-helpers';
import {getShippingMethods} from 'src/actions/checkout/asyncActions';
import { getCountries } from 'src/actions/directory';

//const { request } = RestApi.Magento2;
import { request } from 'src/simi/Network/RestMagento'

const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const changeSampleValue = value => async dispatch => {
    dispatch(actions.changeSampleValue(value));
}

export const simiSignedIn = response => async dispatch => {
    dispatch(userActions.signIn.receive(response));
    dispatch(getUserDetails()).then(() => dispatch(fullFillAddress()));
    dispatch(getUserPoints());
    dispatch(removeCart());
    dispatch(getCartDetails({ forceRefresh: true }));
    // dispatch(fullFillAddress());
}

export const simiSignOut = ({ history }) => async dispatch => {

    // Sign the user out in local storage and Redux.
    await clearToken();
    dispatch(userActions.signIn.reset());

    // Now that we're signed out, forget the old (customer) cart
    // and fetch a new guest cart.
    dispatch(removeCart());
    dispatch(getCartDetails({ forceRefresh: true }));

    // remove address
    storage.removeItem('cartId');
    storage.removeItem('signin_token');
    sessionStorage.removeItem("shipping_address");
    sessionStorage.removeItem("billing_address");
    sessionStorage.removeItem("ck_signup_newsletter");
    sessionStorage.removeItem("localSelectedShippingMethod");
    sessionStorage.removeItem("payment_selected_local");
    sessionStorage.removeItem("last_order_info");
    sessionStorage.removeItem("quoteOrder");
    await clearBillingAddress();
    await clearShippingAddress();
    await clearAvailableShippingMethod();
    await clearShippingMethod();

    // Finally, go back to the first page of the browser history.
    refresh({ history });
};

export const toggleMessages = value => async dispatch => {
    dispatch(actions.toggleMessages(value));
}

export const getUserPoints = () =>
    async function thunk(...args) {
        const [dispatch, getState] = args;
        const { user } = getState();

        if (user.isSignedIn) {

            // get user reward points
            try {
                const userRW = await request('/rest/V1/simiconnector/rewards/balance', {
                    method: 'GET'
                });

                if (userRW instanceof Array && userRW.length){
                    dispatch(actions.getUserRewardsPoints(userRW[0]));
                }else{
                    dispatch(actions.getUserRewardsPoints(userRW));
                }
            } catch (error) {
                dispatch(actions.getUserRewardsPoints(error));
            }

        }
    };

export const submitShippingAddress = payload =>
    async function thunk(dispatch, getState) {
        dispatch(checkoutActions.shippingAddress.submit(payload));
        const { cart, directory, user } = getState();

        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        const { countries } = directory;
        let { formValues: address } = payload;
        try {
            address = Identify.formatAddress(address, countries);
        } catch (error) {
            dispatch(
                checkoutActions.shippingAddress.reject({
                    incorrectAddressMessage: error.message
                })
            );
            return null;
        }
        dispatch(actions.changeCheckoutUpdating(true));
        await saveShippingAddress(address);
        dispatch(checkoutActions.shippingAddress.accept(address));

        const guestEndpoint = `/rest/V1/guest-carts/${cartId}/estimate-shipping-methods`;
        const authedEndpoint =
            '/rest/V1/carts/mine/estimate-shipping-methods';
        const endpoint = user.isSignedIn ? authedEndpoint : guestEndpoint;
        const response = await request(endpoint, {
            method: 'POST',
            body: JSON.stringify({address})
        });
        dispatch(actions.changeCheckoutUpdating(false));
        await saveAvailableShippingMethod(response);
        dispatch(checkoutActions.getShippingMethods.receive(response));
    };

export const submitBillingAddress = payload =>
    async function thunk(dispatch, getState) {
        dispatch(checkoutActions.billingAddress.submit(payload));

        const { cart, directory } = getState();

        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        let desiredBillingAddress = payload;
        if (!payload.sameAsShippingAddress) {
            const { countries } = directory;
            try {
                desiredBillingAddress = Identify.formatAddress(payload, countries);
            } catch (error) {
                dispatch(checkoutActions.billingAddress.reject(error));
                return;
            }
        }
        await saveBillingAddress(desiredBillingAddress);
        dispatch(checkoutActions.billingAddress.accept(desiredBillingAddress));
    };

export const fullFillAddress = () => {
    return async function thunk(dispatch, getState) {
        const { user, checkout } = getState();
        const { currentUser } = user;
        if (user && user.isSignedIn && currentUser && currentUser.hasOwnProperty('addresses') && currentUser.addresses.length) {
            const { addresses, default_shipping, default_billing } = currentUser;
            const { shippingAddress, billingAddress } = checkout;

            if (!shippingAddress && default_shipping) {
                let df_Address = addresses.find(
                    ({ id }) => parseInt(id, 10) === parseInt(default_shipping, 10)
                )
                if (df_Address) {
                    try {
                        const { region } = df_Address;
                        if (region instanceof Object && !isObjectEmpty(region)) {
                            df_Address = {
                                ...df_Address, region_id: parseInt(region.region_id, 10),
                                region_code: region.region_code,
                                region: region.region
                            }
                        }

                    } catch (error) {
                        dispatch(
                            checkoutActions.shippingAddress.reject({
                                incorrectAddressMessage: error.message
                            })
                        );
                        return null;
                    }

                    await saveShippingAddress(df_Address);
                    dispatch(checkoutActions.shippingAddress.accept(df_Address));
                }
            }

            if (!billingAddress && default_billing) {
                let df_BAddress = addresses.find(
                    ({ id }) => parseInt(id, 10) === parseInt(default_billing, 10)
                )

                if (default_shipping && (default_billing === default_shipping)) {
                    df_BAddress = { sameAsShippingAddress: true }
                }

                if (df_BAddress) {
                    if (!df_BAddress.sameAsShippingAddress) {
                        try {
                            const { region } = df_BAddress;
                            if (region instanceof Object && !isObjectEmpty(region)) {
                                df_BAddress = {
                                    ...df_BAddress, region_id: parseInt(region.region_id, 10),
                                    region_code: region.region_code,
                                    region: region.region
                                }
                            }
                        } catch (error) {
                            dispatch(
                                checkoutActions.billingAddress.reject({
                                    incorrectAddressMessage: error.message
                                })
                            );
                            return null;
                        }
                    }

                    await saveBillingAddress(df_BAddress);
                    dispatch(checkoutActions.billingAddress.accept(df_BAddress));
                }
            }

        }

    }
}

export const submitShippingMethod = payload =>
    async function thunk(dispatch, getState) {
        // dispatch(actions.changeCheckoutUpdating(true));
        dispatch(checkoutActions.shippingMethod.submit(payload));

        const { cart, user } = getState();
        const { cartId } = cart;
        const { isSignedIn } = user;

        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        const desiredShippingMethod = payload.formValues.shippingMethod;
        await saveShippingMethod(desiredShippingMethod);
        dispatch(checkoutActions.shippingMethod.accept(desiredShippingMethod));

        // try to update shipping totals
        let billing_address = await retrieveBillingAddress();
        const shipping_address = await retrieveShippingAddress();

        if (!billing_address || billing_address.sameAsShippingAddress) {
            billing_address = shipping_address;
        } else {
            const { email, firstname, lastname, telephone } = shipping_address;

            billing_address = {
                email,
                firstname,
                lastname,
                telephone,
                ...billing_address
            };
        }

        try{
            // POST to shipping-information to submit the shipping address and shipping method.
            const guestShippingEndpoint = `/rest/V1/guest-carts/${cartId}/shipping-information`;
            const authedShippingEndpoint =
                '/rest/V1/carts/mine/shipping-information';
            const shippingEndpoint = isSignedIn
                ? authedShippingEndpoint
                : guestShippingEndpoint;

            const response = await request(shippingEndpoint, {
                method: 'POST',
                body: JSON.stringify({
                    addressInformation: {
                        billing_address,
                        shipping_address,
                        shipping_carrier_code: desiredShippingMethod.carrier_code,
                        shipping_method_code: desiredShippingMethod.method_code
                    }
                })
            });

            dispatch(cartActions.getDetails.receive({ paymentMethods: response.payment_methods, totals: response.totals }));
        }catch(error){
            dispatch(checkoutActions.shippingMethod.reject(error));
        }
        // dispatch(actions.changeCheckoutUpdating(false));
    };

export const submitOrder = () =>
    async function thunk(dispatch, getState) {
        dispatch(checkoutActions.order.submit());

        const { cart, user } = getState();
        const { cartId } = cart;
        if (!cartId) {
            throw new Error('Missing required information: cartId');
        }

        let billing_address = await retrieveBillingAddress();
        const paymentMethod = await retrievePaymentMethod();
        const shipping_address = await retrieveShippingAddress();

        if (!billing_address || billing_address.sameAsShippingAddress) {
            if (billing_address.sameAsShippingAddress && shipping_address.hasOwnProperty('save_in_address_book') && shipping_address.save_in_address_book){
                // avoid duplicate save same address book for both shipping address & billing address
                billing_address = {...shipping_address, save_in_address_book : 0}
            }else{
                billing_address = shipping_address;
            }
        } else {
            if (shipping_address && shipping_address.email) {
                const { email, firstname, lastname, telephone } = shipping_address;
                billing_address = {
                    email,
                    firstname,
                    lastname,
                    telephone,
                    ...billing_address
                };
            }
        }

        try {

            // POST to payment-information to submit the payment details and billing address,
            // Note: this endpoint also actually submits the order.
            const guestPaymentEndpoint = `/rest/V1/guest-carts/${cartId}/payment-information`;
            const authedPaymentEndpoint =
                '/rest/V1/carts/mine/payment-information';
            const paymentEndpoint = user.isSignedIn
                ? authedPaymentEndpoint
                : guestPaymentEndpoint;

            const bodyData = {
                billingAddress: billing_address,
                cartId: cartId,
                email: billing_address.email,
                paymentMethod: {
                    additional_data: {
                        payment_method_nonce: paymentMethod.data.nonce
                    },
                    method: paymentMethod.code
                }
            };

            // for CC payment: Stripe
            if (paymentMethod.data.hasOwnProperty('cc_token') && paymentMethod.data.cc_token){
                bodyData.paymentMethod['additional_data'] = paymentMethod.data;
            }

            // for payment type Purchase Order
            if (paymentMethod.data.hasOwnProperty('purchaseorder') && paymentMethod.data.purchaseorder){
                bodyData.paymentMethod['po_number'] = paymentMethod.data.purchaseorder;
            }

            // check variable signup newsletter
            const ck_newsletter = Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'ck_signup_newsletter');
            if (ck_newsletter){
                bodyData.paymentMethod['extension_attributes'] = {po_newsletter_subscribe: ck_newsletter}
            }

            const response = await request(paymentEndpoint, {
                method: 'POST',
                body: JSON.stringify(bodyData)
            });

            dispatch(
                checkoutReceiptActions.setOrderInformation({
                    id: response,
                    billing_address
                })
            );

            // Clear out everything we've saved about this cart from local storage.
            // await clearBillingAddress();
            await clearCartId();
            await clearPaymentMethod();
            // await clearShippingAddress();
            await clearShippingMethod();

            //simi save last order id
            Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'last_order_info', response)

            dispatch(checkoutActions.order.accept(response));
            dispatch(actions.messagePaymentInformationAccept(response));
        } catch (error) {
            dispatch(checkoutActions.order.reject(error));
            dispatch(
                actions.messagePaymentInformationReject(error.message)
            );
        }
    };

async function saveShippingAddress(address) {
    if (address.hasOwnProperty('region') && address.region instanceof Object) {
        address = (({ region, ...others }) => ({ ...others }))(address)
    }

    address = (({ id, default_billing, default_shipping, ...others }) => ({ ...others }))(address);
    return storage.setItem('shipping_address', address);
}

async function saveBillingAddress(address) {
    if (address.hasOwnProperty('region') && address.region instanceof Object) {
        address = (({ region, ...others }) => ({ ...others }))(address)
    }

    address = (({ id, default_billing, default_shipping, ...others }) => ({ ...others }))(address);
    return storage.setItem('billing_address', address);
}

async function retrieveBillingAddress() {
    return storage.getItem('billing_address');
}

async function clearBillingAddress() {
    return storage.removeItem('billing_address');
}

async function retrievePaymentMethod() {
    return storage.getItem('paymentMethod');
}

async function clearPaymentMethod() {
    return storage.removeItem('paymentMethod');
}

async function retrieveShippingAddress() {
    return storage.getItem('shipping_address');
}

async function clearShippingAddress() {
    return storage.removeItem('shipping_address');
}

async function retrieveShippingMethod() {
    return storage.getItem('shippingMethod');
}

async function saveShippingMethod(method) {
    return storage.setItem('shippingMethod', method);
}

async function clearShippingMethod() {
    return storage.removeItem('shippingMethod');
}

async function clearToken() {
    return storage.removeItem('signin_token');
}

async function clearAvailableShippingMethod() {
    return storage.removeItem('availableShippingMethod');
}

async function saveAvailableShippingMethod(methods) {
    if (methods && methods instanceof Object && Object.keys(methods).length >0){
        for(const key in methods){
            const method = methods[key];
            methods[key]['code'] = method.carrier_code
            methods[key]['title'] = method.carrier_title
        }
        return storage.setItem('availableShippingMethod', methods);
    }else{
        return storage.removeItem('availableShippingMethod');
    }
}

export const saveCustomerDetail = value => async dispatch => {
    dispatch(userActions.getDetails.receive(value));
}

export const beginCheckout = () =>
    async function thunk(dispatch) {
        dispatch(checkoutActions.begin());
        dispatch(fullFillAddress());
        dispatch(getCountries());
        dispatch(getShippingMethodsCustomize());
    };

export const getShippingMethodsCustomize = () => {
    return async function thunk(dispatch, getState) {
        const { cart, user, checkout } = getState();
        const { cartId } = cart;

        try {
            // if there isn't a guest cart, create one
            // then retry this operation
            if (!cartId) {
                await dispatch(createCart());
                return thunk(...arguments);
            }

            dispatch(checkoutActions.getShippingMethods.request(cartId));

            const guestEndpoint = `/rest/V1/guest-carts/${cartId}/estimate-shipping-methods`;
            const authedEndpoint =
                '/rest/V1/carts/mine/estimate-shipping-methods';
            const endpoint = user.isSignedIn ? authedEndpoint : guestEndpoint;
            const s_address = checkout.shippingAddress ? checkout.shippingAddress : {
                country_id: 'US',
                postcode: null
            };

            const response = await request(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    address: s_address
                })
            });

            dispatch(checkoutActions.getShippingMethods.receive(response));
        } catch (error) {
            const { response } = error;

            dispatch(checkoutActions.getShippingMethods.receive(error));

            // check if the guest cart has expired
            if (response && response.status === 404) {
                // if so, clear it out, get a new one, and retry.
                await clearCartId();
                await dispatch(createCart());
                return thunk(...arguments);
            }
        }
    };
};
