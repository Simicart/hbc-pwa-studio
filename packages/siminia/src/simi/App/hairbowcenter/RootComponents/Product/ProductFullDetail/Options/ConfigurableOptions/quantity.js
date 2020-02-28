import React, { useState, useEffect } from 'react';

const ConfigurableQuantity = props =>  {
    const {selection, selectionOptions, onChangeValue, reset} = props;
    const [quantity, setQuantity] = useState(0)

    useEffect(() => {
        if(reset > 0) {
            setQuantity(0)
        }
     }, [reset])

    const handleChangeQuantity = (e, type = null) => {
        let newQuantity = 0
        if(type && type === 'minus') {
            newQuantity = parseInt(quantity, 10) - 1 >= 0 ? parseInt(quantity, 10) - 1 : 0
            setQuantity(newQuantity)
        } 

        if(type && type === 'plus') {
            newQuantity = parseInt(quantity, 10) + 1 >= 0 ? parseInt(quantity, 10) +1 : 0
            setQuantity(newQuantity)
        }


        if(!type) {
            newQuantity = e.target.value;
            if(!isNaN(newQuantity) && parseInt(newQuantity, 10) >= 0) {
                setQuantity(newQuantity)
            } else if (newQuantity === '') {
                setQuantity(newQuantity)
            } else {
                setQuantity(0)
            }
        }
        onChangeValue(newQuantity, selection, selectionOptions)
    }

    return (
        <div className="qty bss-qty bss-float-left">
            <button className="reduced items" onClick={(e) => handleChangeQuantity(e, 'minus')}>-</button>
            <input type="text" value={quantity} className="qty_att_product input-text qty validate-not-negative-number required-entry validate-digits" onChange={(e) => handleChangeQuantity(e)}/>
            <button className="increase items" onClick={(e) => handleChangeQuantity(e, 'plus')}>+</button>
        </div>
    )
}

export default ConfigurableQuantity; 