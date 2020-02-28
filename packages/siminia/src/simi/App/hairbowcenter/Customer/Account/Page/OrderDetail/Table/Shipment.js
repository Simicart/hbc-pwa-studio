import React from 'react';
import TableHeader from '../components/TableHeader'
import TableBody from '../components/TableBody';
import Identify from "src/simi/Helper/Identify";

const Shipment = props => {
    const {data, tab} = props
    const cols = {
        name: {
            status: true,
            title: Identify.__('Product Name')
        },
        sku: {
            status: true,
            title: Identify.__('SKU')
        },
        qty: {
            status: true,
            title: Identify.__('Qty Shipped') 
        },
    }

    return (
        <table className="data table table-order-items" id="my-orders-table">
            <TableHeader 
                cols={cols}
            />
            <TableBody data={data} cols={cols} tab={tab}/>
        </table>
    );
}

export default Shipment;