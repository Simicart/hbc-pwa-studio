import React, { Component } from 'react';
import { string, shape, array, number } from 'prop-types';
import Identify from 'src/simi/Helper/Identify'
import classify from 'src/classify';
import GalleryItems, { emptyData } from './items';
import defaultClasses from './gallery.css';
import Loading from 'src/simi/BaseComponents/Loading'
require("./gallery.scss");

class Gallery extends Component {
    static propTypes = {
        classes: shape({
            filters: string,
            items: string,
            pagination: string,
            root: string
        }),
        data: array,
        pageSize: number
    };

    static defaultProps = {
        data: emptyData
    };

    render() {
        const { classes, data, pageSize, history, new_product } = this.props;
        const hasData = Array.isArray(data) && data.length;
        const items = hasData ? data : emptyData;
        const list_type = Identify.ApiDataStorage('product_list_mode') || 'grid';
        const listClass = list_type && list_type === 'list' ? 'list products-list' : 'grid columns4 flex-grid products-grid';

        return (
            <div className={`products wrapper ${listClass}`} >
                {!hasData && <Loading />}
                <ol className="products list items product-items">
                    <GalleryItems items={items} pageSize={pageSize} history={history} new_product={new_product} />
                </ol>
            </div>
        );
    }
}

export default classify(defaultClasses)(Gallery);
