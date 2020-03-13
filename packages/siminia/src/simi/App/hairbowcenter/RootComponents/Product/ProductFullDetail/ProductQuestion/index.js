import React, { useState } from 'react';
import ListQuestion from './ListQuestion';
import FormQuestion from './form';
import Identify from 'src/simi/Helper/Identify';
require ('./productQuestion.scss')

const ProductQuestion = props => {
    const [open, setOpen] = useState(false)
    return (
        <div className="product-item-content question">
            {!open && <div className="action askit-show-form" onClick={() => setOpen(true)}>
                {Identify.__('Ask Your Question')}
            </div>}
            {open && <FormQuestion {...props} setOpen={setOpen}/>}
            <ListQuestion productId={props.productId}/>
            

        </div>
    );
    
}

export default ProductQuestion;