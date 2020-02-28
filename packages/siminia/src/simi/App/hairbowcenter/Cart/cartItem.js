import React from 'react'
import Identify from 'src/simi/Helper/Identify'
import { Price } from '@magento/peregrine'
import { Link } from 'react-router-dom';
import ReactHTMLParse from 'react-html-parser';
require('./cartItem.scss')
const $ = window.$;

const CartItem = props => {
    const { currencyCode, item, isPhone, itemTotal, handleLink } = props
    const tax_cart_display_price = 3; // 1 - exclude, 2 - include, 3 - both

    const rowPrice = tax_cart_display_price == 1 ? itemTotal.price : itemTotal.price_incl_tax
    const itemprice = (
        <Price
            currencyCode={currencyCode}
            value={rowPrice}
        />
    )
    const rowTotal = tax_cart_display_price == 1 ? itemTotal.row_total : itemTotal.row_total_incl_tax
    const subtotal = itemTotal && rowTotal && <Price
            currencyCode={currencyCode}
            value={rowTotal}
        />

    const optionText = [];
    if (item.options) {
        const options = item.options;
        for (const i in options) {
            const option = options[i];
            optionText.push(
                <div key={Identify.randomString(5)}>
                    <b>{option.label}</b> : {ReactHTMLParse(option.value)}
                </div>
            );
        }
    }

    const renderOptions = () => {
        if(item.options.length > 0) {
            return item.options.map((option, index) => {
                return (
                    <dl className="item-options" key={index}>
                        <dt>{option.label}</dt>
                        <dd>{ReactHTMLParse(option.value)}</dd>
                        <div className="item-options-clearfix"></div>
                    </dl>
                )
            })
       
        }

        return null;
     
    }

    const changeQuantity = (e, type) => {
        const selector = $(`#cart-quantity-${item.item_id}`)
        let quantity = selector.val();
        quantity = parseInt(quantity, 10);
        if(type === 'plus') {
            quantity = quantity + 1
        }

        if(type === 'minus') {
            quantity = quantity - 1
        }

        if(quantity > 0) {
            selector.val(quantity);
        }
    }   

    const location = `/product.html?sku=${item.simi_sku?item.simi_sku:item.sku}`
    const image = (item.image && item.image.file)?item.image.file:item.simi_image
    return (
            <tbody className="cart-item">
                <tr className="item-info">
                    <td className="col item">
                        <Link to='/' className="product-item-photo">
                            <span className="product-image-container" style={{width: '165px'}}>
                                <span className="product-image-wrapper">
                                    <img src={image} alt={item.name} className="product-image-photo"/>
                                </span>
                            </span>
                        </Link>
                        <div className="product-item-details">
                            <strong className="product-item-name">
                                <Link to={location}>{item.name}</Link>
                            </strong>
                            {renderOptions()}
                        </div>
                    </td>
                    <td className="col price" data-th="Price">
                        <span className="cart-price">{itemprice}</span>
                    </td>
                    <td className="col qty" data-th="Qty">
                        <div className="field-qty">
                            <div className="control qty">
                                <input id={`cart-quantity-${item.item_id}`} type="number" min={1} pattern="[1-9]*" defaultValue={item.qty} className="input-text qty"/>
                            </div>
                            <div className="qty-changer">
                                <div className="qty-inc" onClick={(e) => changeQuantity(e, 'plus')}>
                                    <i className="porto-icon-up-dir"></i>
                                </div>
                                <div className="qty-dec" onClick={(e) => changeQuantity(e, 'minus')}>
                                    <i className="porto-icon-down-dir"></i>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="col subtotal" data-th="Subtotal">
                        <span className="cart-price">{subtotal}</span>
                    </td>
                </tr>
                <tr className="item-actions">
                    <td colSpan="100">
                        <div className="actions-toolbar">
                            <span className="action action-edit" onClick={() => handleLink(location)}></span>
                            <span className="action action-delete" onClick={()=>props.removeFromCart(item)}></span>
                        </div> 
                    </td>
                </tr>
            </tbody>
  
    );
}
export default CartItem;