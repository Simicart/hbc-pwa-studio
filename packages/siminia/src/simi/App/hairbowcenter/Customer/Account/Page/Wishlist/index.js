import React, { useState } from 'react';
import { connect } from 'src/drivers';
import Identify from 'src/simi/Helper/Identify'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import Item from "./Item";
import { getWishlist, updateItemsToWishlist, addAllWlItemToCart } from 'src/simi/Model/Wishlist'
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { getCartDetails } from 'src/actions/cart';
import Pagination from 'src/simi/App/hairbowcenter/BaseComponents/Pagination';
import Loading from 'src/simi/BaseComponents/Loading'
import { hideFogLoading, showFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading'
import { smoothScrollToView } from 'src/simi/Helper/Behavior'
import EmptyData from './../../Components/EmptyData';

require("./index.scss");

const Wishlist = props => {
    const { history, toggleMessages, getCartDetails } = props
    const [data, setData] = useState(null)
    let loadData = false;

    const gotWishlist = (data) => {
        hideFogLoading()
        if (data.errors && data.errors.length) {
            const errors = data.errors.map(error => {
                return {
                    type: 'error',
                    message: error.message,
                    auto_dismiss: true
                }
            });
            toggleMessages(errors)
        } else {
            setData(data)
        }
    }

    const getWishlistItem = () => {
        getWishlist(gotWishlist, { limit: 9999, no_price: 1 })
    }

    if (!data && !loadData) {
        getWishlistItem()
    }

    const renderItem = (item, index) => {
        return (
            <div
                key={item.wishlist_item_id}
                className={`${index % 4 === 0 ? "first" : ""} siminia-wishlist-item`}
            >
                <Item
                    item={item}
                    lazyImage={true}
                    className={`${
                        index % 4 === 0 ? "first" : ""
                        }`}
                    showBuyNow={true}
                    parent={this}
                    getWishlist={getWishlistItem}
                    toggleMessages={toggleMessages}
                    getCartDetails={getCartDetails}
                    history={history}
                />
            </div>
        )
    }

    const updateWishList = () => {
        if (data && data.wishlistitems) {
            const { wishlistitems } = data;
            let params = [];
            for (let i = 0; i < wishlistitems.length; i++) {
                const itemI = wishlistitems[i];
                const { wishlist_item_id, description, qty } = itemI;
                const obj = {};
                const textD = $(`textarea[name="description[${wishlist_item_id}]"]`).val();
                const qtyI = $(`input#item-qty-${wishlist_item_id}`).val();
                if (qtyI && qtyI.length) {
                    obj['qty'] = qtyI;
                }
                if (textD && textD.trim().length) {
                    obj['description'] = textD.trim();
                }
                if (Object.keys(obj).length) {
                    obj['wishlist_item_id'] = wishlist_item_id;
                    params.push(obj)
                }
            }
            if (params.length) {
                showFogLoading();
                updateItemsToWishlist(gotWishlist, params)
            }
        }
    }

    const shareWishList = () => {
        const location = {
            pathname: '/share-wishlist.html',
            state: {data}
        }
        history.push(location);
    }

    const addAllToCart = () => {
        showFogLoading();
        addAllWlItemToCart(callbackAddAllItem);
    }

    const callbackAddAllItem = (data) => {
        hideFogLoading()
        if (data.errors && data.errors.length) {
            const errors = data.errors.map(error => {
                return {
                    type: 'error',
                    message: error.message,
                    auto_dismiss: true
                }
            });
            toggleMessages(errors)
        } else {
            if (data.message && data.message.length) {
                let errors = null
                if(data.message.length && data.message[0].indexOf('You need to choose options for your item.') !== -1) {
                    errors =
                        [{
                            type: 'error',
                            message: 'You need to choose options for your items.',
                            auto_dismiss: true
                        }]

                } else {
                    errors = data.message.map(success => {
                        return {
                            type: 'success',
                            message: success,
                            auto_dismiss: true
                        }
                    });
                }

                toggleMessages(errors)
            }
            setData(null)
            loadData = true;
            // console.log(data)
        }
    }

    let rows = null
    if (data && data.wishlistitems) {
        const { wishlistitems, total } = data
        if (total && wishlistitems && wishlistitems.length) {
            rows = (
                <Pagination
                    data={wishlistitems}
                    renderItem={renderItem}
                    itemsPerPageOptions={[8, 16, 32]}
                    limit={8}
                    itemCount={total}
                    changedPage={() => smoothScrollToView($('#root'))}
                    changeLimit={() => smoothScrollToView($('#root'))}
                    wishlist={true}
                    updateWishList={updateWishList}
                    shareWishList={shareWishList}
                    addAllToCart={addAllToCart}
                />
            )
        }else{
            rows = null;
        }
    } else {
        rows = <Loading />
    }
    return (
        <div className="account-my-wishlist">
            {TitleHelper.renderMetaHeader({
                title: Identify.__('My Wish List')
            })}
            <div className="account-favourites">
                <div className="product-grid">
                    {rows ? rows : (
                        <div className="no-product">
                            <EmptyData message={Identify.__("There are no products matching the selection")} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = {
    toggleMessages,
    getCartDetails
}
export default connect(
    null,
    mapDispatchToProps
)(Wishlist);
