import React from 'react';
import { validateEmail, validateEmpty } from 'src/simi/Helper/Validation';
import Identify from 'src/simi/Helper/Identify';

const CommentForm = (props) => {
    const { id, fullName, email, type } = props;

    const validateForm = (form) => {
        let isAllow = true;
        const data = {};
        const jQueryForm = $(`#amblog-form-comment-${type}-${id}`);
        form.map((value, index) => {
            const jQName = jQueryForm.find(`input[name=${value.name}], textarea[name=${value.name}]`);
            if (!validateEmpty(value.value)) {
                isAllow = false;
                jQName.next('.mage-error').text(Identify.__('This is a required field.'));
            } else if (value.name === 'email' && !validateEmail(value.value)) {
                isAllow = false;
                jQName.next('.mage-error').text(Identify.__('Please enter a valid email address (Ex: johndoe@domain.com).'));
            } else {
                jQName.next('.mage-error').text('');
                data[value.name] = value.value;
            }
        });

        if (type === 'reply') {
            data['reply_to'] = id;
        }

        return { isAllow, data }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = $(`#amblog-form-comment-${type}-${id}`).serializeArray();
        const isValidated = validateForm(form);
        if (props.handleSubmitProp) {
            props.handleSubmitProp(isValidated);
        }
    }

    return <div className="amblog-comments-action">
        <form className="amblog-form-comment" id={`amblog-form-comment-${type}-${id}`} onSubmit={handleSubmit}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 21" className="amblog-svg comment -classic">
                <path d="M20.55 7.509a8.032 8.032 0 0 0-.189-.759l-.014-.047a8.169 8.169 0 0 0-.255-.712l-.026-.06a8.281 8.281 0 0 0-.322-.68l-.026-.049a8.658 8.658 0 0 0-.395-.664l-.002-.003a9.472 9.472 0 0 0-2.18-2.31c-.034-.026-.064-.053-.098-.078-.156-.116-.32-.223-.485-.331-.09-.06-.18-.121-.272-.178a10.84 10.84 0 0 0-.45-.257c-.12-.065-.24-.13-.363-.192a11.122 11.122 0 0 0-.862-.383 11.35 11.35 0 0 0-.914-.315c-.137-.041-.275-.083-.415-.118a10.971 10.971 0 0 0-.55-.124c-.13-.027-.26-.056-.393-.079a11.832 11.832 0 0 0-.642-.085c-.112-.013-.222-.031-.335-.04A11.974 11.974 0 0 0 10.356 0C4.636 0 0 4.054 0 9.055c0 1.977.733 3.8 1.963 5.29L.2 18.415a52.006 52.006 0 0 0 4.887-1.575 11.43 11.43 0 0 0 5.269 1.27c5.72 0 10.356-4.055 10.356-9.055a7.98 7.98 0 0 0-.161-1.546z" />
                <path d="M25 13.77c0-2.232-1.2-4.215-3.061-5.496.021.259.044.517.044.78 0 5.18-4.325 9.47-9.934 10.202 1.362.942 3.08 1.508 4.951 1.508a8.832 8.832 0 0 0 4.07-.98c1.074.41 2.317.819 3.775 1.216l-1.362-3.143c.95-1.151 1.517-2.56 1.517-4.087z" />
            </svg>
            <fieldset className="amblog-fieldset">
                <div className="amblog-customer">
                    <div className="amblog-wrapper">
                        <input type="text" name="name" placeholder={Identify.__("Your name")} className="required-entry amblog-input -name" defaultValue={fullName} />
                        <div className="mage-error"></div>
                    </div>
                    <div className="amblog-wrapper">
                        <input type="text" name="email" placeholder={Identify.__("Your e-mail")} className="required-entry validate-email amblog-input -email" defaultValue={email} />
                        <div className="mage-error"></div>
                    </div>
                </div>
                <div className="amblog-wrap-controls">
                    <textarea name="message" className="required-entry amblog-input -textarea" rows={3} placeholder={Identify.__("Text your comment...")} />
                    <div className="mage-error"></div>
                </div>

                <button className="amblog-btn" type="submit">{Identify.__("Post comment")}</button>
            </fieldset>
        </form>
    </div>
}

export default CommentForm;
