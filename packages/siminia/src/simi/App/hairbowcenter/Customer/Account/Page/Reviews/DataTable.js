import React, { useState } from 'react';
import PaginationTable from './../../Components/Orders/PaginationTable';
import Identify from 'src/simi/Helper/Identify';
import { Link } from 'src/drivers';
import { StaticRate } from 'src/simi/App/hairbowcenter/BaseComponents/Rate'
import { productUrlSuffix } from 'src/simi/Helper/Url';

const DataTable = (props) => {

    const { data } = props;
    const [limit, setLimit] = useState(10);
    const currentPage = 1;

    const cols = [
        { title: Identify.__("Created") },
        { title: Identify.__("Product Name") },
        { title: Identify.__("Rating") },
        { title: Identify.__("Review") },
        { title: Identify.__("") },
    ];


    const renderItem = (item, index) => {
        let dateP = item.review_created_at;
        const dateF = dateP.split(/[- :]/);
        let date = new Date(dateF[0], dateF[1], dateF[2], dateF[3], dateF[4], dateF[5]);
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        date = date.getDate() + "/" + m + "/" + date.getFullYear();

        const detailLocation = {
            pathname: `/review-detail.html/${item.entity_id}`,
            state: {
                reviewData: item
            }
        }

        const productLocation = `/${item.product_url}${productUrlSuffix()}`;

        return (
            <tr key={index}>
                <td data-title={Identify.__("Created")}>
                    {date}
                </td>
                <td data-title={Identify.__("Product Name")}>
                    <Link to={productLocation}>{Identify.__(item.name)}</Link>
                </td>
                <td data-title={Identify.__("Rating")}>
                    <StaticRate rate={item.rate_points} classes={{}} />
                </td>
                <td data-title={Identify.__("Review")}>
                    {item.detail}
                </td>
                <td data-title={Identify.__("")}>
                    <Link to={detailLocation}>{Identify.__("See Details")}</Link>
                </td>
            </tr>
        )
    }

    return <PaginationTable
        renderItem={renderItem}
        data={data.customerreviews}
        cols={cols}
        showPageNumber={true}
        limit={typeof (limit) === 'string' ? parseInt(limit) : limit}
        setLimit={setLimit}
        currentPage={currentPage}
    />
}

export default DataTable;
