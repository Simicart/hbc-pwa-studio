import React, { useState } from 'react';
import ResetImage from './images/ico_reset.png';
import ItemOption from './items';
require('./productOptionGrid.scss');

const ConfigurableOptions = props => {
    const [reset, setReset] = useState(0);

    const handleResetOption = () => {
        setReset(reset + 1);
        props.onSelectionChange([]);
    }

    return (
        <div className="product-options-wrapper" id="product-options-wrapper">
            <div className="fieldset">
                <div className="cart table-wrapper">
                    <p><i>*Enter your desired quantities in the grid and "Add to cart" when finished</i></p>
                    <ul className="bss-items">
                        <ItemOption {...props} reset={reset}/>
                    </ul>
                </div>
                <img src={ResetImage} alt="reset" className="v-middle reset-configurablegridview" onClick={handleResetOption}/>
            </div>
        </div>
    );
    
}

export default ConfigurableOptions;