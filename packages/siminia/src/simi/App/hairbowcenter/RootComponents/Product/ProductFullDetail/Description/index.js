import React from 'react'
import Identify from 'src/simi/Helper/Identify';
import ReactHTMLParse from 'react-html-parser';
import RichText from 'src/simi/BaseComponents/RichText';

require('./description.scss')

const Description = props => {
    const {product} = props
    console.log(product);
    return (
        <React.Fragment>
            <div className="data-item-title">
                <div className="new-tab-listing-detail-page">
                    Details
                </div>
            </div>
            <div className="data-item-content" id="description">
                <div className="product-attribute-description">
                    <div className="value">
                        <RichText content={product.description && product.description.html ? product.description.html : '' } />
                    </div>
                </div>
            </div>
        </React.Fragment>
            
    )
}

export default Description