import React from 'react';
require('./emptyData.scss');

const EmptyData = (props) => {
    const { message } = props;
    return <div className="message info empty"><span>{message}</span></div>
}

export default EmptyData;
