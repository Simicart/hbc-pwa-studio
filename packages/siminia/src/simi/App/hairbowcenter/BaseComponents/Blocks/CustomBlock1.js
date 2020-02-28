import React from 'react';
import Identify from 'src/simi/Helper/Identify'
require("./custom1.scss");

const CustomBlock1 = (props) => {
    const { data } = props;
    if (!data || !data.length) {
        return null;
    }

    const renderData = () => {
        return data.map((item, idx) => {
            return <div key={idx}><em className={item.icon_class}></em>
                {item.title && <h3>{item.title}</h3>}
                {item.desc && <p>{item.desc}</p>}
            </div>
        });
    }

    return <div {...props} key={Identify.randomString(3)} className="custom-block-container">
        <div className="custom-block custom-block-1">
            {renderData()}
        </div>
        <hr />
    </div>
}

export default CustomBlock1;
