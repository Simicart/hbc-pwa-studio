import React from 'react';
require('./customBlock.scss');

const CustomBlock = props => {
    return (
        <div className="custom-block custom-block-1">
            <div>
                <em className="porto-icon-truck"></em>
                <h3>$3.99 SHIPPING</h3>
                <p>on USA domestic orders over $50.</p>
            </div>
            <div>
                <em className="porto-icon-dollar"></em>
                <h3>$3.99 SHIPPING</h3>
                <p>on USA domestic orders over $50.</p>
            </div>
            <div>
                <em className="porto-icon-lifebuoy"></em>
                <h3>$3.99 SHIPPING</h3>
                <p>on USA domestic orders over $50.</p>
            </div>
        </div>
    );
}

export default CustomBlock;