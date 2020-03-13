import React from 'react';
import Identify from "src/simi/Helper/Identify"
import {Link} from 'react-router-dom'

require('./account.scss')

const Account = props => {

    const handleOnMenu = () => {
        props.handleMenuItem('/login.html')
        props.handleClose()
    }

    const handleCloseMenu = () => {
        props.handleClose()
    }

    return (
        <nav id="navigation-account" className="mobile-navigation navigation-account" style={{display: 'none'}}>
            <ul className="header links">
                <li className="greet welcome">
                    <span>{Identify.__('$3.99 flat shipping over $50!')}</span>
                </li>
                <li className="customer-welcome">
                    <div className="customer-menu">
                        <ul className="header links">
                            {
                                !props.isSignedIn 
                                ? <li style={{textAlign: 'center'}}><button style={{backgroundColor: '#f54a89', padding: '0 54px', margin: '5px', textTransform: 'uppercase'}} type="button" onClick={() => handleOnMenu()}><span style={{fontSize: "14px", color: "#fff", fontWeight: "bold"}}>{Identify.__('Sign In')}</span></button></li> 
                                : <li><Link to="/account.html" onClick={() => handleCloseMenu()}>{Identify.__('My Account')}</Link></li>
                            }
                            <li style={{borderBottom: '1px solid #ccc'}}><Link to="/create-account.html" onClick={() => handleCloseMenu()}>{Identify.__('New Customers')}</Link></li>
                            <li><Link to={'/orderhistory.html'} onClick={() => handleCloseMenu()}>{Identify.__('Order History')}</Link></li>
                            <li><Link to={'/reward-points.html'} onClick={() => handleCloseMenu()}>{Identify.__('Reward Points')}</Link></li>
                            {props.isSignedIn ? <li><Link to={'/wishlist.html'} onClick={() => handleCloseMenu()}>{Identify.__('My Wish List')}</Link></li> : null}
                        </ul>
                    </div>
                </li>
                <li className="favorites"><Link to={'/wishlist.html'} onClick={() => handleCloseMenu()}><i className="fa fa-heart"></i></Link></li>
                {props.isSignedIn && <li className="authorization-link"><Link to={'/logout.html'} onClick={() => handleCloseMenu()}>{Identify.__('Sign Out')}</Link></li>}
            </ul>   
        </nav>
    );
}

export default Account;