import React from 'react';
import Identify from "src/simi/Helper/Identify";
import { Link } from 'src/drivers'
import { formatLabelPrice } from 'src/simi/Helper/Pricing';
import Image from 'src/simi/BaseComponents/Image';
import { withRouter } from 'react-router-dom';
const $ = window.$;

const MiniCart = (props) => {
    const { cart, history } = props;

    const { details, totals } = cart;


    const handleRedirect = (link) => {
        handleCloseMiniCart();
        if (link)
            history.push(link)
    }

    const handleCloseMiniCart = () => {
        $(function () {
            const miniWrap = $('.minicart-wrapper');
            if (miniWrap.find('.block-minicart').is(":visible")) {
                miniWrap.find('.block-minicart').slideUp();
            }
        })
    }

    const updateRowItem = (e, item) => {
        if (item) {
            props.updateItem(e.target.value, item)
        }
    }

    const toggleProductOption = (e) => {
        const targetItem = $(e.target);
        targetItem.closest('.product.options').find('.content').toggle();
    }

    const renderCartItem = (items) => {
        let html = null;
        console.log(items);
        if (items && items.length) {
            html = items.map((item, idx) => {
                const { simi_image, simi_sku, name, price, qty, options } = item;
                const itemLocation = `/product.html?sku=${simi_sku}`;

                let htmlOptions = null;
                if (options && options.length) {
                    const htmlC = options.map((otp, ic) => {
                        return <dl className="product options list">
                            <dt className="label">{otp.label}</dt>
                            <dd className="values">
                                <span data-bind="html: option.value">{otp.value}</span>
                            </dd>
                        </dl>
                    });
                    htmlOptions = <div className="product options">
                        <span className="toggle" onClick={(e) => toggleProductOption(e)}><span>{Identify.__("See Details")}</span></span>
                        <div className="content">
                            {htmlC}
                        </div>
                    </div>
                }

                return <li className="item product product-item" id={`mini-cart-item-${item.item_id}`} key={idx}>
                    <div className="product">
                        <Link to={itemLocation} onClick={() => handleCloseMiniCart()} className="product-item-photo">
                            <span className="product-image-container">
                                <span className="product-image-wrapper">
                                    <Image src={simi_image} alt={name} />
                                </span>
                            </span>
                        </Link>
                        <div className="product-item-details">
                            <strong className="product-item-name">
                                <Link to={itemLocation} onClick={() => handleCloseMiniCart()} >{name}</Link>
                            </strong>
                            {htmlOptions}
                            <div className="product-item-pricing">
                                <div className="price-container">
                                    <span className="price-wrapper">{formatLabelPrice(price)}</span>
                                </div>
                                <div className="details-qty qty">
                                    <label htmlFor="" className="label">{Identify.__("Qty")}</label>
                                    <input type="number" name="qty" className="item-qty cart-item-qty" defaultValue={qty} onChange={(e) => updateRowItem(e, item)} />
                                </div>
                            </div>
                            <div className="product actions">
                                <span className="edit-item" onClick={() => handleRedirect(itemLocation)}></span>
                                <span className="del-item" onClick={() => props.removeItem(item)} />
                            </div>
                        </div>
                    </div>
                </li>
            })
        }
        return html;
    }

    return <div className="block-minicart">
        <div id="minicart-content-wrapper">
            <div className="block-content">
                <span className="btn-minicart-close" role="presentation" onClick={() => handleCloseMiniCart()} />
                {(!details || !details.items_qty) ?
                    <strong className="subtitle empty">
                        <span>{Identify.__("You have no items in your shopping cart.")}</span>
                    </strong>
                    :
                    <React.Fragment>
                        <div className="items-total">
                            <span className="count">{details.items_qty}</span>
                            <span>{details.items_qty > 1 ? Identify.__("items") : Identify.__("item")}</span>
                        </div>
                        <div className="subtotal">
                            <span className="label">
                                <span>{Identify.__("Cart Subtotal")}</span>
                            </span>
                            {totals && totals.subtotal_incl_tax ? <div className="amount price-container">
                                <span className="price-wrapper">
                                    <span className="price">{formatLabelPrice(totals.subtotal_incl_tax)}</span>
                                </span>
                            </div> : ''}
                        </div>

                        <div className="actions">
                            <button id="top-cart-btn-checkout" type="button" className="action primary checkout" onClick={() => handleRedirect('/checkout.html')}>{Identify.__("Go to Checkout")}</button>
                        </div>
                        <div className="minicart-items-wrapper">
                            <ol className="minicart-items" id="mini-cart">
                                {renderCartItem(details.items)}
                            </ol>
                        </div>
                        <div className="actions">
                            <div className="secondary">
                                <Link to={'/cart.html'} onClick={() => handleCloseMiniCart()} className="action viewcart">{Identify.__("View and edit cart")}</Link>
                            </div>
                        </div>
                    </React.Fragment>}
            </div>
        </div>
    </div>
}

export default (withRouter)(MiniCart);
