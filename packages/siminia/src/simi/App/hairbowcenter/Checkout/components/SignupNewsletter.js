import React, { useState } from 'react';
import Identify from 'src/simi/Helper/Identify';

const SignupNewsletter = (props) => {
    const localSignup = Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'ck_signup_newsletter') || false;
    const [checked, setChecked] = useState(localSignup);

    const handleCheckNewsletter = () => {
        setChecked(!checked);
        Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'ck_signup_newsletter', !checked)
    }

    return <div className="field-option-newsletter">
        <input type="checkbox" name="signup_newsletter" id="hairbow-signup_newsletter" onClick={handleCheckNewsletter} defaultChecked={checked} />
        <label htmlFor="hairbow-signup_newsletter">{Identify.__("Yes, please notify me of Sales, Coupons and New Products!")}</label>
    </div>
}

export default SignupNewsletter;
