import React, { useState, useEffect } from 'react';
import Identify from "src/simi/Helper/Identify";
import { getCustomerRecentOrder, addReorderedToCart } from 'src/simi/App/hairbowcenter/Model/Customer';
import { Link } from 'src/drivers';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { getCartDetails } from 'src/actions/cart';
import { connect } from 'src/drivers';
import { showToastMessage } from 'src/simi/Helper/Message';
require("./style.scss");

const RecentOrdered = (props) => {
    const [data, setData] = useState(null);

    function processData(sData) {
        setData(sData);
    }

    useEffect(() => {
        if (!data) {
            getCustomerRecentOrder(processData, { limit: 1 });
        }
    }), [];

    if (!data || (data && data.errors) || (data && data.total < 1)) return null;

    const renderRecentContent = (order) => {
        let html = null;
        if (order && order.order_items && order.order_items.length) {
            const orderItem = order.order_items.map((order_item, idl) => {
                return <li className="product-item" key={idl}>
                    <div className="field item choice">
                        <input type="checkbox" name="order_items[]" value={order_item.item_id} />
                    </div>
                    <strong className="product-item-name">
                        <Link to={`/product.html?sku=${order_item.sku}`}>{order_item.name}</Link>
                    </strong>
                </li>;
            });
            html = <form id="my-recent-ordered" onSubmit={submitReorder}>
                <ol className="product-items product-items-names">{orderItem}</ol>
                <div className="actions-toolbar">
                    <button type="submit" className="action tocart primary">{Identify.__("Add to Cart")}</button>
                    <div className="secondary">
                        <Link to={`/account.html`} className="action view">{Identify.__("View All")}</Link>
                    </div>
                </div>
            </form>
        }
        return html;
    }

    const submitReorder = (e) => {
        e.preventDefault();
        const queryString = $(e.target).serializeArray();
        const itemList = [];
        for (const key in queryString) {
            const item = queryString[key];
            const itemValue = item.value.trim();
            itemList.push(itemValue);
        }
        if (itemList.length) {
            const params = { list_items: itemList };
            showFogLoading();
            $(e.target)[0].reset();
            addReorderedToCart(processAddToCart, params);
        }
    }

    function processAddToCart(cData) {
        hideFogLoading();
        if (cData.success) {
            props.getCartDetails();
            showToastMessage(cData.message);
        } else {
            showToastMessage(cData.message);
        }
    }

    return <div className="block block-reorder">
        <div className="block-title">
            <strong className="block-reorder-heading">{Identify.__("Recently Ordered")}</strong>
        </div>
        <div className="block-content">
            <div className="recent-block-container">
                {data.orders && data.orders.length ? renderRecentContent(data.orders[0]) : ''}
            </div>
        </div>
    </div>
}

const mapDispatchToProps = {
    getCartDetails
};

export default connect(
    null,
    mapDispatchToProps
)(RecentOrdered);
