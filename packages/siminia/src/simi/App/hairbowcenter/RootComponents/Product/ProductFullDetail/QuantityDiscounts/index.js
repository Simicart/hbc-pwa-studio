import React from 'react';
import ReactHTMLParse from 'react-html-parser'
require('./productdiscounts.scss');

const QuantityDiscounts = props => {
    return (
        <div className="product-data-items quantity-discount">
            {ReactHTMLParse(props.data)}
        </div>
    );
}

export default QuantityDiscounts;