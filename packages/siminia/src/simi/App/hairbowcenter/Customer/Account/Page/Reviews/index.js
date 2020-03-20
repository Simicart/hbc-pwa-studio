import React, { useState } from 'react';
import EmptyData from './../../Components/EmptyData';
import Identify from 'src/simi/Helper/Identify';
import Loading from "src/simi/BaseComponents/Loading";
import { getCustomerReviews } from 'src/simi/App/hairbowcenter/Model/Customer';
import DataTable from './DataTable';
import RecentReview from './RecentReview';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
require('./style.scss')

const ProductReviews = (props) => {
    const stateLocation = props.hasOwnProperty('history') && props.history && props.history.location && props.history.location.state && props.history.location.state.hasOwnProperty('reviewData') && props.history.location.state.reviewData || null;
    const [data, setData] = useState(stateLocation);
    smoothScrollToView($('#root'));
    function callbackReviews(data) {
        setData(data);
    }

    if (!data) {
        getCustomerReviews(callbackReviews)
        return <Loading />;
    }

    if (data && data.errors) {
        return <EmptyData message={data.errors[0].message} />
    }

    if (!data || data.total < 1) {
        if (props.recent) {
            return null;
        } else {
            return <EmptyData message={Identify.__("You have submitted no reviews.")} />
        }
    }

    if (props.recent) {
        return <RecentReview recentData={data} />
    }

    return <div className="table-wrapper reviews">
        <DataTable data={data} />
    </div>
}

export default ProductReviews;
