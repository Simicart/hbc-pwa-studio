import { createActions } from 'redux-actions';

const prefix = 'SIMIACTIONS';
const actionTypes = [
    'CHANGE_SAMPLE_VALUE',
    'TOGGLE_MESSAGES',
    'CHANGE_CHECKOUT_UPDATING',
    'MESSAGE_PAYMENT_INFORMATION_ACCEPT',
    'MESSAGE_PAYMENT_INFORMATION_REJECT'
];

export default createActions(...actionTypes, { prefix });
