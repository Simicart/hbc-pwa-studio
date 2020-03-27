import React, { useState, useEffect } from 'react';
import EmptyData from './../../Components/EmptyData';
import Identify from 'src/simi/Helper/Identify';
import { getListTickets } from 'src/simi/App/hairbowcenter/Model/Tickets';
import FormTicket from './Form';
import { connect } from 'src/drivers';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import DataTable from './DataTable';
require('./style.scss');

const HelpDesk = (props) => {
    const ticketListLocal = Identify.ApiDataStorage('ticket_list_local') || null;

    const [ticket, setTicket] = useState(ticketListLocal);

    useEffect(() => {
        if (!ticketListLocal) {
            callApiListTickets();
        }
    }, []);

    const callBackGetTickets = (data) => {
        if (data.errors) {
            const messages = data.errors.map(value => {
                return { type: 'error', message: value.message, auto_dismiss: true }
            })
            props.toggleMessages(messages);
        } else if (data.tickets) {
            setTicket(data);
            Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'ticket_list_local', data);
        }
    }

    const callApiListTickets = () => {
        getListTickets(callBackGetTickets);
    }

    return <React.Fragment>
        {(!ticket || (ticket && ticket.tickets.length < 1)) ? <EmptyData message={Identify.__("You have submitted no tickets.")} /> : <div className="table-wrapper tickets">
            <a href="#helpdesk-submit-ticket" className="create_ticket_form_link action primary"><span>{Identify.__("Create New Ticket")}</span></a>
            <DataTable data={ticket} />
        </div>}
        <FormTicket tickets={ticket} orderId={props.orderId} callApiListTickets={callApiListTickets} toggleMessages={props.toggleMessages} />
    </React.Fragment>
}

const mapDispatchToProps = {
    toggleMessages
}

export default connect(null, mapDispatchToProps)(HelpDesk);
