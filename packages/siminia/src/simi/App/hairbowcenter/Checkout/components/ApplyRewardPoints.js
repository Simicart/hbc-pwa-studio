import React, { useEffect, useState } from 'react';
import Identify from 'src/simi/Helper/Identify';
import { updateRewards, applyRewardsPoint } from 'src/simi/App/hairbowcenter/Model/Cart';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';

const $ = window.$;
const ApplyRewardPoints = (props) => {
    const { simiUserBalance, availableShippingMethods, shippingMethod, getCartDetails } = props;
    const [checked, setChecked] = useState(false);
    const [data, setData] = useState(null);

    function processUpdateRewards(pData) {
        setData(pData);
    }

    useEffect(() => {
        const params = {};
        if (availableShippingMethods && availableShippingMethods.length && shippingMethod) {
            const founded = availableShippingMethods.find(it => it.carrier_code === shippingMethod);
            if (founded) {
                params['shipping_method'] = founded.method_code;
                params['shipping_carrier'] = founded.carrier_code;
            }
        }
        updateRewards(processUpdateRewards, params);
    }, []);

    if (!data || (data && data.chechout_rewards_is_show !== true)) return null;

    const handleCheckMax = (max) => {
        setChecked(!checked);
        if (max) {
            if (!checked === true) {
                $('.rewards-block').find('input[name="points_amount"]').val(max);
            } else {
                if (Number(data.chechout_rewards_points_used)) {
                    $('.rewards-block').find('input[name="points_amount"]').val(data.chechout_rewards_points_used);
                } else {
                    $('.rewards-block').find('input[name="points_amount"]').val('');
                }
            }
        }
    }

    const handleApplyPoint = (cancel = false) => {
        const jqContainer = $('.rewards-block');
        const point = jqContainer.find('input[name="points_amount"]').val();
        if (!point) return;
        const payload = {}
        payload['remove-points'] = cancel ? 1 : 0
        if (!isNaN(point) && parseInt(point, 10) <= data.chechout_rewards_points_max) {
            payload.points_amount = Number(point);
        } else {
            payload.points_amount = Number(data.chechout_rewards_points_max);
            payload['points_all'] = 'on';
            jqContainer.find('input[name="points_all"]').prop('checked', true)
            jqContainer.find('input[name="points_amount"]').val(data.chechout_rewards_points_max);
        }
        if (!payload.points_all) {
            if (jqContainer.find('input[name="points_all"]').is(':checked')) {
                payload['points_all'] = 'on'
            }
        }

        if (availableShippingMethods && availableShippingMethods.length && shippingMethod) {
            const founded = availableShippingMethods.find(it => it.carrier_code === shippingMethod);
            if (founded) {
                payload['shipping_method'] = founded.method_code;
                payload['shipping_carrier'] = founded.carrier_code;
            }
        }

        showFogLoading();
        applyRewardsPoint(callBackApplyRewardsPoint, payload);
    }

    function callBackApplyRewardsPoint(rData) {
        const jqContainer = $('.rewards-block');
        if (rData.success && rData.message) {
            $('.rewards-message-block > div').html(
                `<div class="message message-success success">${rData.message}</div>`
            )
            $('.rewards-message-block > div').slideDown();
            jqContainer.find('input[name="points_amount"]').val(rData.spend_points);
            setTimeout(() => {
                $('.rewards-message-block > div').slideUp();
            }, 5000);
            getCartDetails();
        } else {
            $('.rewards-message-block > div').html(
                `<div class="message message-error error">{${Identify.__("Something went wrong in process!")}}</div>`
            )
            $('.rewards-message-block > div').slideDown();
            setTimeout(() => {
                $('.rewards-message-block > div').slideUp();
            }, 5000);
        }
        hideFogLoading();
    }

    const blurInputPointNumber = (e) => {
        if (data.chechout_rewards_points_max && e.target.value > data.chechout_rewards_points_max) {
            $(e.target).val(data.chechout_rewards_points_max);
        }
    }

    return <div className="rewards-block">
        <div className="current-balance-points">{Identify.__("You have ")}<b>{simiUserBalance.balance_points}{Identify.__(" Reward Points")}</b>{Identify.__(" available.")}</div>
        <div className="rewards-message-block">
            <div className="messages" />
        </div>
        <input type="number" name="points_amount" min={0} max={data.chechout_rewards_points_max} defaultValue={data.chechout_rewards_points_used && Number(data.chechout_rewards_points_used) > 0 ? data.chechout_rewards_points_used : ''} onChange={blurInputPointNumber} />
        <label htmlFor="rw-points_all">
            <input type="checkbox" name="points_all" id="rw-points_all" defaultChecked={checked} placeholder={Identify.__("Enter amount of points to spend")} onClick={() => handleCheckMax(data.chechout_rewards_points_max)} />
            {data.chechout_rewards_points_max && <span>{Identify.__(" Use maximum ")}<b>{data.chechout_rewards_points_max}</b></span>}
        </label>
        <div className="actions-toolbar">
            <button onClick={() => handleApplyPoint(false)}>{Identify.__("Apply Points")}</button>
            <button onClick={() => handleApplyPoint(true)}>{Identify.__("Cancel Points")}</button>
        </div>
    </div>
}

export default ApplyRewardPoints;
