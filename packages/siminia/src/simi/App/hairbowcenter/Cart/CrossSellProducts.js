import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom'
import { StaticRate } from 'src/simi/BaseComponents/Rate';
import {getCrossSellProducts} from '../Model/Product';
import {formatLabelPrice} from 'src/simi/Helper/Pricing';
import Loading from 'src/simi/BaseComponents/Loading'
import { addToCart as simiAddToCart } from 'src/simi/Model/Cart';
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading';
require('./crossSellProducts.scss');

const CrossSellProducts = props =>  {
    const {cartId, handleLink, toggleMessages, updateItemInCart} = props;
    const [data, setData] = useState(null);

    const callBackCrossSellProducts = (data) => {
        if(data.cross_sell_products) {
            setData(data.cross_sell_products)
        }
    }   
    const showError = (data) => {
        if (data.errors.length) {
            const errors = data.errors.map(error => {
                return {
                    type: 'error',
                    message: error.message,
                    auto_dismiss: true
                }
            });
            toggleMessages(errors)
        }
    }
    const showSuccess = (data) => {
        if (data.message) {
            toggleMessages([{
                type: 'success',
                message: Array.isArray(data.message)?data.message[0]:data.message,
                auto_dismiss: true
            }])
        }
    }
    const handleAddToCart = (data) => {
        if (data.errors) {
            hideFogLoading()
            showError(data)
        } else {
            showSuccess(data)
            updateItemInCart()
        }
    }
    const addToCart = (item) => {
        if(item.type_id !== 'configurable') {
            showFogLoading()
            const params = {
                product: item.entity_id,
                quantity: 1
            }
            simiAddToCart(handleAddToCart, params);
        } else {
            handleLink("/" + item.request_path);
        }
    } 
  
    useEffect(() => {
        getCrossSellProducts(callBackCrossSellProducts, cartId);
    }, [])

    const renderCrossSellItems = props => {
        return data.map((item, index) => {
            const start = item.rating_summary ? (item.rating_summary*5)/100 : 0;

            return (
                <div className="item product product-item" key={index}>
                    <div className="product-item-info ">
                        <Link to={"/" + item.request_path} className="product photo product-item-photo">
                            <img src={item.thumbnail} alt="No-Slip Grips"/>
                        </Link>
                        <div className="product details product-item-details">
                            <strong className="product name product-item-name">
                                <Link to={"/" + item.request_path} className="product-item-link">{item.name}</Link>
                            </strong>
                        </div>
                        <div className="product-reviews-summary short">
                            <hr/>
                            <div className="rate-container">
                                <StaticRate size={15} rate={start} />
                            </div>
                        </div>
                        <div className="price-box price-final_price"> 
                            <span className="price-container price-final_price">
                                <span className="price">{formatLabelPrice(item.minimal_price)}</span>
                            </span>
                        </div>
                        
                        <div className="product actions product-item-actions">
                            <div className="actions-primary">
                                <button className="action-tocart-primary" onClick={() => addToCart(item)}>
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    
    }
    
    if(!data) return <Loading />

    if(data instanceof Array && data.length > 0) {
        return (
            <div className="block-crosssell">
                <div className="clearer"></div>
                <div className="block-title title">
                    <strong>More Choices: </strong>
                </div>
                <div className="block-content content">
                    <div className="products wrapper grid columns4 products-grid products-crosssell">
                        <div className="products list items product-items">
                            {renderCrossSellItems()}
                        </div>
                    </div>
                </div>            
            </div>
        );
    }

    return null
}

export default CrossSellProducts;