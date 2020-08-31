import React, {useEffect} from 'react';
import Identify from 'src/simi/Helper/Identify';
import { resourceUrl } from 'src/simi/Helper/Url';
import { transparentPlaceholder } from 'src/shared/images';
import ProductPrice from '../../Component/Productprice';
import Image from 'src/simi/BaseComponents/Image'
const $ = window.$;
require('./stickyProduct.scss')

const StickyProduct = props => {
    const {product, addToCart} = props;
    const handleScroll = () => {
        let position = document.documentElement.scrollTop;
        if(!position) {
            position = document.body;
        }
        const optionOptions = document.getElementById('prdetail')
        if(optionOptions && optionOptions.offsetTop <= position) {
            $('.sticky-product').show()
        } else {
            $('.sticky-product').hide()
        }
    }

    useEffect(() => {
        handleScroll()
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    let image = null;
    if(product.media_gallery_entries && product.media_gallery_entries.length > 0) {
        const firstImage = product.media_gallery_entries[0];
        image = firstImage.file
            ? resourceUrl(firstImage.file, { type: 'image-product', width: 640 })
            : transparentPlaceholder
    }

    const renderCartButton = () => {
        let text = Identify.__('Add to Cart')
        let display = true;
        let disable = false;
        if(typeof product.simiExtraField.attribute_values.product_is_stock === 'undefined') {
            disable = true
            text = Identify.__('Loading ...');
        } else if(!product.simiExtraField.attribute_values.product_is_stock) {
            display = true
        }
        
        if(display) {
            return (
                <div className="actions">
                    <button disable={disable.toString()} className={`action primary tocart ${disable ? 'disable' : ''}`} id="product-addtocart-button-clone" onClick={addToCart}>
                        <span>{text}</span>
                    </button>
                </div>
            )
        }

        return null;
    }

    return (
        <div className="sticky-product" id="sticky-product">
            <div className="container">
                <div className="sticky-image">
                    <Image src={image} alt={product.name} className="product-image-photo default_image" style={{width: '100px'}}/>
                </div>
                <div className="sticky-detail">
                    <div className="product-name-area">
                        <h2 className="product-name">{product.name}</h2>
                        <div className="product-info-price">
                            <div className="price-box price-final_price">
                                <ProductPrice data={product}/>
                            </div>
                        </div>
                    </div>
                </div>
                {renderCartButton()}
            </div>
        </div>
    );

}

export default StickyProduct;