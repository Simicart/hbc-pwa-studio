import React from 'react'
import Identify from "src/simi/Helper/Identify";
import { connect } from 'src/drivers';
import { Link } from 'react-router-dom';

class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.setCustomerMenuRef = this.setCustomerMenuRef.bind(this);
        this.handleClickOutsideCustomerMenu = this.handleClickOutsideCustomerMenu.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.setMinPhone);
        document.addEventListener('mousedown', this.handleClickOutsideCustomerMenu);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setMinPhone);
        document.removeEventListener('mousedown', this.handleClickOutsideCustomerMenu);
    }

    setCustomerMenuRef(node) {
        this.customerMenuRef = node;
    }

    handleClickLinkCustomer = () => {
        $('.customer-welcome .customer-menu').hide()
    }

    handleClickOutsideCustomerMenu(event) {
        if (this.customerMenuRef && !this.customerMenuRef.contains(event.target)) {
            const customMenu = $('.customer-welcome .customer-menu')
            if (customMenu && customMenu.css('display') !== 'none') {
                customMenu.slideUp();
            }
        }
    }

    renderJs = () => {
        $(document).ready(function () {
            $('.customer-welcome .customer-name').unbind().on('click', function () {
                $(".customer-welcome").find(".customer-menu").slideToggle()
            });
        });
    }


    render() {
        const { props } = this
        const { firstname, isSignedIn } = props;
        const account = firstname ? Identify.__('Hello, ') + firstname : Identify.__('Sign In')
        return <React.Fragment>
            <li className="customer-welcome" ref={this.setCustomerMenuRef}>
                <span className="customer-name">
                    <span>
                        {account}
                        <br />{Identify.__("Your Account")}</span>
                    <button type="button" className="action switch" tabIndex={-1} data-action="customer-menu-toggle">
                        <span>{Identify.__("Change")}</span>
                    </button>
                </span>
                <div className="customer-menu" data-target="dropdown" aria-hidden="true">
                    <ul className="header links">
                        {!isSignedIn ? <React.Fragment>
                            <li style={{ textAlign: 'center' }}>
                                <Link className="signin-btn" to={'/login.html'} onClick={() => this.handleClickLinkCustomer()}>
                                    <span style={{ fontSize: '14px', color: '#fff', fontWeight: 'bold' }}>{Identify.__("Sign In")}</span></Link>
                            </li>
                            <li style={{ borderBottom: '1px solid #ccc' }}><Link to={'/create-account.html'} onClick={() => this.handleClickLinkCustomer()}>{Identify.__("New Customers")}</Link></li>
                        </React.Fragment> : <li>
                                <Link to={"/account.html"} onClick={() => this.handleClickLinkCustomer()}>{Identify.__("My Account")}</Link>
                            </li>}
                        <li>
                            <Link to={"/orderhistory.html"} onClick={() => this.handleClickLinkCustomer()}>{Identify.__("Order History")}</Link>
                        </li>
                        <li>
                            <Link to={'/reward-points.html'} onClick={() => this.handleClickLinkCustomer()}>{Identify.__("Reward Points")}</Link>
                        </li>
                        <li className="link wishlist" data-bind="scope: 'wishlist'">
                            <Link to={"/wishlist.html"} onClick={() => this.handleClickLinkCustomer()}>{Identify.__("My Wish List")}</Link>
                        </li>
                    </ul>
                </div>
            </li>
            <li className="favorites">
                <Link to={"/wishlist.html"}><i className="fa fa-heart" aria-hidden="true" /></Link>
            </li>
            {isSignedIn && <li className="authorization-link">
                        <Link to={"/logout.html"}>{Identify.__("Sign Out")}</Link>
            </li>}
            {this.renderJs()}
        </React.Fragment>
    }
}


const mapStateToProps = ({ user }) => {
    const { currentUser, isSignedIn } = user;
    const { firstname, lastname } = currentUser;

    return {
        firstname,
        isSignedIn,
        lastname,
    };
}

export default connect(mapStateToProps)(MyAccount);
