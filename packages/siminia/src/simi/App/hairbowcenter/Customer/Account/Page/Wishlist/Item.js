import React from "react";
import Identify from "src/simi/Helper/Identify";
import { Colorbtn } from 'src/simi/BaseComponents/Button'
import { configColor } from 'src/simi/Config'
import ReactHTMLParse from 'react-html-parser';
import { Link } from 'src/drivers';
import { removeWlItem, addWlItemToCart } from 'src/simi/Model/Wishlist'
import { hideFogLoading, showFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading'
import { resourceUrl } from 'src/simi/Helper/Url'
import { formatPrice } from 'src/simi/Helper/Pricing';
import Image from 'src/simi/BaseComponents/Image'
import { productUrlSuffix } from 'src/simi/Helper/Url';
const $ = window.$;

class Item extends React.Component {
    processData(data) {
        hideFogLoading()
        if (data.errors) {
            if (data.errors.length) {
                const errors = data.errors.map(error => {
                    return {
                        type: 'error',
                        message: error.message,
                        auto_dismiss: true
                    }
                });
                this.props.toggleMessages(errors)
            }
        } else if (this.addCart || this.removeItem) {
            if (this.addCart) {
                this.props.toggleMessages([{ type: 'success', message: Identify.__('This product has been moved to cart'), auto_dismiss: true }])
                const { getCartDetails } = this.props;
                if (getCartDetails)
                    getCartDetails()
                showFogLoading()
                this.props.getWishlist()
            }
            if (this.removeItem) {
                this.props.toggleMessages([{ type: 'success', message: Identify.__('This product has been removed from your wishlist'), auto_dismiss: true }])
                showFogLoading()
                this.props.getWishlist()
            }
        }

        this.addCart = false
        this.removeItem = false;
    }

    addToCart(id, location = false) {
        const item = this.props.item;
        if (item.type_id !== 'simple') {
            if (location)
                this.props.history.push(location)
            return
        }
        this.addCart = true;
        const qty = $(`input#item-qty-${id}`).val();
        if (!qty || qty.trim().length < 1) {
            return;
        }
        showFogLoading();
        addWlItemToCart(id, this.processData.bind(this), qty)
    }

    onTrashItem = (id) => {
        if (id) {
            if (confirm(Identify.__('Are you sure you want to delete this product?')) == true) {
                this.handleTrashItem(id)
            }
        }
    }

    handleTrashItem = (id) => {
        showFogLoading();
        this.removeItem = true;
        removeWlItem(id, this.processData.bind(this))
    }

    handleOnChangeQuantity = (e, id) => {
        const value = e.target.value;
        if(parseInt(value) <= 0) {
            $(`#item-qty-${id}`).val(1);
        }
    }

    render() {
        const storeConfig = Identify.getStoreConfig()
        if (!this.currencyCode)
            this.currencyCode = storeConfig ? storeConfig.simiStoreConfig ? storeConfig.simiStoreConfig.currency : storeConfig.storeConfig.default_display_currency_code : null
        const { item, classes } = this.props;
        this.location = {
            pathname: item.product_url_key + productUrlSuffix(),
            state: {
                product_sku: item.product_sku,
                product_id: item.product_id,
                item_data: item
            },
        }

        const addToCartString = <span>{Identify.__('Add to Cart')}</span>

        const image = item.product_image && (
            <div
                className="siminia-product-image"
                style={{
                    borderColor: configColor.image_border_color,
                    backgroundColor: 'white'
                }}>
                <Link to={this.location}>
                    <div style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }}>
                        <Image src={resourceUrl(item.product_image, {
                            type: 'image-product',
                            width: 100
                        })} alt={item.product_name} />
                    </div>
                </Link>

            </div>
        );

        const itemAction =
            <div className="product-item-action">
                <Colorbtn
                    style={{ backgroundColor: configColor.button_background, color: configColor.button_text_color }}
                    className="grid-add-cart-btn"
                    onClick={() => this.addToCart(item.wishlist_item_id, this.location)}
                    text={addToCartString} />

                <Link
                    className="view-link"
                    to={this.location}
                >{Identify.__('View')}</Link>
            </div>

        return (
            <div className={`'product-item siminia-product-grid-item ${item.type_id !== 'simple' ? 'two-btn' : 'one-btn'}`}>
                {image}
                <div className="siminia-product-des">
                    <Link to={this.location} className="product-name">{ReactHTMLParse(item.product_name)}</Link>
                    <div
                        className="prices-layout"
                        id={`price-${item.product_id}`} >
                        {formatPrice(parseFloat(item.product_price))}
                    </div>
                </div>
                <div className="product-item-inner">
                    <textarea name={`description[${item.wishlist_item_id}]`} className="product-item-comment" cols="20" rows="2" defaultValue={item.description} disabled={!item.stock_status} />
                    <div className="box-tocart">
                        <div className="qty-field">
                            <input type="number" disabled={!item.stock_status} name="item-qty" id={`item-qty-${item.wishlist_item_id}`} defaultValue={Number(item.qty)} onChange={(e) => this.handleOnChangeQuantity(e, item.wishlist_item_id)}/>
                        </div>
                        {item.stock_status ? <div className="product-item-actions">
                            <Colorbtn
                                style={{ backgroundColor: "#00CCCC", color: configColor.button_text_color }}
                                className="grid-add-cart-btn"
                                onClick={() => this.addToCart(item.wishlist_item_id, this.location)}
                                text={addToCartString} />
                        </div> : <div className="product-out-stock">{Identify.__('Out of Stock')}</div>}
                    </div>
                    <div className="product-item-actions">
                        <Link
                            className="edit-link"
                            to={this.location}
                        >{Identify.__('Edit')}</Link>
                        <span
                            role="presentation"
                            className="remove-item"
                            onClick={() => this.onTrashItem(item.wishlist_item_id)}>
                            {Identify.__("Remove")}
                        </span>
                    </div>
                </div>
                {/* {itemAction} */}
            </div>
        );
    }
}

export default Item
