import React, { useState } from 'react';
// import Loading from "src/simi/BaseComponents/Loading";
import Identify from 'src/simi/Helper/Identify'
import { formatPrice } from 'src/simi/Helper/Pricing';
import {
    getCartDetails,
} from 'src/actions/cart';
import PaginationTable from './PaginationTable';
import { Link } from 'react-router-dom';
import defaultClasses from './style.scss'
import classify from "src/classify";
import { getReOrder } from '../../../../../../Model/Orders';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import { compose } from 'redux';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading'

const OrderList = props => {
    const { showForDashboard, data, getCartDetails } = props
    const [limit, setLimit] = useState(10);
    const [title, setTitle] = useState(10)
    const cols =
        [
            { title: Identify.__("Order #") },
            { title: Identify.__("Date") },
            /* { title: Identify.__("Ship to") }, */
            { title: Identify.__("Order Total") },
            { title: Identify.__("Status") },
            { title: Identify.__("Action") },
            // { title: Identify.__(""), width: "12.27%" }
        ];
    // const limit = 2;
    const currentPage = 1;

    const processData = (data) => {
        if (data && data.message) {
            hideFogLoading();
            getCartDetails();
            props.toggleMessages([{ type: 'success', message: data.message }])
        }
    }

    const renderOrderItem = (item, index) => {
        const arr = item.created_at.split(/[- :]/);
        let date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        date = date.getDate() + "/" + m + "/" + date.getFullYear();
        const location = {
            pathname: "/orderdetails.html/" + item.increment_id,
            state: { orderData: item }
        };
     
        return (
            <tr key={index}>
                <td data-title={Identify.__("Order #")}>
                    {Identify.__(item.increment_id)}
                </td>
                <td
                    data-title={Identify.__("Date")}
                >
                    {date}
                </td>
                {/* <td data-title={Identify.__("Ship to")}>{`${item.customer_firstname} ${item.customer_lastname}`}</td> */}
                <td data-title={Identify.__("Total")}>
                    {formatPrice(item.grand_total)}
                </td>
                <td className="order-status" data-title={Identify.__("Status")}>
                    {item.status}
                </td>

                <td data-title="">
                    <Link className="view-order" to={location}>{Identify.__('View')}</Link>
                    {item.status === 'processing' || item.status === 'completed' ? <div aria-hidden onClick={() => {
                        showFogLoading();
                        getReOrder(item.id, processData)
                    }} className="view-order">{Identify.__('Reorder')}</div> : ''}
                </td>
            </tr>
        )
    }
    let listOrder = [];
    if (data.hasOwnProperty('customerOrders') && data.customerOrders.items instanceof Array && data.customerOrders.items.length > 0) {
        listOrder = data.customerOrders.items.sort((a, b) => {
            return b.id - a.id
        })
    }
    return (
        <div className='customer-recent-orders'>
            {!data || !data.hasOwnProperty('customerOrders') || data.customerOrders.items.length === 0
                ? (
                    <div className="text-center">
                        {Identify.__("You have no items in your order")}
                    </div>
                ) : (
                    <PaginationTable
                        renderItem={renderOrderItem}
                        data={showForDashboard ? listOrder.slice(0, 3) : listOrder}
                        cols={cols}
                        showPageNumber={!showForDashboard}
                        limit={typeof (limit) === 'string' ? parseInt(limit) : limit}
                        setLimit={setLimit}
                        currentPage={currentPage}
                        title={title}
                        setTitle={setTitle}
                    />
                )
            }
        </div>
    )
}

const mapDispatchToProps = {
    toggleMessages,
    getCartDetails
}

export default compose(
    classify(defaultClasses),
    connect(
        null,
        mapDispatchToProps
    )
)(OrderList);
