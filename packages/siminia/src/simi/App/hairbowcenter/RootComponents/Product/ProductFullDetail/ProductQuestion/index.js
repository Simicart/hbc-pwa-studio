import React from 'react';
import ListQuestion from './ListQuestion';
import FormQuestion from './form';
require ('./productQuestion.scss')

const ProductQuestion = props => {
    return (
        <div className="product-item-content question">
            <ListQuestion productId={props.productId}/>
            <FormQuestion {...props}/>
        </div>
    );
    
}

export default ProductQuestion;