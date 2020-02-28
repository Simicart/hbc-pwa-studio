import React from 'react';
import TableHeader from '../components/TableHeader'
import TableFooter from '../components/TableFooter';
import TableBody from '../components/TableBody';

const Detail = props => {
    const {data, tab} = props

    return (
        <table className="data table table-order-items" id="my-orders-table">
            <TableHeader />
            <TableBody data={data} tab={tab}/>
            <TableFooter data={data}/>
        </table>
    );
}

export default Detail;