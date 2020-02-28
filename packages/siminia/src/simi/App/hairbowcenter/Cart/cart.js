import React, { Component } from 'react';
import { connect } from 'src/drivers';
import { bool, object, shape, string } from 'prop-types';
import {
    getCartDetails,
    updateItemInCart,
} from 'src/actions/cart';
import { isEmptyCartVisible } from 'src/selectors/cart';
import BreadCrumb from "src/simi/BaseComponents/BreadCrumb"
import Loading from 'src/simi/BaseComponents/Loading'
import Identify from 'src/simi/Helper/Identify'
import CartItem from './cartItem'
import Total from 'src/simi/BaseComponents/Total'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import {removeItemFromCart} from 'src/simi/Model/Cart'
import {updateRewards} from 'src/simi/App/hairbowcenter/Model/Cart'
import Coupon from '../BaseComponents/Coupon';
import { Link } from 'react-router-dom';
import CrossSellProducts from './CrossSellProducts';
import Summary from './Summary';
import CartTooltip from './cartTooltip';
require('./cart.scss')
const $ = window.$;

class Cart extends Component {
    constructor(...args) {
        super(...args)
        const isPhone = window.innerWidth < 1024
        this.type = null
        this.state = {
            isPhone: isPhone,
            focusItem: null,
            rewardPoint: null
        };
    }

    setIsPhone(){
        const obj = this;
        window.onresize = function () {
            const width = window.innerWidth;
            const isPhone = width < 1024
            if(obj.state.isPhone !== isPhone){
                obj.setState({isPhone: isPhone})
            }
        }
    }

    componentDidMount() {
        showFogLoading()
        this.setIsPhone()
        const { getCartDetails } = this.props;
        getCartDetails();
        this.updateRewardsPoint();
    }

    shouldComponentUpdate(nextProps){
        if (this.showAPIloading(nextProps)) {
            showFogLoading()
            return false
        }
        if(this.type === 'delete' || this.type === 'update') {
            this.updateRewardsPoint();
        }
        hideFogLoading()
        return true
    }

    updateRewardsPoint = () => {
        if(this.props.isSignedIn) {
            this.type = null
            updateRewards(this.callBackUpdateRewards);
        }
    }

    callBackUpdateRewards = (data) => {
        this.setState({rewardPoint: data})
    }

    showAPIloading = (props) => {
        const { cart } = props;
        if (cart && cart.isUpdatingItem)
            return true
        return false
    }

    updateCart = () => {
        const { cart } = this.props;
        for (const i in cart.details.items) {
            const item = cart.details.items[i];
            const quantity = $(`#cart-quantity-${item.item_id}`).val();
            const payload = {
                item,
                quantity
            }
            this.type = 'update'
            this.props.updateItemInCart(payload, item.item_id);
        }
    }

    get cartId() {
        const { cart } = this.props;

        return cart && cart.details && cart.details.id;
    }

    get cartCurrencyCode() {
        const { cart } = this.props;
        return (
            cart &&
            cart.details &&
            cart.details.currency &&
            cart.details.currency.quote_currency_code
        );
    }

    get productList() {
        const { cart } = this.props;
        if (!cart)
            return
        const { cartCurrencyCode, cartId } = this;
        const borderItemStyle = Identify.isRtl() ? {borderLeft: 'solid #DCDCDC 1px'} : {borderRight: 'solid #DCDCDC 1px'};
        if (cartId) {
            const obj = [];
            obj.push(
               <thead>
                   <tr>
                       <th className="col item"><span>Item</span></th>
                       <th className="col price"><span>Price</span></th>
                       <th className="col qty"><span>Qty</span></th>
                       <th className="col subtotal"><span>Subtotal</span></th>
                   </tr>
               </thead>
            );
            for (const i in cart.details.items) {
                const item = cart.details.items[i];
                let itemTotal = null
                if (cart.totals && cart.totals.items) {
                    cart.totals.items.every(function(total) {
                        if (total.item_id === item.item_id) {
                            itemTotal = total
                            return false
                        }
                        else return true
                    })
                }
                if (itemTotal) {
                    const element = <CartItem
                        key={item.item_id}
                        item={item}
                        isPhone={this.state.isPhone}
                        currencyCode={cartCurrencyCode}
                        itemTotal={itemTotal}
                        removeFromCart={this.removeFromCart.bind(this)}
                        history={this.props.history}
                        handleLink={this.handleLink.bind(this)}/>;
                    obj.push(element);
                }
            }
            return (
                <div className='cart table-wrapper'>
                    <table className="cart-items-data-table">
                        {obj}
                    </table>
                </div>
            );
        }
    }

    get totalsSummary() {
        const { cart } = this.props;
        const { cartCurrencyCode } = this;
        if (!cart.totals)
            return
        return (<Total data={cart.totals} currencyCode={cartCurrencyCode} />)
    }


    get total() {
        const { totalsSummary } = this;

        return (
            <div>
                <div className={`summary ${Identify.isRtl() ? 'summary-cart-rtl' : ''}`}>{totalsSummary}</div>
            </div>
        );
    }

    get breadcrumb() {
        return <BreadCrumb breadcrumb={[{name:'Home',link:'/'},{name:'Basket',link:'/checkout/cart'}]}/>
    }

    handleLink(link) {
        this.props.history.push(link)
    }

    handleBack() {
        this.props.history.goBack()
    }

    handleGoCheckout() {
        this.props.history.push('/checkout.html')
    }

    removeFromCart(item) {
        if (confirm(Identify.__("Are you sure?")) === true) {
            showFogLoading()
            this.type = 'delete';
            removeItemFromCart(()=>{this.props.getCartDetails()},item.item_id, this.props.isSignedIn)
        }
    }

    get couponView () {
        const { cart, toggleMessages, getCartDetails } = this.props;
        let value = "";
        if (cart.totals.coupon_code) {
            value = cart.totals.coupon_code;
        }

        const childCPProps = {
            value,
            toggleMessages,
            getCartDetails
        }
        return <Coupon {...childCPProps} />
    }

    get cartInner() {
        const { productList, props, couponView, updateCart } = this;
        const { cart: { isLoading }, isCartEmpty,cart, isSignedIn, toggleMessages, updateItemInCart, getCartDetails } = props;

        if (isCartEmpty || !cart.details || !parseInt(cart.details.items_count)) {
            if (isLoading)
                return <Loading />
            else
                return (
                    <div className='cart-page-siminia'>
                        <div className='empty-cart'>
                            <p>{Identify.__('You have no items in your shopping cart')}</p>
                            <p>Click <Link to='/'>here</Link> to continue shopping</p>
                        </div>
                    </div>
                );
        }

        if (isLoading)
            showFogLoading()
        else
            hideFogLoading()

        return (
            <React.Fragment>
                {/* {this.state.isPhone && this.breadcrumb} */}
                <div className="cart-container">
                    {isSignedIn && <CartTooltip reward={this.state.rewardPoint}/>}
                    {
                        !this.state.isPhone 
                        ? <div className={`form-cart body ${Identify.isRtl() ? 'body-cart-rtl' : ''}`}>
                            {productList}
                            <div className="cart main-actions">
                                <button className="action update" onClick={updateCart}><span>{Identify.__('Update Cart')}</span></button>
                            </div>
                        </div> : <Summary
                            rewardPoint={this.state.rewardPoint}
                            totals={cart.totals}
                            cartId={cart.cartId}
                            isSignedIn={isSignedIn}
                            history={this.props.history}
                            getCartDetails={getCartDetails}
                        />
                    }
                    {
                        this.state.isPhone 
                        ? <div className={`form-cart body ${Identify.isRtl() ? 'body-cart-rtl' : ''}`}>
                            {productList}
                            <div className="cart main-actions">
                                <button className="action update" onClick={updateCart}><span>{Identify.__('Update Cart')}</span></button>
                            </div>
                        </div> : <Summary
                            rewardPoint={this.state.rewardPoint}
                            totals={cart.totals}
                            cartId={cart.cartId}
                            isSignedIn={isSignedIn}
                            history={this.props.history}
                            getCartDetails={getCartDetails}
                        />
                    }
                    {couponView}
                    <CrossSellProducts
                        cartId={cart.details.id}
                        handleLink={this.handleLink}
                        toggleMessages={toggleMessages}
                        updateItemInCart={updateItemInCart}
                    />
                </div>

            </React.Fragment>
        );
    }

    render() {
        return (
            <div className="container cart-page">
                {TitleHelper.renderMetaHeader({
                    title:Identify.__('Shopping Cart')
                })}
                <div className="cart-page-title-wrapper">
                    <h1 className="page-title">
                        <span>Shopping Cart</span>
                    </h1>
                </div>
                {this.cartInner}
            </div>
        );
    }
}

Cart.propTypes = {
    cart: shape({
        details: object,
        cartId: string,
        totals: object,
        isLoading: bool,
        isUpdatingItem: bool
    }),
    isCartEmpty: bool
}

const mapStateToProps = state => {
    const { cart, user } = state;
    const { isSignedIn } = user;
    return {
        cart,
        isCartEmpty: isEmptyCartVisible(state),
        isSignedIn,
    };
};

const mapDispatchToProps = {
    getCartDetails,
    toggleMessages,
    updateItemInCart,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Cart);
