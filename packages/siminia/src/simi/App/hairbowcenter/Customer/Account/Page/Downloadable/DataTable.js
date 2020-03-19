import React, { useState } from 'react';
import PaginationTable from './../../Components/Orders/PaginationTable';
import Identify from 'src/simi/Helper/Identify';
import { Link } from 'src/drivers';

const DataTable = (props) => {

    const { data } = props;
    const [limit, setLimit] = useState(10);
    const currentPage = 1;

    const cols = [
        { title: Identify.__("Order #") },
        { title: Identify.__("Date") },
        { title: Identify.__("Title") },
        { title: Identify.__("Status") },
        { title: Identify.__("Remaining Downloads") },
    ];


    const renderItem = (item, index) => {
        let dateP = item.created_at;
        const dateF = dateP.split(/[- :]/);
        let date = new Date(dateF[0], dateF[1], dateF[2], dateF[3], dateF[4], dateF[5]);
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        date = date.getDate() + "/" + m + "/" + date.getFullYear();

        const location = {
            pathname: "/orderdetails.html/" + item.order_id,
            state: {
                orderData: {
                    increment_id: item.order_id
                }
            }
        };

        return (
            <tr key={index}>
                <td data-title={Identify.__("Order #")}>
                    <Link to={location}>{Identify.__(item.order_id)}</Link>
                </td>
                <td data-title={Identify.__("Date")}>
                    {date}
                </td>
                <td data-title={Identify.__("Title")}>
                    {item.order_name}
                </td>
                <td data-title={Identify.__("Status")}>
                    <span className="order-status" style={{textTransform: 'capitalize'}}>{item.order_status}</span>
                </td>
                <td data-title={Identify.__("Remaining Downloads")}>
                    {item.order_remain}
                </td>
            </tr>
        )
    }

    return <PaginationTable
        renderItem={renderItem}
        data={data.downloadableproducts}
        cols={cols}
        showPageNumber={true}
        limit={typeof (limit) === 'string' ? parseInt(limit) : limit}
        setLimit={setLimit}
        currentPage={currentPage}
    />
}

export default DataTable;
