import React from 'react';
require('./quantity.scss')

const Quantity = props => {
    const {initialValue, onValueChange } = props;
    const changedValue = (type) => {
        const qtyField = $('#product-detail-qty')
        let qty = parseInt(qtyField.val())
        if(type === 'plus') {
            qty = qty + 1;
        } else if (type === 'minus' && qty - 1 > 0) {
            qty = qty - 1;
        }
        onValueChange(qty)
        $('#product-detail-qty').val(qty)
    }
    return (
        <div className="product-quantity">
            <div className="control">
                <input defaultValue={initialValue} id="product-detail-qty" min={1} className="input-text qty" type="number" onChange={changedValue}/>
                <div className="qty-changer">
                    <div className="qty-inc" onClick={() => changedValue('plus')}>
                        <i className="porto-icon-up-dir"></i>
                    </div>
                    <div className="qty-dec" onClick={() => changedValue('minus')}>
                        <i className="porto-icon-down-dir"></i>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Quantity;
