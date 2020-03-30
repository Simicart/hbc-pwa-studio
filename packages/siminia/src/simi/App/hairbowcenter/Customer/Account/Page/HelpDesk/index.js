import React, { useState, useEffect } from 'react';
import EmptyData from './../../Components/EmptyData';
import Identify from 'src/simi/Helper/Identify';
import { getListTickets } from 'src/simi/App/hairbowcenter/Model/Tickets';
import Loading from "src/simi/BaseComponents/Loading";
import FormTicket from './Form';
import { connect } from 'src/drivers';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import DataTable from './DataTable';
require('./style.scss');

const HelpDesk = (props) => {
    const [ticket, setTicket] = useState(null);

    function callBackGetTickets(data) {
        if (data.errors) {
            const messages = data.errors.map(value => {
                return { type: 'error', message: value.message, auto_dismiss: true }
            })
            props.toggleMessages(messages);
        } else if (data.tickets) {
            setTicket(data);
        }
    }

    const callApiListTickets = () => {
        getListTickets(callBackGetTickets);
    }

    if (!ticket) {
        callApiListTickets();
        return <Loading />;
    }
    if (ticket && ticket.errors) {
        return <EmptyData message={data.errors[0].message} />
    }

    if (!ticket || ticket.total < 1) {
        return <EmptyData message={Identify.__("You have submitted no tickets.")} />
    }

    return <React.Fragment>
        <div className="table-wrapper tickets">
            <a href="#helpdesk-submit-ticket" className="create_ticket_form_link action primary"><span>{Identify.__("Create New Ticket")}</span></a>
            <DataTable data={ticket} key={Identify.randomString(3)} />
        </div>
        <FormTicket tickets={ticket} orderId={props.orderId} callApiListTickets={callApiListTickets} toggleMessages={props.toggleMessages} />
    </React.Fragment>
}

const mapDispatchToProps = {
    toggleMessages
}

export default connect(null, mapDispatchToProps)(HelpDesk);
