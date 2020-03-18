import React, { Component, Suspense } from 'react';
import { arrayOf, bool, number, shape, string, object } from 'prop-types';
import { formatPrice } from 'src/simi/Helper/Pricing';
import Loading from 'src/simi/BaseComponents/Loading'
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'
import ProductImage from './ProductImage';
import Quantity from './ProductQuantity';
import isProductConfigurable from 'src/util/isProductConfigurable';
import Identify from 'src/simi/Helper/Identify';
import TitleHelper from 'src/simi/Helper/TitleHelper'
import {prepareProduct} from 'src/simi/Helper/Product'
import ProductPrice from '../Component/Productprice';
import { addToCart as simiAddToCart } from 'src/simi/Model/Cart';
import { addToWishlist as simiAddToWishlist } from 'src/simi/Model/Wishlist';
import {addProductStockAlert} from '../../../Model/Product';
import {showToastMessage} from 'src/simi/Helper/Message';
import ReactHTMLParse from 'react-html-parser';
import Review from "./Review";
import TopReview from "./Review/TopReview";
import SocialShare from './SocialShare';
import Description from './Description';
import ShortDescription from './ShortDescription';
import CustomBlock from 'src/simi/App/hairbowcenter/BaseComponents/Blocks/CustomBlock1';
import RelatedProduct from './RelatedProduct';
import ProductQuestion from './ProductQuestion';
import StickyProduct from './StickyProduct';
import SideBanner from './SideBanner';
import QuantityDiscounts from './QuantityDiscounts';

const ConfigurableOptions = React.lazy(() => import('./Options/ConfigurableOptions'));
const CustomOptions = React.lazy(() => import('./Options/CustomOptions'));
const BundleOptions = React.lazy(() => import('./Options/Bundle'));
const GroupedOptions = React.lazy(() => import('./Options/GroupedOptions'));
const DownloadableOptions = React.lazy(() => import('./Options/DownloadableOptions'));

const $ = window.$;

require('./productFullDetail.scss');
class ProductFullDetail extends Component {
    state = {
        optionCodes: new Map(),
    };
    quantity = 1

    static getDerivedStateFromProps(props, state) {
        const { configurable_options } = props.product;
        const optionCodes = new Map(state.optionCodes);
        // if this is a simple product, do nothing
        if (!isProductConfigurable(props.product) || !configurable_options) {
            return null;
        }
        // otherwise, cache attribute codes to avoid lookup cost later
        for (const option of configurable_options) {
            optionCodes.set(option.attribute_id, option.attribute_code);
        }
        return { optionCodes };
    }

    componentDidMount() {
        const runAlert = Identify.ApiDataStorage('run-alert');
        if(runAlert) {
            sessionStorage.removeItem('run-alert');
            this.handleAddProductStockAlert()
        }
        $(document).mouseup(function(e) {
            const container = $(".product-detail-root .product-sidebar");

            // if the target of the click isn't the container nor a descendant of the container
            if (window.innerWidth < 992 && !container.is(e.target) && container.has(e.target).length === 0)
            {
                container.removeClass('open');
            }
        });

    }

    componentWillUnmount() {
        $(document).off('mouseup')
    }

    setQuantity = quantity => this.quantity = quantity;

    setProductRelatedAddToCart = (productId) => {
        if(productId instanceof Array) {
            const products = [];
            productId.forEach(id => {
                products.push({product: id, qty: 1})
            })
            this.productRelatedATC = products
        } else {
            const products = this.productRelatedATC || [];
            let type = 'add'
            products.forEach((product, index) => {
                if(product.product === productId) {
                    type = 'remove'
                    products.splice(index, 1)
                }
            })
            if(type === 'add') {
                products.push({product: productId, qty: 1})
                this.productRelatedATC = products
            }
        }
    }

    prepareParams = () => {
        const { props, quantity, productSelection } = this;
        const { product } = props;

        const params = {product: String(product.id), qty: quantity?String(quantity):'1'}
        if (this.customOption) {
            const customOptParams = this.customOption.getParams()
            if (customOptParams && customOptParams.options) {
                params['options'] = customOptParams.options
            } else
                this.missingOption = true
        }
        if (this.bundleOption) {
            const bundleOptParams = this.bundleOption.getParams()
            if (bundleOptParams && bundleOptParams.bundle_option_qty && bundleOptParams.bundle_option) {
                params['bundle_option'] = bundleOptParams.bundle_option
                params['bundle_option_qty'] = bundleOptParams.bundle_option_qty
            }
        }
        if (this.groupedOption) {
            const groupedOptionParams = this.groupedOption.getParams()
            if (groupedOptionParams && groupedOptionParams.super_group) {
                params['super_group'] = groupedOptionParams.super_group
            }
        }
        if (this.downloadableOption) {
            const downloadableOption = this.downloadableOption.getParams()

            if (downloadableOption && downloadableOption.links) {
                params['links'] = downloadableOption.links
            } else
                this.missingOption = true
        }
        if(product.type_id === 'configurable') {
            if (productSelection && productSelection.length > 0) { //configurable option
                const groupSelection = [];
                productSelection.forEach(value => {
                    const superAttribute = {}
                    value.selectionOptions.forEach((value, key) => {
                        superAttribute[String(key)] = String(value)
                    })
                    groupSelection.push({
                        super_attribute: superAttribute,
                        quantity: value.quantity
                    })
                })

                params['group_selection'] = groupSelection
            } else {
                this.missingOption = true
            }
        }

        return params
    }

    addToCart = () => {
        const { props } = this;
        const {  product } = props;
        if (product && product.id ) {
            this.missingOption = false
            const params = this.prepareParams()
            if (this.missingOption) {
                showToastMessage(Identify.__('Please select the options required (*)'));
                return
            }

            if(this.productRelatedATC && this.productRelatedATC.length > 0) {
                this.productRelatedATC.forEach((product) => {
                    showFogLoading()
                    simiAddToCart(() => {}, product)
                })
            }

            if(params.group_selection && params.group_selection.length > 0) {
                params.group_selection.forEach((param, index) => {
                    let callBack = () => {}
                    if(params.group_selection.length === index + 1) {
                        callBack = this.addToCartCallBack
                    }
                    const newParams = {
                        product: params.product,
                        qty: param.quantity,
                        super_attribute: param.super_attribute
                    }
                    showFogLoading()
                    simiAddToCart(callBack, newParams)
                })
            } else {
                showFogLoading()
                this.startUpdateCart = true
                simiAddToCart(this.addToCartCallBack, params)
            }


        }
    };

    addToCartCallBack = (data) => {
        hideFogLoading()
        if (data.errors) {
            this.showError(data)
        } else {
            this.showSuccess(data)
            this.props.updateItemInCart()
        }
    }

    addToWishlist = () => {
        const {product, isSignedIn, history} = this.props
        const params = this.prepareParams()
        if (!isSignedIn) {
            const location = {
                pathname: '/login.html',
                state: {
                    params_wishlist: params
                }
            }
            history.push(location)
        } else if (product && product.id) {
            this.missingOption = false
            showFogLoading()
            simiAddToWishlist(this.addToWishlistCallBack, params)
        }
    }

    addToWishlistCallBack = (data) => {
        hideFogLoading()
        if (data.errors) {
            this.showError(data)
        } else {
            this.props.toggleMessages([{
                type: 'success',
                message: Identify.__('Product was added to your wishlist'),
                auto_dismiss: false
            }])

            this.props.history.push('/wishlist.html');
        }
    }

    showError(data) {
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
    }

    showSuccess(data) {
        if (data.message) {
            this.props.toggleMessages([{
                type: 'success',
                message: Array.isArray(data.message)?data.message[0]:data.message,
                auto_dismiss: true
            }])
        }
    }

    handleConfigurableSelectionChange = (productSelection) => {
        this.productSelection = productSelection
    };

    handleOnSideBar = () => {
        $('.product-detail-root .product-sidebar').addClass('open')
    }

    handleAddProductStockAlert = () => {
        const {product} = this.props
        const {id} = product
        const payload = {
            product_id: id
        }
        showFogLoading()
        addProductStockAlert(this.callBackAddProdcutStockAlert, payload)
    }

    callBackAddProdcutStockAlert = (data) => {
        hideFogLoading()
        const {history, product} = this.props
        if(data.error && data.message === 'Not login') {
            history.push({pathname: '/login.html', state: {link: product.url_key}})
        } else {
            this.showSuccess(data);
        }
    }

    get isMissingConfigurableOptions() {
        const { product } = this.props;
        const { configurable_options } = product;
        const numProductOptions = configurable_options.length;
        const numProductSelections = this.state.optionSelections.size;
        return numProductSelections < numProductOptions;
    }

    get fallback() {
        return <Loading />;
    }

    get productOptions() {
        const { fallback, handleConfigurableSelectionChange, props } = this;
        const { configurable_options, simiExtraField, type_id, is_dummy_data} = props.product;
        const isConfigurable = isProductConfigurable(props.product);
        const product = prepareProduct(props.product)
        if (is_dummy_data)
            return <Loading />
        return (
            <Suspense fallback={fallback}>
                {
                    isConfigurable &&
                    <ConfigurableOptions
                        options={configurable_options}
                        onSelectionChange={handleConfigurableSelectionChange}
                        simiAppOptions={simiExtraField.app_options}
                        product={product}
                    />
                }
                {
                    type_id === 'bundle' &&
                    <BundleOptions
                        key={Identify.randomString(5)}
                        app_options={simiExtraField.app_options}
                        product_id={this.props.product.entity_id}
                        ref={e => this.bundleOption = e}
                        parent={this}
                    />
                }
                {
                    type_id === 'grouped' &&
                    <GroupedOptions
                        key={Identify.randomString(5)}
                        app_options={props.product.items?props.product.items:[]}
                        product_id={this.props.product.entity_id}
                        ref={e => this.groupedOption = e}
                        parent={this}
                    />
                }
                {
                    type_id === 'downloadable' &&
                    <DownloadableOptions
                        key={Identify.randomString(5)}
                        app_options={simiExtraField.app_options}
                        product_id={this.props.product.entity_id}
                        ref={e => this.downloadableOption = e}
                        parent={this}
                    />
                }
                {
                    ( simiExtraField && simiExtraField.app_options && simiExtraField.app_options.custom_options) &&
                    <CustomOptions
                        key={Identify.randomString(5)}
                        app_options={simiExtraField.app_options}
                        product_id={this.props.product.entity_id}
                        ref={e => this.customOption = e}
                        parent={this}
                    />
                }
            </Suspense>
        );
    }

    renderCartButton(isStock, addToCart, isDummyData) {
        let text = Identify.__('Add to Cart')
        let display = true;
        let disable = false;
        if(isDummyData) {
            disable = true
            text = Identify.__('Loading ...');
        } else {
            display = isStock
        }

        if(display) {
            return (
                <div className="actions">
                    <button disable={disable.toString()} className={`action primary tocart ${disable ? 'disable' : ''}`} id="product-addtocart-button" onClick={addToCart}>
                        <span>{text}</span>
                    </button>
                </div>
            )
        }

        return null;
    }

    renderPricesTier(tierPrices, tierPricesData) {
        if(tierPrices && tierPrices.length > 0) {
            const html = tierPrices.map((tierPrice, index) => {
                if(tierPrice.price > 0) {
                    let percentageValue = null
                    if(!tierPrice.percentage_value && tierPricesData && tierPricesData[index]) {
                        const tierPricesText = tierPricesData[index]
                        const tierPriceArray = tierPricesText.split(' ');
                        percentageValue = tierPriceArray[tierPriceArray.length - 1];
                    } else {
                        percentageValue = parseInt(tierPrice.percentage_value);
                    }

                    if(!isNaN(percentageValue)) {
                        return (
                            <li className="item" key={index}>
                                {`Buy ${parseInt(tierPrice.price_qty)} for `}<span className="price">{formatPrice(tierPrice.price)}</span> {` each and `} <strong className="benefit">{` save `}<span className="">{percentageValue + '%'}</span></strong>
                            </li>
                        )
                    }
                    
                    return null;
                }

                return null
            })
            return (
                <ul className="prices-tier">
                    {html}
                </ul>
            )
        }

        return null
    }

    render() {
        hideFogLoading()
        const { addToCart, productOptions, props, state, addToWishlist } = this;
        const { optionCodes } = state
        const product = prepareProduct(props.product)
        const { type_id, name, simiExtraField } = product;
        const {simiStoreConfig} = Identify.getStoreConfig()
        const isStock = product.simiExtraField.attribute_values.product_is_stock;
        const {is_dummy_data} = product;
        return (
            <div className="container product-detail-root">
                {TitleHelper.renderMetaHeader({
                    title: product.meta_title?product.meta_title:product.name?product.name:'',
                    desc: product.meta_description?product.meta_description:product.description?product.description:''
                })}
                <SocialShare product={product} isSignedIn={this.props.isSignedIn}/>
                <StickyProduct product={product} addToCart={this.addToCart}/>
                <div className="product-detail-main">
                    <div className="product-image">
                        <ProductImage
                            optionCodes={optionCodes}
                            product={product}
                        />
                    </div>
                    <div className="product-content">
                        <div className="page-title-wrapper">
                            <h1 className="page-title">
                                <span>{ReactHTMLParse(name)}</span>
                            </h1>
                        </div>
                        <TopReview app_reviews={product.simiExtraField.app_reviews}/>
                        <ShortDescription shortDesc={product.short_description}/>
                        <ProductPrice ref={(price) => this.Price = price} data={product}/>
                        {typeof isStock !== 'undefined' && !isStock && <div className="product-alert-stock">
                            <div className="action alert" onClick={this.handleAddProductStockAlert}>{Identify.__('Notify me when this product is in stock')}</div>
                        </div>}
                        {this.renderPricesTier(product.simiExtraField.attribute_values.tier_price, product.simiExtraField.app_tier_prices)}
                        <div className="product-social-links"></div>
                        <div className="product-options-bottom">
                            <div className="box-tocart">
                                <div className="fieldset">
                                    {type_id === 'simple' && isStock && <Quantity initialValue={this.quantity} onValueChange={this.setQuantity}/>}
                                    {this.renderCartButton(isStock, addToCart, is_dummy_data)}
                                   <div className="moved-add-to-links">
                                        <div className="product-addto-links">
                                            <div className="action towishlist" onClick={addToWishlist}>
                                                <span>{Identify.__('Add to Wish List')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="clearer"></div>
                    <div id="prdetail" className="prdetail">
                        {productOptions}
                        <div className="product-info-detail">
                            <div className="product-data-items">
                                <Description product={product} name={name}/>
                                {simiExtraField.attribute_values.quantity_discounts && <QuantityDiscounts data={simiExtraField.attribute_values.quantity_discounts}/>}
                                <ProductQuestion productId={product.id} toggleMessages={this.props.toggleMessages}/>
                                <Review isSignedIn={this.props.isSignedIn} product={product} toggleMessages={this.props.toggleMessages}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="product-sidebar" className="product-sidebar sidebar-additional">
                    <p></p>
                    {simiStoreConfig.config && simiStoreConfig.config.shop_support && <CustomBlock data={simiStoreConfig.config.shop_support}/>}
                    <RelatedProduct product={product} setProduct={this.setProductRelatedAddToCart}/>
                    <SideBanner />
                </div>
            </div>
        );
    }
}

ProductFullDetail.propTypes = {
    product: shape({
        __typename: string,
        id: number,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        media_gallery_entries: arrayOf(
            shape({
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: object
    }).isRequired
};

export default ProductFullDetail;
