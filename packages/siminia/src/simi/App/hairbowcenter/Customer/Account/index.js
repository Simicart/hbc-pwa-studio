import React from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Identify from "src/simi/Helper/Identify";
import defaultClasses from './style.scss'
import CloseIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/Close'
import MenuIcon from 'src/simi/BaseComponents/Icon/Menu'
import classify from 'src/classify';
import { Link } from 'src/drivers';
import { compose } from 'redux';
import { connect } from 'src/drivers';
import Dashboard from './Page/Dashboard';
import Wishlist from './Page/Wishlist'
import ShareWishlist from './Page/Wishlist/Sharing'
import Newsletter from './Page/Newsletter';
import AddressBook from './Page/AddressBook';
import Profile from './Page/Profile';
import MyOrder from './Page/OrderHistory';
import OrderDetail from './Page/OrderDetail';
import Downloadable from './Page/Downloadable';
import ProductReviews from './Page/Reviews';
import ReviewDetail from './Page/Reviews/Detail';
import HelpDesk from './Page/HelpDesk';
import HelpDeskTicket from './Page/HelpDesk/Ticket';
import RewardPoints from './Page/RewardPoints';
import CustomerRecentOrdered from 'src/simi/App/hairbowcenter/BaseComponents/Customer/RecentOrdered';

class CustomerLayout extends React.Component {

    constructor(props) {
        super(props);
        const width = window.innerWidth;
        const isPhone = width < 1024
        this.state = {
            page: 'dashboard',
            isPhone,
            firstname: '',
            customer: null
        }
        this.pushTo = '/';
    }

    setIsPhone() {
        const obj = this;
        window.onresize = function () {
            const width = window.innerWidth;
            const isPhone = width < 1024
            if (obj.state.isPhone !== isPhone) {
                obj.setState({ isPhone: isPhone })
            }
        }
    }

    getMenuConfig = () => {
        const menuConfig = [
            {
                title: 'My Account',
                url: '/account.html',
                page: 'dashboard',
                enable: true,
                sort_order: 10
            },
            {
                title: 'My Orders',
                url: '/orderhistory.html',
                page: 'my-order',
                enable: true,
                sort_order: 20
            },
            {
                title: 'My Downloadable Products',
                url: '/downloadable-product.html',
                page: 'downloadable',
                enable: true,
                sort_order: 30
            },
            {
                title: 'My Wish List',
                url: '/wishlist.html',
                page: 'wishlist',
                enable: true,
                sort_order: 40
            },
            {
                title: 'Wish List Sharing',
                url: '/share-wishlist.html',
                page: 'share-wishlist',
                enable: false,
                sort_order: 45
            },
            {
                title: 'Address Book',
                url: '/addresses.html',
                page: 'address-book',
                enable: true,
                sort_order: 50
            },
            {
                title: 'Edit Account Information',
                url: '/profile.html',
                page: 'edit-account',
                enable: true,
                sort_order: 60
            },
            {
                title: 'My Product Reviews',
                url: '/product-reviews.html',
                page: 'product-reviews',
                enable: true,
                sort_order: 70
            },
            {
                title: 'Reviews Detail',
                url: '/review-detail.html',
                page: 'review-detail',
                enable: false,
                sort_order: 75
            },
            {
                title: 'Newsletter Subscriptions',
                url: '/newsletter.html',
                page: 'newsletter',
                enable: true,
                sort_order: 80
            },
            {
                title: 'Help Desk',
                url: '/help-desk.html',
                page: 'help-desk',
                enable: true,
                sort_order: 90
            },
            {
                title: 'My Reward Points',
                url: '/reward-points.html',
                page: 'reward-points',
                enable: true,
                sort_order: 100
            },

        ]
        return menuConfig
    }

    handleToggleMenu = () => {
        $('.list-menu-item').slideToggle('fast')
        $('.menu-toggle').find('svg').toggleClass('hidden')
    }

    handleLink = (link) => {
        this.props.history.push(link)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.page || nextProps.page === prevState.page) {
            return null
        }
        return { page: nextProps.page }
    }

    redirectExternalLink = (url) => {
        if (url) {
            Identify.windowOpenUrl(url)
        }
        return null;
    }

    clickMenuItem = (url) => {
        if (window.innerWidth < 768) {
            this.handleToggleMenu();
        }
        this.handleLink(url);
    }

    renderMenu = () => {
        const { firstname, lastname } = this.props
        const menuConfig = this.getMenuConfig()
        const { page, isPhone } = this.state;
        const menu = menuConfig.map(item => {
            const active = item.page.toString().indexOf(page) > -1 || ((page === 'order-detail' && item.page === 'my-order') || (page === 'share-wishlist' && item.page === 'wishlist')) ? 'active' : '';

            return item.enable ?
                <MenuItem key={item.title}
                    onClick={() => this.clickMenuItem(item.url)}
                    className={`customer-menu-item ${item.page} ${active}`}>
                    <div className="menu-item-title">
                        {Identify.__(item.title)}
                    </div>
                </MenuItem> : null
        }, this)
        return (
            <div className="dashboard-menu">
                <div className="menu-header">
                    {isPhone &&
                        <React.Fragment>
                            <div className="welcome-customer">
                                {Identify.__("Welcome, %s").replace('%s', firstname + ' ' + lastname)}
                            </div>
                            {/* <div role="presentation" className="menu-logout" onClick={() => this.handleLink('/logout.html')}>
                                <div className="hidden-xs">{Identify.__('Log out')}</div>
                                <LogoutIcon color={`#D7282F`} style={{ width: 18, height: 18, marginRight: 8, marginLeft: 10 }} />
                            </div> */}
                        </React.Fragment>}
                    <div role="presentation" className="menu-toggle" onClick={() => this.handleToggleMenu()}>
                        <MenuIcon color={`#fff`} style={{ width: 30, height: 30, marginTop: 1 }} />
                        <CloseIcon className={`hidden`} color={`#fff`} style={{ width: 16, height: 16, marginTop: 7, marginLeft: 9, marginRight: 5 }} />
                    </div>
                </div>
                <div className="list-menu-item">
                    <MenuList className='list-menu-item-content'>
                        {menu}
                    </MenuList>
                </div>
                <CustomerRecentOrdered />
            </div>
        )
    }

    renderContent = () => {
        const { page } = this.state;
        const { firstname, lastname, email, extension_attributes } = this.props;
        const data = {
            firstname,
            lastname,
            email,
            extension_attributes
        }
        let content = null;
        switch (page) {
            case 'dashboard':
                content = <Dashboard customer={data} history={this.props.history} isPhone={this.state.isPhone} />
                break;
            case 'address-book':
                content = <AddressBook />
                break;
            case 'edit-account':
                content = <Profile data={data} history={this.props.history} isPhone={this.state.isPhone} />
                break;
            case 'my-order':
                content = <MyOrder data={data} isPhone={this.state.isPhone} history={this.props.history} />
                break;
            case 'newsletter':
                content = <Newsletter />
                break;
            case 'order-detail':
                content = <OrderDetail history={this.props.history} isPhone={this.state.isPhone} orderId={this.props.match.params.orderId} />
                break;
            case 'wishlist':
                content = <Wishlist history={this.props.history} />
                break;
            case 'share-wishlist':
                content = <ShareWishlist history={this.props.history} />
                break;
            case 'downloadable':
                content = <Downloadable history={this.props.history} />
                break;
            case 'product-reviews':
                content = <ProductReviews history={this.props.history} />
                break;
            case 'review-detail':
                content = <ReviewDetail history={this.props.history} reviewId={this.props.match.params.reviewId} />
                break;
            case 'help-desk':
                content = <HelpDesk history={this.props.history} orderId={this.props.match.params.orderId} />
                break;
            case 'help-desk-ticket':
                content = <HelpDeskTicket history={this.props.history} ticketId={this.props.match.params.ticketId} />
                break;
            case 'reward-points':
                content = <RewardPoints history={this.props.history} />
                break;
            case 'print':
                content = <OrderDetail history={this.props.history} isPhone={this.state.isPhone} print={true} match={this.props.match} />
                break;
            default:
                content = 'customer dashboard 2'
        }
        return content;
    }

    componentDidMount() {
        this.setIsPhone();
        $('body').addClass('body-customer-dashboard');
    }

    componentWillUnmount() {
        $('body').removeClass('body-customer-dashboard')
    }

    renderTitle = (pageT) => {
        const menuConfig = this.getMenuConfig();
        const titleT = menuConfig.find(({ page }) => page === pageT);
        if (pageT === 'order-detail' && this.props.match.params.hasOwnProperty('orderId')) {
            return <div className="page-title-wrapper">
                <h1 className="page-title">
                    <span className="base">{Identify.__("Order # ")} {this.props.match.params.orderId}</span>
                </h1>
                <span id="order-status" />
            </div>
        }

        if (pageT === 'help-desk-ticket' && this.props.match.params.hasOwnProperty('ticketId')) {
            return <div className="page-title-wrapper">
                <h1 className="page-title">
                    <span className="base" id="helpdesk-ticket-tt" />
                </h1>
            </div>
        }

        if (!titleT) return;
        return <div className="page-title-wrapper">
            <h1 className="page-title">
                <span className="base">{titleT.title}</span>
            </h1>
        </div>
    }

    render() {
        const { page, isPhone } = this.state;
        const { isSignedIn, history } = this.props
        this.pushTo = '/login.html';
        if (!isSignedIn) {
            history.push(this.pushTo);
            return ''
        }

        return (
            <React.Fragment>
                <div className={`customer-dashboard ${page}`} style={{ minHeight: window.innerHeight - 200 }}>
                    <div className='container'>
                        <div className="dashboard-layout">
                            {!isPhone && this.renderTitle(page)}
                            {page !== 'print' && this.renderMenu()}
                            {isPhone && this.renderTitle(page)}
                            <div className='dashboard-content'>
                                {this.renderContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>

        );
    }
}

const mapStateToProps = ({ user }) => {
    const { currentUser, isSignedIn } = user
    const { firstname, lastname, email } = currentUser;
    return {
        firstname,
        lastname,
        email,
        isSignedIn
    };
}

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps
    )
)(CustomerLayout);
