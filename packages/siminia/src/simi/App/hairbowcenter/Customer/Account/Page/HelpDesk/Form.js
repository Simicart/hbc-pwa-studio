import React from 'react';
import TextBox from 'src/simi/BaseComponents/TextBox';
import Identify from 'src/simi/Helper/Identify';
import { postTicket, uploadFiles } from 'src/simi/App/hairbowcenter/Model/Tickets';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { convertImageToBase64, niceBytes } from 'src/simi/App/hairbowcenter/Helper';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
const $ = window.$;

const FormTicket = (props) => {
    const { tickets, orderId } = props;
    let defaultOrder = '';
    if (orderId) {
        const { order_options } = tickets || {}
        for (let i in order_options) {
            const order_option = order_options[i];
            if (order_option === orderId) {
                defaultOrder = i
            }
        }
    }

    let fileAttach = null;

    const handleOnChange = (e) => {
        if (e.target.name === 'new_password') {
            let str = checkPassStrength(e.target.value);
            $('#strength-value').html(Identify.__(str))
        }
        if (e.target.value !== "" || e.target.value !== null) {
            $(e.target).removeClass("is-invalid");
        }
    }

    const renderDepartment = (departments) => {
        let dpt = [];
        for (const key in departments) {
            dpt.push(<option value={key} key={key}>{departments[key]}</option>);
        }

        return <div className="form-group department">
            <label htmlFor="department_id">{Identify.__("Department")}<span>*</span></label>
            <select name="department_id" id="department_id" required>
                {dpt}
            </select>
        </div>
    }

    const renderOrder = () => {
        if (!tickets || (tickets && !tickets.hasOwnProperty('order_options'))) return;

        let dpt = [];
        const { order_options } = tickets;
        for (const key in order_options) {
            dpt.push(<option value={key} key={key}>{order_options[key]}</option>);
        }
        return dpt;
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


    const submitTicket = (e) => {
        e.preventDefault();
        const formValue = $("#helpdesk-submit-ticket").serializeArray();
        const checkValid = validation(formValue);
        if (checkValid) {
            let params = {}
            for (let index in formValue) {
                let field = formValue[index];
                params[field.name] = field.value;
            }
            if (fileAttach) {
                params['attachment'] = fileAttach;
            }
            showFogLoading();
            postTicket(callBackPostTicket, params);
        }
    }

    const callBackPostTicket = (data) => {
        if (data.success) {
            props.toggleMessages([{ type: 'success', message: data.message, auto_dismiss: true }]);
            props.callApiListTickets();
            $("#helpdesk-submit-ticket")[0].reset();
            fileAttach = null;
            $('#aw-helpdesk-attachments-added').empty();
        } else if (data.errors) {
            const messages = data.errors.map(value => {
                return { type: 'error', message: value.message, auto_dismiss: true }
            })
            props.toggleMessages(messages);
        }
        smoothScrollToView($('#root'));
        hideFogLoading();
    }

    const callBackUploadFiles = (data) => {
        const buttonSubmit = $('#helpdesk-submit-ticket').find('button[type="submit"]');
        buttonSubmit.removeAttr("disabled");
        if (data.hasOwnProperty('uploadfile')) {
            fileAttach = [{ name: data.uploadfile.file_name, file: data.uploadfile.file_name, removed: "0" }];
        }
    }

    const handleUploadFile = async () => {
        const containerTag = $('#helpdesk-submit-ticket');
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

    return <form onSubmit={submitTicket} id="helpdesk-submit-ticket">
        <div className="main__edit-column">
            <h4 className="title">
                {Identify.__("CREATE NEW TICKET")}
            </h4>
            <TextBox
                label={Identify.__("Subject")}
                name="subject"
                id="subject"
                className="required"
                required={true}
                onChange={handleOnChange}
            />
            {tickets && tickets.hasOwnProperty('departments') ? renderDepartment(tickets.departments) : null}

            <div className="form-group order">
                <label htmlFor="order_id">{Identify.__("Order")}</label>
                <select name="order_id" id="order_id" defaultValue={defaultOrder}>
                    <option value="">{Identify.__("Unassigned")}</option>
                    {renderOrder()}
                </select>
            </div>
            <div className="form-group message">
                <label htmlFor="content">{Identify.__("Message")}<span>*</span></label>
                <textarea name="content" id="content" cols="30" rows="4" required />
            </div>
            <div className="form-group attachment">
                <label htmlFor="aw-helpdesk-attachments">{Identify.__("Attachments")}</label>
                <div className="aw-helpdesk-file-upload__container">
                    <ul id="aw-helpdesk-attachments-added" />
                    <span className="aw-helpdesk-file-upload">
                        <span className="aw-helpdesk-file-upload__link">{Identify.__("Add file")}</span>
                        <input type="file" name="file[]" id="aw-helpdesk-attachments" multiple onChange={handleUploadFile} />
                    </span>
                </div>
            </div>
            <div className="actions-toolbar">
                <button type="submit">{Identify.__("Submit Ticket")}</button>
            </div>
        </div>
    </form>
}

export default FormTicket;
