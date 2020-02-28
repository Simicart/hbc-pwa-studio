import React, { useEffect, useState } from 'react';
import { func, shape, string } from 'prop-types';
import Button from 'src/components/Button';
import { getOrderInformation, getAccountInformation } from 'src/selectors/checkoutReceipt';
import { connect } from 'src/drivers';
import actions from 'src/actions/checkoutReceipt';
import { hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import Identify from 'src/simi/Helper/Identify';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { getUserDetails } from 'src/actions/user';
import { getOrderDetail } from 'src/simi/Model/Orders';
require('./thankyou.scss')

const Thankyou = props => {
    hideFogLoading()
    const { history, order } = props;

    const [data, setData] = useState(null)
    const hasOrderId = () => order && order.id ? order.id : (Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'last_order_info') ? Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'last_order_info') : null)

    useEffect(() => {
        const id = hasOrderId();
        const api = Identify.ApiDataStorage('quoteOrder') || {}
        if (id && api.hasOwnProperty(id)) {
            const data = api[id]
            setData(data)
        }
        if (!data && id) {
            getOrderDetail(id, processData)
        }
        props.getUserDetails();
    }, [])

    const processData = (data) => {
        const dataArr = {}
        const key = hasOrderId();
        const dataOrder = data.order;
        setData(dataOrder)
        dataArr[key] = dataOrder;
        Identify.ApiDataStorage("quoteOrder", 'update', dataArr);
    }

    const handleViewOrderDetails = () => {
        if (!hasOrderId()) {
            history.push('/');
            return;
        }
        const orderId = '/orderdetails.html/' + hasOrderId();
        const orderLocate = {
            pathname: orderId,
            state: {
                orderData: {
                    increment_id: hasOrderId()
                }
            }
        }
        history.push(orderLocate);
    }
    smoothScrollToView($("#root"));

    return (
        <div className="container thankyou-page" style={{ marginTop: 40 }}>
            {TitleHelper.renderMetaHeader({
                title: Identify.__('Thank you for your purchase!')
            })}
            <div className="root">
                <div className="body">
                    <div className='textBlock'>{Identify.__('Your order number is:')} {hasOrderId && <span className="order-detail" onClick={() => handleViewOrderDetails()}>{hasOrderId()}</span>}</div>
                    <div className='textBlock'>{Identify.__("We'll email you an order confirmation with details and tracking info.")}</div>
                    <Button onClick={() => history.push('/category.html')}>
                        {Identify.__('Continue Shopping')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

Thankyou.propTypes = {
    order: shape({
        id: string
    }).isRequired,
    createAccount: func.isRequired,
    reset: func.isRequired,
    user: shape({
        /* isSignedIn: bool */
        email: string
    })
};

Thankyou.defaultProps = {
    order: {},
    reset: () => { },
    createAccount: () => { }
};

const { reset } = actions;

const mapStateToProps = state => ({
    order: getOrderInformation(state),
    user: getAccountInformation(state)
});

const mapDispatchToProps = {
    reset,
    getUserDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Thankyou);
