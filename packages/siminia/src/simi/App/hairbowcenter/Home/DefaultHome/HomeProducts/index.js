import React from 'react';
import ProductList from './list';
require('./homeproducts.scss')
const $ = window.$;

const HomeProducts = props => {
    const {data, history} = props;

    const handleChangeTab = (index) => {
        $('.data-item.title .data-switch').removeClass('active')
        $('.data-item.content').hide();
        $('#product-list-' + index).show();
        $('#product-tabs-' + index + ' .data-switch').addClass('active')
    }

    const renderCat = () => {
        let cat = null;
        if(data.home && data.home.homeproductlists && data.home.homeproductlists.homeproductlists && data.home.homeproductlists.homeproductlists.length > 0) {
            const catData = data.home.homeproductlists.homeproductlists;
            cat = catData.map((item, index) => (
                <React.Fragment key={index}>
                    <div id={`product-tabs-${index}`} className="data-item title" key={index}>
                        <div onClick={() => handleChangeTab(index)} className={`data-switch ${index === 0 ? 'active' : ''}`}>{item.list_title}</div>
                    </div>
                    <ProductList numberList={index} dataProduct={item} active={index === 0 ? true : false} history={history}/>
                </React.Fragment>
            ))
        }
        
        return (
            <div className="data-items">
                {cat}
                <hr className="home-middle-line product-tab"/>
                <div className="clearfix"></div>
            </div>
        )
    }

    return (
        <div className="filterproducts-tab">
             {renderCat()}
        </div>
    );
}

export default HomeProducts;