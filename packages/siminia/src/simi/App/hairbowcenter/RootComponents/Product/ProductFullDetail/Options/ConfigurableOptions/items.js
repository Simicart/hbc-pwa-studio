import React, {useEffect} from 'react';
import Quantity from './quantity';
import {formatLabelPrice} from 'src/simi/Helper/Pricing';
import Identify from 'src/simi/Helper/Identify';
import { resourceUrl } from 'src/simi/Helper/Url'
import { transparentPlaceholder } from 'src/shared/images';
const $ = window.$;

const ItemOption = props => {
    const {simiAppOptions, product, reset} = props
    const stateProducts = [];

    const renderPrice = (newPrice) => {
        let price_label = '<div></div>';
        let special_price_label = '<div></div>';
        let price_excluding_tax = '<div></div>';
        let price_including_tax = '<div></div>';
        let price = '<div></div>';
        const selector = $('.product-content #configurable .product-prices');
        const stikySelector = $('#sticky-product .price-final_price .product-prices');
        if (newPrice.has_special_price) {
            if (newPrice.show_ex_in_price !== null && newPrice.show_ex_in_price === 1) {
                // special_price_label = (<div>{newPrice.special_price_label}</div>);
                special_price_label = `<div>${newPrice.special_price_label}</div>`
                price_excluding_tax = `${Identify.__('Excl. Tax')}: <div><span class='price'>${formatLabelPrice(newPrice.minimalPrice.amount.value)}</span></div>`
                //     <div>{Identify.__('Excl. Tax')}: {this.formatPrice(newPrice.minimalPrice.excl_tax_amount.value, newPrice.minimalPrice.amount.currency)}</div>
                // );
                price_including_tax = `${Identify.__('Incl. Tax')}: <div><span class='price'>${formatLabelPrice(newPrice.minimalPrice.amount.value)}</span></div>`
                //     <div>{Identify.__('Incl. Tax')}: {this.formatPrice(newPrice.minimalPrice.amount.value, newPrice.minimalPrice.amount.currency)}</div>
                // );
            } else {
                // price = (<div >{this.formatPrice(newPrice.minimalPrice.amount.value, newPrice.minimalPrice.amount.currency)}</div>);
                price = `<div class="final-price"><span class='price'><span>${formatLabelPrice(newPrice.minimalPrice.amount.value)}</span></span></div>`
            }
            
            price_label = `<div class="old-price"><span class="label">was</span><span class="old-price-label">${formatLabelPrice(newPrice.regularPrice.amount.value)}</span></div>`
            // price_label = (
            //     <div>{Identify.__('Regular Price')}: {this.formatPrice(newPrice.regularPrice.amount.value, false)} <span
            //         className={classes["sale_off"]}>-{this.prices.discount_percent}%</span></div>
            // );
        } else {
            if (newPrice.show_ex_in_price !== null && newPrice.show_ex_in_price === 1) {
                price_excluding_tax = `${Identify.__('Excl. Tax')}: <div><span class='price'>${formatLabelPrice(newPrice.minimalPrice.excl_tax_amount.value)}</span></div>`
                //     <div>{Identify.__('Excl. Tax')}: {this.formatPrice(this.prices.minimalPrice.excl_tax_amount.value, this.prices.minimalPrice.amount.currency)}</div>
                // );
                price_including_tax = `${Identify.__('Incl. Tax')}: <div><span class='price'>${formatLabelPrice(newPrice.minimalPrice.amount.value)}</span></div>`
                    // <div>{Identify.__('Incl. Tax')}: {this.formatPrice(this.prices.minimalPrice.amount.value, this.prices.minimalPrice.amount.currency)}</div>
                    
                
            } else {
                price = `<div><span class='price'><span>${formatLabelPrice(newPrice.minimalPrice.amount.value)}</span></span></div>`;
            }
        }
        
        const appendHtml = `${price_label}${price}${special_price_label}${price_excluding_tax}${price_including_tax}`;
        
        selector.html(appendHtml)
        stikySelector.html(appendHtml)
    }

    const setPrice = () => {
        const currentPrice = product.price;
        const { configurable_options } = simiAppOptions;
        if(currentPrice.minimalPrice.amount.value !== currentPrice.regularPrice.amount.value) {
            currentPrice.has_special_price = true
        }
        currentPrice.minimalPrice.excl_tax_amount.value = 0
        currentPrice.minimalPrice.amount.value = 0
        currentPrice.regularPrice.excl_tax_amount.value = 0
        currentPrice.regularPrice.amount.value = 0
        currentPrice.maximalPrice.excl_tax_amount.value = 0
        currentPrice.maximalPrice.amount.value = 0
        if (configurable_options && configurable_options.index && configurable_options.optionPrices) {
            stateProducts.forEach(stateProduct => {
                if (stateProduct.selection) {
                    let sub_product_price = configurable_options.optionPrices[stateProduct.selection]
                    if (!sub_product_price)
                        sub_product_price = configurable_options.optionPrices[parseInt(stateProduct.selection, 10)]
                    if (sub_product_price) {
                        currentPrice.minimalPrice.excl_tax_amount.value = currentPrice.minimalPrice.excl_tax_amount.value + (sub_product_price.basePrice.amount*stateProduct.quantity)
                        currentPrice.minimalPrice.amount.value = currentPrice.minimalPrice.amount.value + (sub_product_price.finalPrice.amount*stateProduct.quantity)
                        currentPrice.regularPrice.excl_tax_amount.value = currentPrice.regularPrice.excl_tax_amount.value + (sub_product_price.oldPrice.amount*stateProduct.quantity)
                        currentPrice.regularPrice.amount.value = currentPrice.regularPrice.amount.value + (sub_product_price.oldPrice.amount*stateProduct.quantity)
                        currentPrice.maximalPrice.excl_tax_amount.value = currentPrice.maximalPrice.excl_tax_amount.value + (sub_product_price.basePrice.amount*stateProduct.quantity)
                        currentPrice.maximalPrice.amount.value = currentPrice.maximalPrice.amount.value + (sub_product_price.finalPrice.amount*stateProduct.quantity)
                    }
                }
            })

        }
        renderPrice(currentPrice)
    }

    const handleOnChangeOption = (quantity, selection, selectionOptions) => {
        if(quantity !== '') {
            if(quantity === 0) {
                stateProducts.forEach((item, index) => {
                    if(item.selection === selection) {
                        stateProducts.splice(index, 1)
                    }
                })
            } else {
                const checkExitId = stateProducts.find(item => item.selection === selection)
                if(!checkExitId) {
                    stateProducts.push({selection, quantity, selectionOptions});
                } else {
                    stateProducts.forEach((item) => {
                        if(item.selection === selection) {
                            item.quantity = quantity
                        }
                    })
                }
             
            }
            setPrice()
        } 
        props.onSelectionChange(stateProducts);
    }

    
    const getOptionSelect = (mainAttribute, option, subAttribute = null, subOption = null) => {
        const map = new Map();
        const mainAttributeId = mainAttribute.id;
        const optionId = option.id
        map.set(mainAttributeId, optionId);
        if(subAttribute && subOption) {
            const subAttributeId = subAttribute.id;
            const subOptionId = subOption.id 
            map.set(subAttributeId, subOptionId);
        }
        return map;
    }

    const checkOutStock = (productId) => {
        const {variants} = product;
        const productChecking = variants.find(item => item.product.id === parseInt(productId, 10))
        if(productChecking && productChecking.product && productChecking.product.stock_status === "IN_STOCK") {
            return true
        }

        return false
    }

    useEffect(() => {
        if(reset > 0) {
            setPrice()
        }
    }, [reset])

    const renderOutStock = () => {
        return (
            <div className="qty bss-qty bss-float-left">
                <span className="grid-outof-stock-tb">{Identify.__('Out of stock')}</span>
            </div>
        )
    }

    const renderConfigruablePrice = (productId) => {
        const {optionPrices} = simiAppOptions.configurable_options
        const prices = optionPrices[productId];
        if(prices.oldPrice.amount !== prices.finalPrice.amount) {
            return (
                <span className="price">
                    <span className="base-price has-discount">{formatLabelPrice(prices.oldPrice.amount)}</span>
                    <br/>
                    <span className="sale-price">{formatLabelPrice(prices.finalPrice.amount)}</span>
                </span>
            )
        }
        return (
            <span className="price">
                <span className="base-price">{formatLabelPrice(prices.finalPrice.amount)}</span>
            </span>
        )
    }

    const getOptionImage = (id) => {
        const {variants} = product;
        const productChecking = variants.find(item => item.product.id === parseInt(id, 10))
        if(productChecking && productChecking.product && productChecking.product.media_gallery_entries.length > 0) {
            const item = productChecking.product.media_gallery_entries[0]
            return resourceUrl(item.file, { type: 'image-product', width: 640 })
        } else {
            return transparentPlaceholder
        }
    }

    const renderOption = (selectionOptions, productId, index, option = null) => {
        const isInStock = checkOutStock(productId);
        return (
            <div className="item-size" key={index}>
                <div className="item-info-attr">
                    <div className="group-left grs">
                        {option && option.label && <span className="attr-label">
                            {option.label}
                        </span>}
                        {/* <ProductPrice data={product} configurableOptionSelection={selectionOptions} optionShow/> */}
                        {renderConfigruablePrice(productId)}
                    </div>
                    <div className="group-right grs">
                        {isInStock ? <Quantity reset={reset} onChangeValue={handleOnChangeOption} selection={productId} selectionOptions={selectionOptions}/> : renderOutStock()}
                    </div>
                </div>
            </div>
        )
    }

    const renderOptions = () => {
        const attributes = simiAppOptions.configurable_options.attributes
        let mainAttribute = null;
        const subAttributes = [];
        for(const i in attributes) {
            const attribute = attributes[i];
            if(parseInt(attribute.position, 10) === 0) {
                mainAttribute = attribute;
            } else {
                subAttributes.push(attribute);
            }
        }

        if(mainAttribute && mainAttribute.options) {
            return mainAttribute.options.map((option, index) => {
                const firstProductId = option.products.length > 0 ? option.products[0] : null
                let subOptionElement = null;
                if(subAttributes.length > 0) {
                    subOptionElement = option.products.map((productId) => {
                        
                        return subAttributes.map((subAttribute) => {      
                            return subAttribute.options.map((subOption, subIndex) => {
                                const compareProducts = subOption.products.find(value => value === productId)
                                if(compareProducts) {
                                    const optionSelections = getOptionSelect(mainAttribute, option, subAttribute, subOption)
                                    return (
                                        renderOption(optionSelections, productId, subIndex, subOption)
                                    )
                                } 
                                return null
                            })
                        })  
                    })
                } else {
                    const productId = option.products[0];
                    const optionSelections = getOptionSelect(mainAttribute, option)
                    subOptionElement = renderOption(optionSelections,productId, index)
                }
  
                if(firstProductId) {
                    const optionImage = getOptionImage(firstProductId)
                    return (
                        <li className="item-info" key={index}>
                            <div className="bss-first-attr bss-swatch a0">
                                <span className="attr-label">{option.label}</span>
                                <div className="swatch-attribute color">
                                    <div className="swatch-attribute-options clearfix">
                                        <div className="swatch-option image">
                                            <img src={optionImage} alt={option.label}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {subOptionElement}
                        </li>
                    )
                }

            })  
        }
        return null
    }


    return (
        
        renderOptions()
        
    );
    
}

export default ItemOption;