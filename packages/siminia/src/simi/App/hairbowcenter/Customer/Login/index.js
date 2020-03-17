import React, { Component, Suspense } from 'react';
import Identify from 'src/simi/Helper/Identify';
import { connect } from 'src/drivers';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { simiSignIn as signinApi } from 'src/simi/Model/Customer'
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'
import  * as Constants from 'src/simi/Config/Constants'
import { Util } from '@magento/peregrine'
import { simiSignedIn } from 'src/simi/Redux/actions/simiactions';
import {showToastMessage} from 'src/simi/Helper/Message';
import {setRememberMe} from '../../Model/Customer';
import Loading from 'src/simi/BaseComponents/Loading'
import { addToWishlist as simiAddToWishlist } from 'src/simi/Model/Wishlist';

require('./login.scss')

const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

const SignIn = React.lazy(() => import('./SignIn'));
const CreateAccount = React.lazy(() => import('./CreateAccount'));
const ForgotPassword = React.lazy(() => import('./ForgotPassword'));

class CustomerLogin extends Component {
    constructor(props) {
        super(props);
        this.remeberMe = null
        this.addWishList = null;
        const {history} = this.props;
        if(history.location.state && history.location.state.hasOwnProperty('params_wishlist') && history.location.state.params_wishlist) {
            this.addWishList = true
        }
        this.state = {
            type: 'login'
        }
       
    }    

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.page || nextProps.page === prevState.page) {
            return null
        }
        return { page: nextProps.page }
    }

    getRememberMe = (remeberMe) => {
        this.remeberMe = remeberMe
    }

    onSignIn(username, password) {
        Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, Constants.SIMI_SESS_ID, null)
        signinApi(this.signinCallback.bind(this), { username, password })
        showFogLoading()
    };

    addToWishlistCallBack = (data) => {
        hideFogLoading();
        if(!data.errors) {
            this.props.history.push('/wishlist.html');
        }

    }

    signinCallback = (data) => {
        hideFogLoading()
        if (this.props.simiSignedIn) {
            if (data && !data.errors) {
                storage.removeItem('cartId');
                storage.removeItem('signin_token');
                if (data.customer_access_token) {
                    Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, Constants.SIMI_SESS_ID, data.customer_identity)
                    setToken(data.customer_access_token)
                    this.props.simiSignedIn(data.customer_access_token)
                } else {
                    Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, Constants.SIMI_SESS_ID, null)
                    setToken(data)
                    this.props.simiSignedIn(data)
                }
                const {history} = this.props;
                if(history.location.state && history.location.state.hasOwnProperty('params_wishlist') && history.location.state.params_wishlist) {
                    console.log('run');
                    const params = history.location.state.params_wishlist;
                    showFogLoading()
                    simiAddToWishlist(this.addToWishlistCallBack, params)
                }
                if(this.remeberMe) {
                    let setCheckout = false
                    if(this.props.type === 'create-account') {
                        setCheckout = true
                    }
                    setRememberMe(() => {}, this.remeberMe, setCheckout)
                }
            }
            else
                showToastMessage(Identify.__('The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.'))
        }
    }

    renderCustomerAccountForm = () => {
        const {page} = this.state
        return (
            <Suspense fallback={<Loading />}>
                {
                    page === 'login' 
                    && <SignIn onSignIn={this.onSignIn.bind(this)} getRememberMe={this.getRememberMe} />
                }
                {
                    page === 'create-account'
                    && <CreateAccount onSignIn={this.onSignIn.bind(this)} getRememberMe={this.getRememberMe}/>
                }
                {
                    page === 'forgot-password'
                    && <ForgotPassword toggleMessages={this.props.toggleMessages} history={this.props.history}/>
                }
            </Suspense>
        )
    }

    render() {
        const {
            isSignedIn,
            firstname,
            history
        } = this.props;
        if (isSignedIn) {
            let showMessage = true;
            if (history.location.state && history.location.state.hasOwnProperty('link') && history.location.state.link){
                showMessage = false
                Identify.ApiDataStorage('run-alert', 'update', true);
                history.push({pathname: '/' + history.location.state.link + '.html'})
            } if(!this.addWishList) {
                history.push('/')
            }
        
            const message = firstname?
                Identify.__("Welcome %s Start shopping now").replace('%s', firstname):
                Identify.__("You have succesfully logged in, Start shopping now")
            if (showMessage && this.props.toggleMessages)
                this.props.toggleMessages([{type: 'success', message: message, auto_dismiss: true}])
        }

        return (
            <main id="maincontent" className={`container customer-login ${this.state.page}-page`}>
                {this.renderCustomerAccountForm()}
            </main>
        );
    }
}

const mapStateToProps = ({ user }) => {
    const { currentUser, isSignedIn, forgotPassword } = user;
    const { firstname, email, lastname } = currentUser;

    return {
        email,
        firstname,
        forgotPassword,
        isSignedIn,
        lastname,
    };
};

const mapDispatchToProps = {
    toggleMessages,
    simiSignedIn
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(CustomerLogin);


async function setToken(token) {
    // TODO: Get correct token expire time from API
    return storage.setItem('signin_token', token, 3600);
}
