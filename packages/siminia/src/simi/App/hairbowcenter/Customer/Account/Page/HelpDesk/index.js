import React, { useState, useEffect } from 'react';
import EmptyData from './../../Components/EmptyData';
import Identify from 'src/simi/Helper/Identify';
import { getListTickets } from 'src/simi/App/hairbowcenter/Model/Tickets';
import FormTicket from './Form';
require('./style.scss');

const HelpDesk = (props) => {
    const ticketListLocal = Identify.ApiDataStorage('ticket_list_local') || null;

    const [ticket, setTicket] = useState(ticketListLocal);

    useEffect(() => {
        if (!ticketListLocal) {
            getListTickets(callBackGetTickets)
        }
    }, []);

    const callBackGetTickets = (data) => {
        if (data.errors) {

        } else if (data.tickets) {
            setTicket(data);
            Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'ticket_list_local', data);
        }
    }
    console.log(ticket)

    return <React.Fragment>
        {(!ticket || (ticket && ticket.tickets.length < 1)) ? <EmptyData message={Identify.__("You have submitted no tickets.")} /> : <p>list tickets</p>}
        <FormTicket tickets={ticket} orderId={props.orderId}/>
    </React.Fragment>
}

export default HelpDesk;
