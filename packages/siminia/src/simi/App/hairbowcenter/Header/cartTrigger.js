import React, { Component } from 'react';
import { connect } from 'src/drivers';
import PropTypes from 'prop-types';
import { toggleCart, getCartDetails, updateItemInCart } from 'src/actions/cart';
import MiniCart from './MiniCart';
import { removeItemFromCart } from 'src/simi/Model/Cart';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import Identify from "src/simi/Helper/Identify";
require('./cartTrigger.scss');
const $ = window.$;

class Trigger extends Component {
    static propTypes = {
        children: PropTypes.node,
        toggleCart: PropTypes.func.isRequired,
        itemsQty: PropTypes.number
    };

    constructor(props) {
        super(props);

        this.setMiniCartRef = this.setMiniCartRef.bind(this);
        this.handleClickOutsideMiniCart = this.handleClickOutsideMiniCart.bind(this);
    }

    renderJs() {
        $(document).ready(function () {
            const miniWrap = $('.minicart-wrapper ');
            miniWrap.find('.counter.qty').unbind().click(function () {
                miniWrap.find('.block-minicart').slideToggle();
            })
        });
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutsideMiniCart);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutsideMiniCart);
    }

    showAPIloading = (props) => {
        const { cart } = props;
        if (cart && cart.isUpdatingItem)
            return true
        return false
    }

    shouldComponentUpdate(nextProps){
        if (this.showAPIloading(nextProps)) {
            showFogLoading()
            return false
        }

        hideFogLoading()
        return true
    }

    setMiniCartRef(node) {
        this.miniCartRef = node;
    }

    handleClickOutsideMiniCart(event) {
        if (this.miniCartRef && !this.miniCartRef.contains(event.target)) {
            const miniWrap = $('.minicart-wrapper');
            if (miniWrap.find('.block-minicart').is(":visible")) {
                miniWrap.find('.block-minicart').slideUp();
            }
        }
    }

    removeItem = (item) => {
        if (confirm(Identify.__("Are you sure to remove item?")) === true) {
            showFogLoading();
            $(`#mini-cart-item-${item.item_id}`).hide();
            removeItemFromCart(() => this.props.getCartDetails(), item.item_id, this.props.user.isSignedIn)
        }
    }

    updateItem = (qty, item) => {
        if (item) {
            const payload = {
                item,
                quantity: qty
            }
            showFogLoading();
            this.props.updateItemInCart(payload, item.item_id);
        }

    }

    render() {
        const {
            cart: { details },
        } = this.props;
        const itemsQty = details.items_qty;

        return (
            <div className="action showcart" ref={this.setMiniCartRef}>
                {this.renderJs()}
                <span className="counter qty">
                    <span className="counter-number">{itemsQty ? itemsQty : 0}</span>
                </span>
                <MiniCart removeItem={this.removeItem} updateItem={this.updateItem} cart={this.props.cart} />

            </div>
        )
    }
}

const mapStateToProps = ({ cart, user }) => ({ cart, user });

const mapDispatchToProps = {
    toggleCart,
    getCartDetails,
    updateItemInCart
};

export default connect(mapStateToProps, mapDispatchToProps)(Trigger);
