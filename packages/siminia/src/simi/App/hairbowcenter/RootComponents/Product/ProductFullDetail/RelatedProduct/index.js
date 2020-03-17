import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import Identify from 'src/simi/Helper/Identify';
import { simiUseQuery } from 'src/simi/Network/Query' 
import getProductsBySkus from 'src/simi/queries/catalog/getProductsBySkus.graphql'
import Loading from "src/simi/BaseComponents/Loading"
import {applySimiProductListItemExtraField} from 'src/simi/Helper/Product'
import {cateUrlSuffix} from 'src/simi/Helper/Url';
import Price from 'src/simi/App/hairbowcenter/BaseComponents/Price';
import StaticRate from '../../Component/StaticRate';
import { resourceUrl } from 'src/simi/Helper/Url'
const $ = window.$
require('./relatedProduct.scss');

const ProductRelated = props => {
    const {product, setProduct} = props;
    const maxItem = 5 //max 10 items
    const matchedSkus = [];
    const productId = [];
    if(product.product_links) {
        const {product_links} = product;
        product_links.forEach((product_link) => {
            if(product_link.link_type === "related") {
                matchedSkus.push(product_link.linked_product_sku)
            }
        })
    }
    
    const [queryResult, queryApi] = simiUseQuery(getProductsBySkus);
    const {data, loading} = queryResult
    const {runQuery} = queryApi
    useEffect(() => {
        if(matchedSkus.length) {
            runQuery({
                variables: {
                    stringSku: matchedSkus,
                    currentPage: 1,
                    pageSize: maxItem,
                    simiProductSort: {
                        attribute: 'created_at',
                        direction: 'DESC'
                    }
                }
            })
        }
    }, [product.product_links])

    const handleOnChangeCheckBox = (e) => {
        const id = e.target.value;
        setProduct(id)
    }

    let clickSelect = false;

    const handleOnClick = (e) => {
        if(!clickSelect) {
            clickSelect = true
            $('#product-related-select-all span').text(Identify.__('unselect all'))
            $('.product-item-info .checkbox').prop('checked', true);
            setProduct(productId)
        } else {
            clickSelect = false
            $('#product-related-select-all span').text(Identify.__('select all'))
            $('.product-item-info .checkbox').prop('checked', false);
            setProduct([])
        }
    }

    const renderProductRelatedItem = () => {
      
        if(loading) {
            return <Loading />
        }
        if(data && data.simiproducts && data.simiproducts.items) {
            data.products = applySimiProductListItemExtraField(data.simiproducts)
            return data.products.items.map((item, index) => {
                if(item.type_id === 'simple') productId.push(item.id);
                let count = 0
                if (count < maxItem) {
                    count ++ 
                    const { small_image } = item;
                    const itemData =  {
                        ...item,
                        small_image:
                            typeof small_image === 'object' ? small_image.url : small_image
                    }
                    if (itemData)
                        return (
                            <div className="product-item-info" key={index}>
                                <Link to={itemData.url_key + cateUrlSuffix()} className="product photo product-item-photo">
                                    <img src={resourceUrl(itemData.simiExtraField.attribute_values.small_image , {type: 'image-product', width: 84})} alt={itemData.name}/>
                                </Link>
                                <div className="product details product-item-details">
                                    <strong className="product name product-item-name">
                                        <Link to={itemData.url_key + cateUrlSuffix()} className="product-item-link">{itemData.name}</Link>
                                    </strong>
                                    {itemData.simiExtraField.app_reviews && <div className="product-reviews-summary short">
                                        <StaticRate rate={itemData.simiExtraField.app_reviews.rate} size={15}/>
                                    </div>}
                                    <div className="price-box price-final_price">
                                        <Price config={1} key={Identify.randomString(5)} prices={itemData.price} type={itemData.simiExtraField.attribute_values.type_id}/>
                                    </div>
                                    {itemData.type_id === 'simple' && <div className="field choice related">
                                        <input type="checkbox" className="checkbox related" value={itemData.id} name="related_products" onChange={handleOnChangeCheckBox}/>
                                    </div>}
                                </div>
                            </div>
                        )
                    return null
                }
                return null
            });
        }
    }   
    
    return (
        <div className="block related owl-top-narrow">
            <div className="clearer"></div>
            <div className="block-title title">
                <strong id="block-related-heading">{Identify.__('Related Products')}</strong>
            </div>
            <div className="block-content content">
                <div className="block-actions">
                    {Identify.__('Check items to add to the cart or')} 
                    <button id="product-related-select-all" className="action select" type="button" onClick={handleOnClick}>
                        <span>{Identify.__('select all')}</span>
                    </button>  
                </div>
                <div className="products wrapper grid  products-grid products-related">
                    <div className="products list items product-items owl-carousel  owl-theme owl-loaded owl-drag">
                        <div className="owl-stage-outer" style={{ transform: 'translate3d(0px, 0px, 0px)', transition: 'all 0s ease 0s', width: '255px'}}> 
                            <div className="owl-item" style={{ width: '255px'}}>
                                {renderProductRelatedItem()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default ProductRelated;