import React, {Fragment, Suspense, useState} from 'react';
import {Link} from 'react-router-dom'
import Identify from "src/simi/Helper/Identify";
import Loading from 'src/simi/BaseComponents/Loading'
import Invoices from './Invoices';
import {getReOrder} from 'src/simi/Model/Orders'
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading'

const Detail = React.lazy(() => import('./Detail'))
const Shipment = React.lazy(() => import('./Shipment'))
const Print = React.lazy(() => import('./Print'))

const TableOrder = props => {
    const [tab, setTab] = useState('detail')
    const {data, print} = props

    const getDataReOrder = (data) => {
        if (data) {
            hideFogLoading();
            props.toggleMessages([{ type: 'success', message: data.message, auto_dismiss: true }])
            props.getCartDetails()
        }
    }

    const handleReOrder = () => {
        showFogLoading();
        getReOrder(data.entity_id, getDataReOrder)
    }

    const handleOpenWindow = (url) => {
        window.open(url, '_blank', 'width=800,height=600,scrollbars=1,left=0,right=0,resizable=1')
    }
    const renderActions = () => {
        return (
            <div className="actions-toolbar order-actions-toolbar">
                <div className="actions">
                    {(data.status === 'processing' || data.status === 'completed') ? <span className="action re-order" onClick={() => handleReOrder()}>{Identify.__("Reorder")}</span> : null}
                    <Link to={`/help-desk.html/${data.entity_id}`} className="action submit-ticket">{Identify.__("Submit Support Ticket")}</Link>
                    <Link to={`/print.html/${data.increment_id}`} className="action print-order">{Identify.__("Print")}</Link>
                </div>
            </div>
        )
    }

    if(print) {
        return (
            <div className="order-details-items ordered">
                <div className="table-wrapper order-items">
                    <Suspense fallback={<Loading />}>
                        <Print data={data} tab={tab}/>
                    </Suspense>
                </div>
            </div>
        )
    }

    return (
        <Fragment>
            {renderActions()}
            <ul className="items order-links">
                <li className={`nav item ${tab === 'detail' ? 'current' : ''}`} onClick={() => setTab('detail')}>
                    <strong>{Identify.__('Items Ordered')}</strong>
                </li>
                {data.invoices && <li className={`nav item ${tab === 'invoices' ? 'current' : ''}`} onClick={() => setTab('invoices')}>
                    <strong>{Identify.__('Invoices')}</strong>
                </li>}
                {data.shipments && <li className={`nav item ${tab === 'shipment' ? 'current' : ''}`} onClick={() => setTab('shipment')}>
                    <strong>{Identify.__('Order Shipments')}</strong>
                </li>}
            </ul>
            <div className="order-details-items ordered">
                    {
                        tab === 'shipment' && (
                            <Fragment>
                                {data.shipments.track_info && data.shipments.track_info.length > 0 && <div className="actions-toolbar">
                                    <a href="#" className="action track" onClick={() => handleOpenWindow(data.shipments.tracking_all_url)}>
                                        <span>{Identify.__('Track All Shipments')}</span>
                                    </a>
                                </div>}
                                <div className="order-title">
                                    <strong>Shipment {'#' + data.shipments.increment_id}</strong>
                                    {data.shipments.track_info && data.shipments.track_info.length > 0 && <a href="#" className="action track" onClick={() => handleOpenWindow(data.shipments.tracking_url)}>
                                        <span>{Identify.__('Track this shipment')}</span>
                                    </a>}
                                </div>
                                {data.shipments.track_info && data.shipments.track_info.length > 0 && <dl className="order-tracking">
                                    <dt className="tracking-title">{Identify.__('Tracking Number(s):')}</dt>
                                    <dd className="tracking-content">
                                        {data.shipments.track_info.map((item, index) => {
                                            return (
                                                <a className="action track" key={index} onClick={() => handleOpenWindow(item.track_url)}><span>{item.track_number}</span> {index === data.shipments.track_info.length ? ' ,' : ''}</a>
                                            )
                                        })}
                                    </dd>
                                </dl>}
                            </Fragment>

                        )
                    }
                    {tab === 'invoices' && <div className="order-title">
                        <strong>Invoice {'#' + data.invoices.increment_id}</strong>
                    </div>}
                <div className="table-wrapper order-items">
                    <Suspense fallback={<Loading />}>
                        {tab === 'detail' && <Detail data={data} tab={tab}/>}
                        {tab === 'shipment' && data.shipments && <Shipment data={data} tab={tab}/>}
                        {tab === 'invoices' && data.invoices && <Invoices data={data} tab={tab} />}
                    </Suspense>
                </div>
                <div className="actions-toolbar">
                    <div className="secondary">
                        <Link to="/orderhistory.html"><span>{Identify.__('Back to My Orders')}</span></Link>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default TableOrder;
