import React, { Suspense } from 'react'
import Identify from "src/simi/Helper/Identify";
import ToastMessage from 'src/simi/BaseComponents/Message/ToastMessage'
import TopMessage from 'src/simi/BaseComponents/Message/TopMessage'
import NavTrigger from './Component/navTrigger'
import CartTrigger from './cartTrigger'
import defaultClasses from './header.css'
import { mergeClasses } from 'src/classify'
import { Link } from 'src/drivers';
import MyAccount from './Component/MyAccount'
import { withRouter } from 'react-router-dom';
import { logoUrl } from 'src/simi/Helper/Url'
import HeaderLeft from './Component/HeaderLeft';
import HeaderWelcome from './Component/HeaderWelcome';
import Image from 'src/simi/BaseComponents/Image'
import Banner from 'src/simi/App/hairbowcenter/BaseComponents/Blocks/AdsBanner'

require('./header.scss');

const $ = window.$;
const SearchForm = React.lazy(() => import('./Component/SearchForm'));

class Header extends React.Component {
    constructor(props) {
        super(props);
        const isPhone = window.innerWidth < 768;
        this.state = { isPhone }
        this.classes = mergeClasses(defaultClasses, this.props.classes)

        this.merchantConfig = Identify.getStoreConfig();
    }

    setMinPhone = () => {
        const width = window.innerWidth;
        const isPhone = width < 768;
        if (this.state.isPhone !== isPhone) {
            this.setState({ isPhone })
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.setMinPhone);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setMinPhone);
    }

    renderLogo = () => {
        return (
            <Link to='/'>
                <strong className="logo">
                    <Image src={logoUrl()} alt={Identify.__("HairBow Center")} width={241} height={85} />
                </strong>
            </Link>
        )
    }

    renderSearchForm = () => {
        return (
            <div className="block block-search">
                <Suspense fallback={null}>
                    <SearchForm
                        history={this.props.history}
                    />
                </Suspense>
            </div>
        )
    }

    handleOnpenFormSearch = () => {
        if ($('.block.block-search').hasClass('open')) {
            $('.block.block-search').removeClass('open')
        } else {
            $('.block.block-search').addClass('open')
        }

    }

    renderViewPhone = () => {
        const { history } = this.props;
        let renderCart = true
        if (history.location && history.location.pathname === '/checkout.html') {
            renderCart = false
        }
        return (
            <div>
                <div className="page-header type11">
                    <div className="container">
                        <NavTrigger />
                        {this.renderLogo()}
                        <div className="minicart-wrapper">
                            {renderCart && <CartTrigger />}
                        </div>
                        <div className="search-icon" onClick={this.handleOnpenFormSearch}></div>
                    </div>
                </div>

                {this.renderSearchForm()}
                <div id="id-message">
                    <TopMessage />
                    <ToastMessage />
                </div>
            </div>
        )
    }

    renderEasyBanner = () => {
        const {simiStoreConfig} = Identify.getStoreConfig() || {};
        if(simiStoreConfig && simiStoreConfig.config) {
            let headerLeftBanner = null;
            let easyBanners = null;
            if(
                simiStoreConfig.config.easy_banners 
                && simiStoreConfig.config.easy_banners.items
                && simiStoreConfig.config.easy_banners.items instanceof Array
            ) {
                easyBanners = simiStoreConfig.config.easy_banners.items;
            }

            if(simiStoreConfig.config.header_configs && simiStoreConfig.config.header_configs.left_banner) {
                headerLeftBanner = simiStoreConfig.config.header_configs.left_banner
            }

            if(headerLeftBanner && easyBanners) {
                const data = easyBanners.find(banner => banner.identifier === headerLeftBanner)
                if(data) {
                    return (
                        <div className="placeholder-header-banner">
                            <Banner data={data}/>
                        </div>
                    )
                }
            }
        } 

        return null;
    }

    renderTopBar = () => {
        const { classes } = this;

        return <div className="panel wrapper">
            <div className="panel header">
                <ul className="header links">
                    <HeaderWelcome />
                    <MyAccount classes={classes} />
                </ul>
                <HeaderLeft />
                {this.renderEasyBanner()}
            </div>
        </div>
    }

    renderMiddleHeader = () => {
        return <div className="header content">
            {this.renderLogo()}
            <div className="minicart-wrapper">
                <CartTrigger history={this.props.history} />
            </div>
            {this.renderSearchForm()}
            <div className="custom-block"><p><button style={{ backgroundColor: '#666' }} onClick={() => this.props.history.push('/checkout.html')} type="button"><span style={{ fontSize: '16px', color: '#fff' }}>{Identify.__("CHECKOUT")}</span></button></p></div>
        </div>
    }



    render() {
        this.classes = mergeClasses(defaultClasses, this.props.classes);
        if (this.state.isPhone) {
            return this.renderViewPhone()
        }

        return (
            <React.Fragment>
                <header className="page-header type11">
                    {this.renderTopBar()}
                    {this.renderMiddleHeader()}
                </header>
            </React.Fragment>
        )
    }
}
export default (withRouter)(Header)
