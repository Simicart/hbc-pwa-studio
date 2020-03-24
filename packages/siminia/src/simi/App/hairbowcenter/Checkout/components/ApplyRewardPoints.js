import React from 'react';
import Identify from 'src/simi/Helper/Identify';

const ApplyRewardPoints = (props) => {

    const { simiUserBalance } = props;

    return <div className="rewards-block">
        <div className="current-balance-points">{Identify.__("You have ")}<b>{simiUserBalance.balance_points}{Identify.__(" Reward Points")}</b>{Identify.__(" available.")}</div>
        <input type="number" name="points_amount" />
        <label htmlFor="rw-points_all">
            <input type="checkbox" name="points_all" id="rw-points_all" min={0} />
            <span>{Identify.__(" Use maximum ")}<b>100</b></span>
        </label>
        <div className="actions-toolbar">
            <button>{Identify.__("Apply Points")}</button>
            <button>{Identify.__("Cancel Points")}</button>
        </div>
    </div>
}

export default ApplyRewardPoints;
