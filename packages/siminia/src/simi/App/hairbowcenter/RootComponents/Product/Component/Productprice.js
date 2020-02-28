import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import Price from 'src/simi/App/hairbowcenter/BaseComponents/Price';
import ObjectHelper from 'src/simi/Helper/ObjectHelper';
import PropTypes from 'prop-types';

require('./productprice.scss');

const initState = {
    customOptionPrice: {exclT:0, inclT:0},
    downloadableOptionPrice: {exclT:0, inclT:0},
}

class ProductPrice extends React.Component {

    constructor(props){
        super(props);
        const {configurableOptionSelection} = props
        this.state = {...initState, ...{sltdConfigOption: ObjectHelper.mapToObject(configurableOptionSelection)}};
    }
    
    setCustomOptionPrice(exclT, inclT) {
        this.setState({
            customOptionPrice: {exclT, inclT}
        })
    }
    setDownloadableOptionPrice(exclT, inclT) {
        this.setState({
            downloadableOptionPrice: {exclT, inclT}
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const {configurableOptionSelection} = nextProps
        const {sltdConfigOption} = prevState
        const newSltdConfigOption = ObjectHelper.mapToObject(configurableOptionSelection)
        if (!ObjectHelper.shallowEqual(sltdConfigOption, newSltdConfigOption))
            return {...initState, ...{sltdConfigOption: newSltdConfigOption}}
        return {}
    }

    calcConfigurablePrice = (price) => {
        const {sltdConfigOption} = this.state
        const {data, configurableOptionSelection, optionShow} = this.props
        const {simiExtraField} = data
        if(!optionShow) {
            if(price.minimalPrice.amount.value !== price.regularPrice.amount.value) {
                price.has_special_price = true
            }
            price.minimalPrice.excl_tax_amount.value = 0
            price.minimalPrice.amount.value = 0
            price.regularPrice.excl_tax_amount.value = 0
            price.regularPrice.amount.value = 0
            price.maximalPrice.excl_tax_amount.value = 0
            price.maximalPrice.amount.value = 0
        } else if (configurableOptionSelection && simiExtraField && simiExtraField.app_options) {
            const {configurable_options} = simiExtraField.app_options
            if (configurable_options && configurable_options.index && configurable_options.optionPrices) {
                let sub_product_id = null
                for (const index_id in configurable_options.index) {
                    const index = configurable_options.index[index_id] 
                    if (ObjectHelper.shallowEqual(index, sltdConfigOption)) {
                        sub_product_id = index_id;
                        break;
                    }
                }
                if (sub_product_id) {
                    let sub_product_price = configurable_options.optionPrices[sub_product_id]
                    if (!sub_product_price)
                        sub_product_price = configurable_options.optionPrices[parseInt(sub_product_id, 10)]
                    if (sub_product_price) {
                        price.minimalPrice.excl_tax_amount.value = sub_product_price.basePrice.amount
                        price.minimalPrice.amount.value = sub_product_price.finalPrice.amount
                        price.regularPrice.excl_tax_amount.value = sub_product_price.basePrice.amount
                        price.regularPrice.amount.value = sub_product_price.finalPrice.amount
                        price.maximalPrice.excl_tax_amount.value = sub_product_price.basePrice.amount
                        price.maximalPrice.amount.value = sub_product_price.finalPrice.amount
                    }
                }
            }
        }
    }

    addOptionPrice(calculatedPrices, optionPrice) {
        calculatedPrices.minimalPrice.excl_tax_amount.value += optionPrice.exclT;
        calculatedPrices.minimalPrice.amount.value += optionPrice.inclT;
        calculatedPrices.regularPrice.excl_tax_amount.value += optionPrice.exclT;
        calculatedPrices.regularPrice.amount.value += optionPrice.inclT;
        calculatedPrices.maximalPrice.excl_tax_amount.value += optionPrice.exclT;
        calculatedPrices.maximalPrice.amount.value += optionPrice.inclT;
    }

    calcPrices(price) {
        const {customOptionPrice, downloadableOptionPrice} = this.state
        const calculatedPrices = JSON.parse(JSON.stringify(price))
        const {data} = this.props
        if (data.type_id === 'configurable')
            this.calcConfigurablePrice(calculatedPrices)
        
        // custom option
        this.addOptionPrice(calculatedPrices, customOptionPrice)

        // downloadable option
        if (data.type_id === 'downloadable')
            this.addOptionPrice(calculatedPrices, downloadableOptionPrice)
        
        return calculatedPrices
    }

    render(){
        const {data, optionShow} = this.props
        const {simiExtraField} = data
        const prices = this.calcPrices(data.price)

        let stockLabel = ''
        if (simiExtraField) {
            if (simiExtraField.attribute_values.product_is_stock)
                stockLabel = Identify.__('In stock');
            else 
                stockLabel = Identify.__('Out of stock');
        }


        const priceLabel = (
            <div className='prices-layout'>
                {
                    (data.type_id !== "grouped") &&
                    <Price config={1} key={Identify.randomString(5)} prices={prices} type={data.type_id} showLabel={true}/>
                }
            </div>
        );
    
        return (
            <div className='product-info-price' id={data.type_id}>
                {priceLabel}
                {!optionShow && <div className='product-info-stock-sku'>
                    <div className='stock available'>
                        <span>Availability:</span>
                        <span>{stockLabel}</span>
                    </div>
                    {
                        data.sku && 
                        <div className={`product attribute sku`} id="product-sku">
                            <strong className="type">
                                {Identify.__('SKU')}
                            </strong>
                            <span className='value'>{data.sku}</span>
                        </div>
                    }
                </div>}
            </div>

        );
    }
}

ProductPrice.propTypes = {
    data: PropTypes.object.isRequired,
    configurableOptionSelection: PropTypes.instanceOf(Map),
    optionShow: PropTypes.bool
}
ProductPrice.defaultProps = {
    configurableOptionSelection: new Map(),
}

export default ProductPrice;