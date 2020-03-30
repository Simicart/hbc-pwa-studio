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
        { title: Identify.__("ID") },
        { title: Identify.__("Subject") },
        { title: Identify.__("Order") },
        { title: Identify.__("Status") },
        { title: Identify.__("Last Reply") },
    ];


    const renderItem = (item, index) => {
        let dateP = item.last_reply_date;
        const dateF = dateP.split(/[- :]/);
        // let date = new Date(dateF[0], dateF[1], dateF[2], dateF[3], dateF[4], dateF[5]);
        /* let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        date = date.getDate() + "/" + m + "/" + date.getFullYear(); */

        let date = new Date(dateP);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: "UTC" };
        const dateCV = date.toLocaleDateString("en-US", options).replace(",", "");


        const detailLocation = {
            pathname: `/ticket.html/${item.id}`,
            state: {
                ticketData: item
            }
        }

        const orderDetailLink = item.order_increment_id === 'Unassigned' ? `/orderhistory.html` : `/orderdetails.html/${item.order_increment_id}`;

        return (
            <tr key={index}>
                <td data-title={Identify.__("ID")}>
                    {item.uid}
                </td>
                <td data-title={Identify.__("Subject")}>
                    <Link to={detailLocation}>{Identify.__(item.subject)}</Link>
                </td>
                <td data-title={Identify.__("Order")}>
                    <Link to={orderDetailLink}>{`#${item.order_increment_id}`}</Link>
                </td>
                <td data-title={Identify.__("Status")} style={{ textTransform: 'capitalize' }}>
                    {item.status}
                </td>
                <td data-title={Identify.__("Last Reply")}>
                    {dateCV}
                </td>
            </tr>
        )
    }

    return <PaginationTable
        renderItem={renderItem}
        data={data.tickets}
        cols={cols}
        showPageNumber={true}
        limit={typeof (limit) === 'string' ? parseInt(limit) : limit}
        setLimit={setLimit}
        currentPage={currentPage}
    />
}

export default DataTable;
