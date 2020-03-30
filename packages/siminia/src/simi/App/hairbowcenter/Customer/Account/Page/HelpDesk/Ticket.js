import React, { useState, useEffect } from 'react';
import EmptyData from './../../Components/EmptyData';
import Identify from 'src/simi/Helper/Identify';
import { getTicket, closeTicket, uploadFiles, replyTicket } from 'src/simi/App/hairbowcenter/Model/Tickets';
import { connect } from 'src/drivers';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import ReactHTMLParser from 'react-html-parser';
import { Link } from 'src/drivers';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { convertImageToBase64, niceBytes } from 'src/simi/App/hairbowcenter/Helper';
require('./style.scss');

const $ = window.$;

const Ticket = (props) => {
    const { history, ticketId } = props;

    smoothScrollToView($('#root'));
    const defaultData = history.location.state.hasOwnProperty('ticketData') && history.location.state.ticketData ? history.location.state.ticketData : null;
    const [data, setData] = useState(defaultData);

    function callbackTicketDetail(data) {
        if (data && data.ticket) {
            setData(data.ticket);
        }
    }

    useEffect(() => {
        if (!data && ticketId) {
            getTicket(callbackTicketDetail, ticketId)
        }
    }, []);

    if (!data)
        return <EmptyData message={Identify.__("Not found ticket id.")} />
    /* const productLocation = `/${data.product_url}${productUrlSuffix()}`;

    let dateP = data.review_created_at;
    const dateF = dateP.split(/[- :]/);
    let date = new Date(dateF[0], dateF[1], dateF[2], dateF[3], dateF[4], dateF[5]);

    let m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    date = date.getDate() + "/" + m + "/" + date.getFullYear();
    const image = data.product_image ? resourceUrl(data.product_image, { type: 'image-product', width: 640 }) : null;
 */

    let fileAttach = null;

    const renderJs = () => {
        $(document).ready(function () {
            const title = `[${data.uid}] ${data.subject}`;
            $('#helpdesk-ticket-tt').html(title);
        });
    }

    const handleCloseTicket = () => {
        closeTicket(closeTicketProcess, ticketId);
        showFogLoading();
    }

    function closeTicketProcess(dataClose) {
        if (dataClose.success) {
            props.toggleMessages([{ type: 'success', message: dataClose.message, auto_dismiss: true }]);
            getTicket(callbackTicketDetail, ticketId)
        } else if (dataClose.errors) {
            const messages = dataClose.errors.map(value => {
                return { type: 'error', message: value.message, auto_dismiss: true }
            })
            props.toggleMessages(messages);
        }
        hideFogLoading();
    }

    const orderDetailLink = data.order_increment_id === 'Unassigned' ? '' : `/orderdetails.html/${data.order_increment_id}`;

    const renderListThread = (listThread) => {
        let html = null;
        if (listThread.length) {
            html = listThread.map((thread, ide) => {
                const attachmentList = thread.hasOwnProperty('attachments') && thread.attachments.length ?
                    thread.attachments.map((atment, il) => {
                        return <React.Fragment key={il}>
                            <a href={atment.url}>{atment.name}</a> ({niceBytes(atment.length)})
                        </React.Fragment>
                    })
                    : '';
                return <li className={`aw-helpdesk-ticket-view__thread-message ${thread.type}`} key={ide}>
                    <div className="message-header">
                        <span className="name">{thread.author_name}</span>
                        <span className="date">{thread.created_at}</span>
                    </div>
                    <div className="aw-helpdesk-ticket-view__message-text">{ReactHTMLParser(thread.content)}</div>
                    {attachmentList && <div className="aw-helpdesk-ticket-view__attachment">{attachmentList}</div>}
                </li>
            });
        }
        return html;
    }

    const callBackUploadFiles = (data) => {
        const buttonSubmit = $('#aw-helpdesk-customer-reply-form').find('button[type="submit"]');
        buttonSubmit.removeAttr("disabled");
        if (data.hasOwnProperty('uploadfile')) {
            fileAttach = [{ name: data.uploadfile.file_name, file: data.uploadfile.file_name, removed: "0" }];
        }
    }

    const handleUploadFile = async () => {
        const containerTag = $('#aw-helpdesk-customer-reply-form');
        const buttonSubmit = containerTag.find('button[type="submit"]');
        const fileUL = document.getElementById("aw-helpdesk-attachments").files[0];
        const base64Result = await convertImageToBase64(fileUL).catch(e => e);
        if (base64Result) {
            const base64RP = base64Result.replace(/^data:image.+;base64,/, '');
            const fileData = {
                'type': fileUL.type,
                'name': fileUL.name,
                'size': fileUL.size,
                'base64': base64RP
            };
            if (fileData && Object.keys(fileData).length) {
                if (containerTag.find('#aw-helpdesk-attachments-added').length) {
                    containerTag.find('#aw-helpdesk-attachments-added').append(`<li><span>${fileUL.name} (${niceBytes(fileUL.size)})</span> <span>x</span></li>`);
                }
                buttonSubmit.attr("disabled", true);
                uploadFiles(callBackUploadFiles, { fileData });
            }
        }
    }

    const validation = (inputs) => {
        let isValid = true;

        for (let indx in inputs) {
            const item = inputs[indx];
            if (($(`#${item.name}`).hasClass('isrequired') || $(`#${item.name}`).attr('required')) && item.value === 'null') {
                isValid = false;
            }
        }
        return isValid;
    }

    const submitReplyTicket = (e) => {
        e.preventDefault();
        const formValue = $("#aw-helpdesk-customer-reply-form").serializeArray();
        const checkValid = validation(formValue);
        if (checkValid) {
            let params = { ticket_id: ticketId }
            for (let index in formValue) {
                let field = formValue[index];
                params[field.name] = field.value;
            }
            if (fileAttach) {
                params['attachment'] = fileAttach;
            }
            showFogLoading();
            replyTicket(callBackReplyTicket, params);
        }
    }

    const callBackReplyTicket = (data) => {
        if (data.success) {
            props.toggleMessages([{ type: 'success', message: data.message, auto_dismiss: true }]);
            getTicket(callbackTicketDetail, ticketId);
            $("#aw-helpdesk-customer-reply-form")[0].reset();
            $('#aw-helpdesk-attachments-added').empty();
            fileAttach = null;
        } else if (data.errors) {
            const messages = data.errors.map(value => {
                return { type: 'error', message: value.message, auto_dismiss: true }
            })
            props.toggleMessages(messages);
        }
        hideFogLoading();
    }

    return <div className="customer-helpdesk-ticket view">
        <div className="ticket-detail-container">
            <div className="top-toolbar">
                <span className="back-page" onClick={() => history.goBack()}>{Identify.__("Back")}</span>
                {data.status !== 'solved' && <span className="close-tick" onClick={handleCloseTicket}>{Identify.__("Close Ticket")}</span>}
            </div>
            <div className="box-content fieldset info-fieldset">
                <div className="field aw-helpdesk-ticket-view__field">
                    <label className="label">{Identify.__("Status")}</label>
                    <div className="control"><span>{data.status}</span></div>
                </div>
                <div className="field aw-helpdesk-ticket-view__field">
                    <label className="label">{Identify.__("Order")}</label>
                    <div className="control">
                        {orderDetailLink ? <Link to={orderDetailLink}>{`#${data.order_increment_id}`}</Link> : data.order_increment_id}
                    </div>
                </div>
            </div>
            <div className="block block-thread">
                {data.status !== 'solved' ? <form id="aw-helpdesk-customer-reply-form" onSubmit={submitReplyTicket}>
                    <div className="field">
                        <div className="control">
                            <textarea name="content" rows="5" placeholder={Identify.__("Type here to add an answer")} required={true} />
                        </div>
                    </div>
                    <div className="actions">
                        <div className="aw-helpdesk-file-upload__container">
                            <ul id="aw-helpdesk-attachments-added" />
                            <span className="aw-helpdesk-file-upload">
                                <span className="aw-helpdesk-file-upload__link">{Identify.__("Add file")}</span>
                                <input type="file" name="file[]" id="aw-helpdesk-attachments" multiple onChange={handleUploadFile} />
                            </span>
                        </div>
                        <button className="action primary post-reply" type="submit">{Identify.__("Post Reply")}</button>
                    </div>
                </form> : <span>{Identify.__("This ticket is solved. Click ")} <Link to="/help-desk.html">{Identify.__("here")}</Link> {Identify.__(" to create a new one.")}</span>}
                {data.hasOwnProperty('thread') && data.thread.length ?
                    <ul className="messages">
                        {renderListThread(data.thread)}
                    </ul> : ''}
            </div>
        </div>
        {renderJs()}
    </div>
}

const mapDispatchToProps = {
    toggleMessages
}

export default connect(null, mapDispatchToProps)(Ticket);

