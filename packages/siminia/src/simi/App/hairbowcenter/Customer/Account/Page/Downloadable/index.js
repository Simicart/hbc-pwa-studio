import React, { useState } from 'react';
import EmptyData from './../../Components/EmptyData';
import Identify from 'src/simi/Helper/Identify';
import { getDownloadableProducts } from 'src/simi/Model/Product';
import Loading from "src/simi/BaseComponents/Loading";
import DataTable from './DataTable';
require('./style.scss');

const DownloadableProduct = (props) => {
    const { history } = props;
    const [data, setData] = useState(null);

    function callbackData(data) {
        if (data && data.downloadableproducts) {
            setData(data)
        }
    }

    if (!data) {
        getDownloadableProducts(callbackData)
        return <Loading />
    }

    if (!data || data.total < 1)
        return <EmptyData message={Identify.__("You have not purchased any downloadable products yet")} />
    return <div className="table-wrapper downloadable-products">
        <DataTable data={data} />
    </div>
}

export default DownloadableProduct;
