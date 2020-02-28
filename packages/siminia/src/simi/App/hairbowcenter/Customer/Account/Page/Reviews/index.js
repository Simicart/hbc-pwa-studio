import React, { useState } from 'react';
import EmptyData from './../../Components/EmptyData';
import Identify from 'src/simi/Helper/Identify';
import Loading from "src/simi/BaseComponents/Loading";
import { getCustomerReviews } from 'src/simi/App/hairbowcenter/Model/Customer';
import DataTable from './DataTable';
require('./style.scss')

const ProductReviews = (props) => {
    const [data, setData] = useState(null);

    function callbackReviews(data) {
        setData(data);
    }

    if (!data) {
        getCustomerReviews(callbackReviews)
        return <Loading />;
    }


    if (!data || data.total < 1)
        return <EmptyData message={Identify.__("You have submitted no reviews.")} />

    return <div className="table-wrapper reviews">
        <DataTable data={data} />
    </div>
}

export default ProductReviews;
