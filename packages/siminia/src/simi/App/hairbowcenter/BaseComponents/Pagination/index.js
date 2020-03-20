import React from 'react';
import PropTypes from 'prop-types';
import Identify from 'src/simi/Helper/Identify';
import { smoothScrollToView } from 'src/simi/Helper/Behavior'
require('./pagination.scss')
const imgBgSelect = require('./images/select-bg.svg');

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: this.props.currentPage,
            limit: this.props.limit,
            data: this.props.data,
            itemCount: this.props.itemCount
        }
        this.startPage = this.props.currentPage > 3 ? this.props.currentPage - 2 : 1;
        this.endPage = this.startPage + 4;
    }

    changePage(event) {
        const { currentPage } = this.state
        this.setState({
            currentPage: Number(event.target.id)
        });
        if (this.props.scrollEffect) smoothScrollToView($(this.props.scrollEffect))
        if (this.props.changedPage) {
            if (currentPage > 3 && currentPage <= this.endPage) {
                this.startPage = this.currentPage - 2;
                this.endPage = this.currentPage + 2
            }
            this.props.changedPage(event.target.id)
        }
    }

    changeLimit = (event) => {
        this.startPage = 1;
        this.endPage = this.startPage + 3;
        this.setState({
            limit: Number(event.target.value),
            currentPage: 1
        });
        if (this.props.changeLimit) {
            this.props.changeLimit(event.target.value)
        }
    };

    renderItem = (item, index) => {
        return this.props.renderItem(item, index)
    };

    handleChangePage = (next = true) => {
        const currentPage = next ? this.state.currentPage + 1 : this.state.currentPage - 1;
        // if (currentPage > this.endPage) {
        //     this.startPage = this.startPage + 1;
        //     this.endPage = this.endPage + 1;
        // } else if (currentPage < this.startPage) {
        //     this.startPage = this.startPage - 1;
        //     this.endPage = this.endPage - 1;
        // }
        if (currentPage > 3 && currentPage <= this.endPage) {
            this.startPage = this.state.currentPage - 2;
            this.endPage = this.state.currentPage + 2
        }
        this.setState({
            currentPage: currentPage
        })
        if (this.props.scrollEffect) smoothScrollToView($(this.props.scrollEffect))
        if (this.props.changedPage) {
            this.props.changedPage(event.target.id)
        }
    }

    renderPageNumber = (total) => {
        // Logic for displaying page numbers
        if (!this.props.showPageNumber) return null;
        const pageNumbers = [];
        const totalItem = total;
        const { classes, showPerPageOptions } = this.props
        total = Math.ceil(total / this.state.limit);
        const endpage = this.endPage > total ? total : this.endPage
        for (let i = this.startPage; i <= endpage; i++) {
            pageNumbers.push(i);
        }

        const obj = this;
        const renderPageNumbers = pageNumbers.map(number => {
            let active = number === obj.state.currentPage ? 'page-number-active' : ''
            return (
                <li
                    role="presentation"
                    key={number}
                    id={number}
                    onClick={(e) => this.changePage(e)}
                    className={`page-number ${active}`}
                >
                    {number}
                </li>
            );
        });
        const option_limit = [];
        if (this.props.itemsPerPageOptions) {
            this.props.itemsPerPageOptions.map((item) => {
                option_limit.push(<option key={Identify.randomString(5)} value={item} onBlur={this.renderItem}>{item}</option>);
                return null
            }
            );
        }
        const pagesSelection = (total > 1) ? (
            <ul id="page-numbers" classes="pagination-items">
                {this.state.currentPage > this.startPage && <li role="presentation" className="icon-page-number icon-next" onClick={() => this.handleChangePage(false)}></li>}
                {renderPageNumbers}
                {this.state.currentPage < total && <li role="presentation" className="icon-page-number icon-back" onClick={() => this.handleChangePage(true)}></li>}
            </ul>
        ) : '';
        const { currentPage, limit } = this.state;
        let lastItem = currentPage * limit;
        const firstItem = lastItem - limit + 1;
        lastItem = lastItem > totalItem ? totalItem : lastItem;
        const itemsPerPage = (
            <div className={classes["items-per-page"]} style={{ marginLeft: 'auto' }}>
                {
                    this.props.showInfoItem &&
                    <span style={{ marginRight: 10, fontSize: 16 }}>
                        {Identify.__('Items %a - %b of %c').replace('%a', firstItem).replace('%b', lastItem).replace('%c', totalItem)}
                    </span>
                }
                {showPerPageOptions && <span style={{ fontWeight: 400, color: "#777" }}>{Identify.__('Show')}</span>}
                {showPerPageOptions && <span className={classes["items-per-page-select"]} style={{
                    margin: '0 5px',
                    background: 'none'
                }}>
                    <select
                        value={this.state.limit}
                        id="limit"
                        onBlur={() => { }}
                        onChange={(e) => this.changeLimit(e)}
                        style={{
                            border: 'none',
                            borderRadius: '0',
                            borderBottom: 'solid #2d2d2d 1px',
                            fontSize: 14,
                            backgroundImage: `url(${imgBgSelect})`
                        }}
                    >
                        {option_limit}
                    </select>
                </span>}
            </div>
        );

        return (
            <div className="pagination">
                {pagesSelection}
                {(showPerPageOptions || this.props.showInfoItem) && itemsPerPage}
            </div>
        )
    };

    renderPagination = () => {
        //handle the case itemCount changed from parent
        if (this.props.itemCount !== this.state.itemCount) {
            this.setState({
                currentPage: 1,
                limit: this.props.limit,
                data: this.props.data,
                itemCount: this.props.itemCount
            })
        }

        const { data, currentPage, limit, itemCount } = this.state;
        const { classes, wishlist } = this.props;
        if (data.length > 0) {
            // Logic for displaying current todos
            const indexOfLastTodo = currentPage * limit;
            const indexOfFirstTodo = indexOfLastTodo - limit;
            const currentReview = data.slice(indexOfFirstTodo, indexOfLastTodo);
            const obj = this;
            const items = currentReview.map((item, index) => {
                return obj.renderItem(item, index);
            });
            const total = data.length;
            return (
                <div className={classes["list-items"]}>
                    {items}
                    {wishlist && <div className="wishlist-toolbar-actions">
                        <button onClick={() => this.props.updateWishList()} className="update-wishlist">{Identify.__("Update Wish List")}</button>
                        <button onClick={() => this.props.shareWishList()} className="save-share-wishlist">{Identify.__("Share Wish List")}</button>
                        <button onClick={() => this.props.addAllToCart()} className="all-tocart-wishlist">{Identify.__("Add All to Cart")}</button>
                    </div>}
                    {this.renderPageNumber(total)}
                </div>
            )
        } else if (itemCount > 0) {
            this.renderItem();
            return (
                <div className={classes["list-items"]}>
                    {this.renderPageNumber(itemCount)}
                </div>
            )
        }
        return <div></div>
    }

    render() {
        return this.renderPagination();
    }
}
/*
data OR itemCount is required to calculate pages count
 */

Pagination.defaultProps = {
    currentPage: 1,
    limit: 5,
    data: [],
    itemCount: 0,
    itemsPerPageOptions: [5, 10, 15, 20],
    table: false,
    showPageNumber: true,
    showInfoItem: true,
    showPerPageOptions: true,
    classes: {},
    scrollEffect: false
};
Pagination.propTypes = {
    currentPage: PropTypes.number,
    limit: PropTypes.number,
    data: PropTypes.array,
    renderItem: PropTypes.func,
    itemCount: PropTypes.number,
    itemsPerPageOptions: PropTypes.array,
    classes: PropTypes.object,
    changedPage: PropTypes.func,
    changeLimit: PropTypes.func,
};
export default Pagination;
