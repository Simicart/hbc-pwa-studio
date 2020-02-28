import React, {useEffect} from 'react';
import TableHeader from './../components/TableHeader';
import TableBody from './../components/TableBody';
import TableFooter from './../components/TableFooter';

const $ = window.$
let count = 0;

const Print = props => {
    const {data, tab} = props

    useEffect(() => {
        $('.page-header').hide()
        $('.sections.nav-sections').hide()
        $('.page-footer').hide()
        if(count === 0) {
            count++
            window.print()
        } 
        return () => {
            count = 0;
            $('.page-header').show()
            $('.sections.nav-sections').show()
            $('.page-footer').show()
        }
    })

    return (
        <table className="data table table-order-items" id="my-orders-table">
            <TableHeader />
            <TableBody data={data} tab={tab}/>
            <TableFooter data={data}/>
        </table>
    );
    
}

export default Print;