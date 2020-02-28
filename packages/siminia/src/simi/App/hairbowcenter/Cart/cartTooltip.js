import React from 'react';
import Identify from 'src/simi/Helper/Identify'

const CartTooltip = props => {
    if(props.reward) {
        return (
            <div className="reward-message">
                <div className="messages">
                    <div className="success message">
                        {Identify.__('Checkout now and earn ')} <b>{props.reward.chechout_rewards_points}</b> {Identify.__(' for this order.')}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default CartTooltip;
