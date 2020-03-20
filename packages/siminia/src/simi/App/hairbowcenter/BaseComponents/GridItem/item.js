import React, { useState } from 'react';
import defaultClasses from './item.css'
import { configColor } from 'src/simi/Config';
import PropTypes from 'prop-types';
import ReactHTMLParse from 'react-html-parser'
import { mergeClasses } from 'src/classify'
import Price from 'src/simi/App/hairbowcenter/BaseComponents/Price';
import { prepareProduct } from 'src/simi/Helper/Product'
import { Link } from 'src/drivers';
import LazyLoad from 'react-lazyload';
import { logoUrl } from 'src/simi/Helper/Url'
import Image from 'src/simi/BaseComponents/Image'
import { StaticRate } from 'src/simi/App/hairbowcenter/BaseComponents/Rate'
import Identify from 'src/simi/Helper/Identify'
import { productUrlSuffix, saveDataToUrl } from 'src/simi/Helper/Url';
import { Colorbtn } from 'src/simi/BaseComponents/Button';
import { addToCart as simiAddToCart } from 'src/simi/Model/Cart';
import { addToWishlist as simiAddToWishlist } from 'src/simi/Model/Wishlist';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading'
import { updateItemInCart } from 'src/actions/cart';
import { connect } from 'src/drivers';
import { showToastMessage } from 'src/simi/Helper/Message';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { getProductLabel } from '../../Helper';
import { formatPrice } from 'src/simi/Helper/Pricing';
import { resourceUrl } from 'src/simi/Helper/Url'

require("./item.scss");
const $ = window.$;

const Griditem = props => {
    const item = prepareProduct(props.item)
    const productLabelConfig = getProductLabel()
    const logo_url = logoUrl()
    const { classes, hideActionButton } = props
    if (!item) return '';
    const itemClasses = mergeClasses(defaultClasses, classes);
    const { name, url_key, id, price, type_id, simiExtraField } = item;
    let { small_image } = item;
    const product_url = `/${url_key}${productUrlSuffix()}`
    saveDataToUrl(product_url, item)
    const location = {
        pathname: product_url,
        state: {
            product_id: id,
            item_data: item
        },
    }

    const { regularPrice, minimalPrice } = price;
    const regularPriceAmount = regularPrice.amount.value;
    const minimalPriceAmount = minimalPrice.amount.value;
    let spPrice = null;
    if (regularPriceAmount !== minimalPriceAmount && productLabelConfig && productLabelConfig.sale_label) {
        if (regularPriceAmount > minimalPriceAmount) {
            spPrice = Math.round(100 - ((minimalPriceAmount * 100) / regularPriceAmount), 2);
        } else {
            spPrice = Math.round(100 - ((regularPriceAmount * 100) / minimalPriceAmount), 2);
        }
    }

    let isNew = false;
    let hoverImage = null;
    if (simiExtraField.attribute_values) {
        if (productLabelConfig && productLabelConfig.new_label) {
            const now = new Date()
            let newsFrom = null;
            let newsTo = null;
            if (simiExtraField.attribute_values.news_from_date) {
                newsFrom = new Date(simiExtraField.attribute_values.news_from_date)
            }
            if (simiExtraField.attribute_values.news_to_date) {
                newsTo = new Date(simiExtraField.attribute_values.news_to_date)
            }

            if (newsFrom || newsTo) {
                if ((newsFrom && newsTo && now >= newsFrom && now <= newsTo) || (!newsTo && now >= newsFrom) || (!newsFrom && now <= newsTo)) {
                    isNew = true
                }
            }
        }
        if (simiExtraField.attribute_values.small_image) {
            small_image = resourceUrl(simiExtraField.attribute_values.small_image, { type: 'image-product', width: 300 });
        }
        if (simiExtraField.attribute_values.product_image_behind) {
            hoverImage = resourceUrl(simiExtraField.attribute_values.product_image_behind, { type: 'image-product', width: 300 });
        }
    }

    let spLabel = null;
    if (spPrice && productLabelConfig.sale_label_percent) {
        spLabel = <div className="product-label sale-label">-{spPrice}%</div>
    } else if (spPrice && !productLabelConfig.sale_label_percent) {
        spLabel = <div className="product-label sale-label">{productLabelConfig.new_label_text}</div>
    }

    const image = (
        <div className="product photo product-item-photo">
            <Link to={location}>
                {<Image src={small_image} alt={name} />}
                {hoverImage && <Image src={hoverImage} alt={name} className="hover_image" />}
            </Link>
            <div className="product-labels">
                {spLabel}
                {isNew && <div className="product-label new-label">{productLabelConfig.new_label_text}</div>}
            </div>

            {hideActionButton && <div className="product-item-inner">
                <div className="product actions product-item-actions">
                    <div className="actions-primary">
                        <button className="action tocart primary" onClick={() => addToCart()}></button>
                    </div>
                </div>
            </div>}
        </div>
    );

    let stockAvai = false;
    if (item && item.simiExtraField && item.simiExtraField.attribute_values && item.simiExtraField.attribute_values.hasOwnProperty('product_is_stock') && item.simiExtraField.attribute_values.product_is_stock) {
        stockAvai = true
    }

    const addToCartCallBack = (data) => {
        hideFogLoading()
        if (data.errors) {
            if (data.errors.length) {
                showToastMessage(data.errors[0])
            }
        } else {
            if (data.message) {
                showToastMessage(Array.isArray(data.message) ? data.message[0] : data.message)
            }
            props.updateItemInCart()
        }
    }

    const addToCart = () => {
        if (!stockAvai)
            return

        if (item && item.simiExtraField && item.simiExtraField.attribute_values && item.simiExtraField.attribute_values.type_id !== "simple") {
            props.handleLink(location)
            return;
        }
        showFogLoading()
        simiAddToCart(addToCartCallBack, { product: item.id });
    }

    const addToCartBtn = (
        <Colorbtn
            style={{
                backgroundColor: stockAvai ? "#00CCCC" : 'gray',
                color: configColor.button_text_color,
                marginBottom: 15,
                paddingTop: 14,
                fontWeight: 600,
                height: 40,
            }}
            className="grid-item-add-cart-btn"
            onClick={() => addToCart()}
            text={stockAvai ? Identify.__('Add to cart') : Identify.__('Out of stock')} />
    );

    const addToWishlist = () => {
        const { isSignedIn, handleLink } = props
        if (!isSignedIn) {
            handleLink('/login.html')
        } else {
            const params = { product: item.id, qty: 1 };
            showFogLoading();
            simiAddToWishlist(addToWishlistCallBack, params)
        }
    }

    const showError = (data) => {
        hideFogLoading();
        if (data.errors.length) {
            const errors = data.errors.map(error => {
                return {
                    type: 'error',
                    message: error.message,
                    auto_dismiss: true
                }
            });
            props.toggleMessages(errors)
        }
    }

    const addToWishlistCallBack = (data) => {
        const { isSignedIn, handleLink } = props;
        hideFogLoading()
        if (data.errors) {
            showError(data)
        } else {
            showToastMessage(Identify.__('Product was added to your wishlist'));
            if(isSignedIn) handleLink('/wishlist.html');
        }
    }

    const renderAsLowPrice = () => {
        const { simiExtraField } = item
        if (simiExtraField.attribute_values && simiExtraField.attribute_values.app_price && parseInt(simiExtraField.attribute_values.app_price.is_low_price, 10) === 1) {
            const { app_price } = simiExtraField.attribute_values;
            return (
                <Link to={location} className="minimal-price-link">
                    <span className="price-container">
                        <span className="price-label">{app_price.low_price_label + ' '}</span>
                        <span className="price-wrapper">{formatPrice(app_price.low_price)}</span>
                    </span>
                </Link>
            )
        }

        return null
    }

    const addToWishlistBtn = (
        <div className="action towishlist" onClick={() => addToWishlist()} role="presentation">
            <span>{Identify.__('Add to wishlist')}</span>
        </div>
    );

    return (
        <li className="item product product-item">
            <div className="product-item-info">
                {
                    props.lazyImage ?
                        (<LazyLoad placeholder={<img alt={name} src={logo_url} style={{ maxWidth: 60, maxHeight: 60 }} />}>
                            {image}
                        </LazyLoad>) :
                        image
                }

                <div className="product details product-item-details">
                    <strong className="product name product-item-name">
                        <Link to={location} className="product-item-link">{ReactHTMLParse(name)}</Link>
                    </strong>

                    <div className="product-reviews-summary short">
                        <hr />
                        <div className="rate-container">
                            <StaticRate rate={simiExtraField.app_reviews.rate} classes={itemClasses} />
                        </div>
                    </div>
                    <div className="product description product-item-description">
                        {ReactHTMLParse(item.short_description.html)}
                        <Link to={location} className="action more">{Identify.__("Learn more")}</Link>
                    </div>
                    <div className="price-box">
                        <Price prices={price} type={type_id} />
                        {renderAsLowPrice()}
                    </div>
                    {item.short_description && <div className="short-description">{ReactHTMLParse(item.short_description.html)}</div>}
                    {!hideActionButton && <div className="product-actions">
                        <div className="actions product-item-actions">
                            {addToWishlistBtn}
                            {addToCartBtn}
                        </div>
                    </div>}
                </div>
            </div>
        </li>
    )
}

Griditem.contextTypes = {
    item: PropTypes.object,
    handleLink: PropTypes.func,
    classes: PropTypes.object,
    lazyImage: PropTypes.bool,
    hideActionButton: PropTypes.bool
}

Griditem.defaultProps = {
    hideActionButton: false
}

const mapStateToProps = state => {
    const { user } = state;
    const { isSignedIn } = user;
    return {
        isSignedIn
    };
};

const mapDispatchToProps = {
    updateItemInCart,
    toggleMessages
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Griditem);
