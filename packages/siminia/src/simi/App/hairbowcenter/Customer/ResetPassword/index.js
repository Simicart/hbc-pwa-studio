import React from 'react';
import { Form } from 'informed';
import { validators } from './validators';
import Identify from 'src/simi/Helper/Identify';
import TextInput from 'src/components/TextInput';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import { showToastMessage } from 'src/simi/Helper/Message';
import {
    showFogLoading,
    hideFogLoading
} from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { createPassword } from 'src/simi/App/hairbowcenter/Model/Customer';
import Field from 'src/components/Field';
require('./style.scss');

const $ = window.$;
class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.token = false;
        const params = new URL(window.location.href);
        if (params && params.searchParams.get('token')) {
            this.token = params.searchParams.get('token');
        }
        if (!this.token) {
            console.log('no token');
        }
    }

    render() {
        const handleSubmit = values => {
            showFogLoading();
            if (!this.token) {
                console.log('no token');
                const msg = Identify.__('Your link reset password is invalid !');
                showToastMessage(msg);
            } else {
                console.log('have token : ' + this.token);
                createPassword(createDone, {
                    rptoken: this.token,
                    password: values.password
                });
            }
        };

        const createDone = data => {
            if (data.errors) {
                console.log('nooo');
                let errorMsg = '';
                if (data.errors.length) {
                    data.errors.map(error => {
                        errorMsg += error.message;
                    });
                    hideFogLoading();
                    showToastMessage(errorMsg);
                }
            } else {
                hideFogLoading();
                smoothScrollToView($('#id-message'));
                const successMsg = Identify.__(
                    'Updated new password successfully !'
                );
                // reset form
                $('.form')[0].reset();
                // clear user name and password save in local storage
                const savedUser = Identify.getDataFromStoreage(
                    Identify.LOCAL_STOREAGE,
                    'user_email'
                );
                const savedPassword = Identify.getDataFromStoreage(
                    Identify.LOCAL_STOREAGE,
                    'user_password'
                );
                if (savedUser && savedPassword) {
                    localStorage.removeItem('user_email');
                    localStorage.removeItem('user_password');
                }
                showToastMessage(successMsg);
                // this.props.toggleMessages([{ type: 'success', message: successMsg, auto_dismiss: true }]);
            }
        };

        return (
            <div className="main-container" id="id-message">
                {TitleHelper.renderMetaHeader({
                    title: Identify.__('Reset a Password')
                })}
                <div className="container password-container">
                    <div className="layout">
                        <div role="main">
                            <div className="page-title">
                                <h1>{Identify.__("Reset a Password")}</h1>
                            </div>
                            <Form
                                className="form"
                                getApi={this.setFormApi}
                                onSubmit={handleSubmit}
                            >
                                <div className="fieldset">
                                    <ul className="form-list">
                                        <li className="fields">
                                            <Field
                                                label={Identify.__("New Password")}
                                                specialCharacter="*"
                                                className="field newPassword"
                                            >
                                                <TextInput
                                                    field="password"
                                                    type="password"
                                                    autoComplete="new-password"
                                                    validate={validators.get(
                                                        'password'
                                                    )}
                                                    validateOnBlur
                                                />
                                            </Field>
                                            <Field
                                                label={Identify.__("Confirm New Password")}
                                                specialCharacter="*"
                                                className="field confirmPassword"
                                            >
                                                <TextInput
                                                    field="confirm"
                                                    type="password"
                                                    validate={validators.get(
                                                        'confirm'
                                                    )}
                                                    validateOnBlur
                                                />
                                            </Field>
                                        </li>
                                    </ul>
                                </div>
                                <div className="buttons-set">
                                    <p className="required">{Identify.__("* Required Fields")}</p>
                                    <button
                                        priority="high"
                                        className="resetPassBtn"
                                        type="submit"
                                    >
                                        {Identify.__("Reset My Password").toUpperCase()}
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    toggleMessages
};

export default connect(
    null,
    mapDispatchToProps
)(ResetPassword);
