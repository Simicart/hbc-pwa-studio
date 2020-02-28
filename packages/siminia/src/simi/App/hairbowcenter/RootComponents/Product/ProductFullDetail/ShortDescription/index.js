import React from 'react';
import ReactHTMLParse from 'react-html-parser'
require('./productAttributeOverview.scss')

const ShortDescription = props => (
    <div className="product-attribute-overview">
        <div className="value">
            {props.shortDesc.html ? ReactHTMLParse(props.shortDesc.html) : null}
        </div>
    </div>
)

export default ShortDescription;