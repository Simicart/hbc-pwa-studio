import React from 'react';
import Gallery from './Gallery';
import defaultClasses from './products.css';
import Identify from 'src/simi/Helper/Identify'
import Sortby from './Sortby'
import Filter from './Filter'
import Pagination from 'src/simi/App/hairbowcenter/BaseComponents/Pagination'
import Loading from 'src/simi/BaseComponents/Loading'
import classify from 'src/classify';
import ReactHTMLParser from 'react-html-parser';
import CustomBlock1 from './../Blocks/CustomBlock1';
import BlogRating from './../Blocks/BlogRating';
import AdsBanner from './../Blocks/AdsBanner';
import RatingList from './../Blocks/RatingList';
import CategoryHeader from './../../RootComponents/Category/categoryHeader'
import { resourceUrl } from 'src/simi/Helper/Url'
import CloseIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/Close';
import SubCategories from './SubCategories';

require("./products.scss");
const $ = window.$;

class Products extends React.Component {

    constructor(props) {
        super(props);
        const isPhone = window.innerWidth < 1024
        this.state = ({ isPhone: isPhone })
        this.setIsPhone()
    }

    setIsPhone() {
        const obj = this;
        $(window).resize(function () {
            const width = window.innerWidth;
            const isPhone = width < 1024;
            if (obj.state.isPhone !== isPhone) {
                obj.setState({ isPhone })
            }
        })
    }

    renderFilter() {
        const { props } = this
        const { data, filterData } = props;
        if (data && data.products &&
            data.products.filters) {
            return (
                <div>
                    <Filter data={data.products.filters} filterData={filterData} />
                </div>
            );
        }
    }

    drawerLeftNav = () => {
        $(document).ready(function () {
            $('.left-nav-filter-mobile').css({ width: '250px' });
        })
    }

    closeLeftNav = () => {
        $(document).ready(function () {
            $('.left-nav-filter-mobile').css({ width: 0 });
        })
    }

    deleteFilter(attribute) {
        const { history, location, filterData } = this.props
        const { search } = location;
        const filterParams = filterData ? filterData : {}
        delete filterParams[attribute]
        const queryParams = new URLSearchParams(search);
        queryParams.set('filter', JSON.stringify(filterParams));
        history.push({ search: queryParams.toString() });
    }

    clearFilter() {
        const { history, location } = this.props
        const { search } = location;
        const queryParams = new URLSearchParams(search);
        queryParams.delete('filter');
        history.push({ search: queryParams.toString() });
    }

    filteredData = () => {
        const { data, filterData } = this.props;
        const fBy = [];
        if (data && data.products && data.products.filters && filterData) {
            const filterItems = data.products.filters;
            for (const key in filterData) {
                const filtered = filterItems.find(({ request_var }) => request_var === key);
                if (filtered) {
                    const { name, filter_items, request_var } = filtered;
                    if (filter_items && filter_items.length) {
                        const filteredChild = filter_items.find(({ value_string }) => value_string === filterData[key]);
                        if (filteredChild) {
                            const childName = filteredChild.label;
                            fBy.push(<span className="mb-child-filtered" onClick={() => this.deleteFilter(request_var)}>{name + '/' + childName} <CloseIcon style={{ width: 10, height: 10 }} /></span>)
                        }
                    }
                }
            }
            fBy.push(<span className="mb-filtered-clear-all" onClick={() => this.clearFilter()}>{Identify.__("Clear all")}</span>)
        }
        return <div className="mb-filtered-container">{fBy}</div>
    }

    renderLeftNavigation = (classes) => {
        const shopby = [];
        const filter = this.renderFilter();
        const { isPhone } = this.state;
        if (filter) {
            shopby.push(
                <React.Fragment key={Identify.randomString(3)}>
                    {isPhone && this.filteredData()}
                    {isPhone && <strong className="filter-btn-mobile" onClick={() => this.drawerLeftNav()}>{Identify.__("Filter")}</strong>}
                    <div
                        key="siminia-left-navigation-filter"
                        className={`${classes["left-navigation"]} ${isPhone ? 'left-nav-filter-mobile' : ''}`} >
                        {filter}
                        {!isPhone && !this.props.search ? this.renderCustomArea() : <span role="presentation" className="btn-close-filter-nav" onClick={() => this.closeLeftNav()}><CloseIcon style={{ width: 13, height: 13 }} /></span>}
                    </div>
                </React.Fragment>
            );
        }
        return shopby;
    }

    renderCustomArea = () => {
        let supportBlock = null;
        let bannerBlock = null;
        let blogRating = null;
        let ratingList = null;

        const merchantConfigs = Identify.getStoreConfig();
        if (merchantConfigs && merchantConfigs.simiStoreConfig && merchantConfigs.simiStoreConfig.config) {
            const { config } = merchantConfigs.simiStoreConfig;
            if (config.hasOwnProperty('shop_support')) {
                const { shop_support } = config;
                supportBlock = <CustomBlock1 data={shop_support} />
            }

            if (config.hasOwnProperty('category_banners') && config.hasOwnProperty('easy_banners') && config.easy_banners.totalRecords > 0) {
                const { category_banners, easy_banners } = config;
                bannerBlock = category_banners.length && category_banners.map((dt, idx) => {
                    const easyItemCate = easy_banners.items.filter(({ identifier }) => identifier === dt);
                    if (easyItemCate.length) {
                        return <AdsBanner key={idx} style={{ marginBottom: '0.9rem' }} data={easyItemCate[0]} />
                    } else {
                        return null;
                    }
                });
            }

            if (config.hasOwnProperty('shopper_reviews')) {
                const { shopper_reviews } = config;
                blogRating = <BlogRating data={shopper_reviews} type="product_list" />
            }

            if (config.hasOwnProperty('category_featured_products')) {
                const { category_featured_products } = config;
                ratingList = <RatingList data={category_featured_products} />
            }
        }

        return <React.Fragment>
            {blogRating}
            {supportBlock}
            {ratingList}
            {bannerBlock}
        </React.Fragment>
    }

    renderItem = () => {
        const { pagination, paginationB } = this
        const { history, location, currentPage, pageSize } = this.props
        if (
            pagination &&
            pagination.state &&
            pagination.state.limit &&
            pagination.state.currentPage &&
            (pagination.state.limit !== pageSize ||
                pagination.state.currentPage !== currentPage)) {
            const { search } = location;
            const queryParams = new URLSearchParams(search);
            queryParams.set('product_list_limit', pagination.state.limit);
            queryParams.set('page', pagination.state.currentPage);
            history.push({ search: queryParams.toString() });
        }

        if (
            paginationB &&
            paginationB.state &&
            paginationB.state.limit &&
            paginationB.state.currentPage &&
            (paginationB.state.limit !== pageSize ||
                paginationB.state.currentPage !== currentPage)) {
            const { search } = location;
            const queryParams = new URLSearchParams(search);
            queryParams.set('product_list_limit', paginationB.state.limit);
            queryParams.set('page', paginationB.state.currentPage);
            history.push({ search: queryParams.toString() });
        }
    };

    setModelMode = (mode) => {
        $(document).ready(function () {
            Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'product_list_mode', mode);
            let modelBar = $('.models-bar');
            let productWrap = $('.products.wrapper');
            if (mode === 'grid') {
                modelBar.find('.mode-list').removeClass('active')
                modelBar.find('.mode-grid').addClass('active')
                productWrap.removeClass('list products-list')
                productWrap.addClass('grid columns4 flex-grid products-grid')
            } else {
                modelBar.find('.mode-grid').removeClass('active')
                modelBar.find('.mode-list').addClass('active')
                productWrap.addClass('list products-list')
                productWrap.removeClass('grid columns4 flex-grid products-grid')
            }
        });
    }

    renderSwitchTypes = () => {
        const list_type = Identify.ApiDataStorage('product_list_mode') || 'grid';

        return <div className="models-bar">
            <strong className={`models-mode mode-grid ${list_type === 'grid' ? 'active' : ''}`} onClick={() => this.setModelMode('grid')} title={Identify.__("Grid")}>
                <span>Grid</span>
            </strong>
            <strong className={`models-mode mode-list ${list_type === 'list' ? 'active' : ''}`} onClick={() => this.setModelMode('list')} title={Identify.__("List")}>
                <span>List</span>
            </strong>
        </div>
    }

    renderList = (classes) => {
        const { props } = this
        const { data, pageSize, history, location, sortByData, currentPage } = props;
        const items = data ? data.products.items : null;
        if (!data)
            return <Loading />
        if (!data.products || !data.products.total_count)
            return (<div className={classes['no-product']}>{Identify.__('No product found')}</div>)

        return (
            <React.Fragment>
                <div className="top-toolbar">
                    <Sortby classes={classes}
                        parent={this}
                        data={data}
                        sortByData={sortByData}
                    />
                    {this.renderSwitchTypes()}
                    <div className={`${classes['product-grid-pagination']} product-grid-pagination product-grid-pag-top`}>
                        <Pagination
                            renderItem={this.renderItem.bind(this)}
                            itemCount={data.products.total_count}
                            limit={pageSize}
                            currentPage={currentPage}
                            itemsPerPageOptions={[20, 60, 120]}
                            showInfoItem={false}
                            // showPageNumber={false}
                            ref={(page) => { this.paginationB = page }} />
                    </div>
                </div>
                <section className={classes.gallery}>
                    <Gallery data={items} pageSize={pageSize} history={history} location={location} />
                </section>
                <div className={`${classes['product-grid-pagination']} product-grid-pagination`} style={{ marginBottom: 20, clear: "both" }}>
                    <Pagination
                        renderItem={this.renderItem.bind(this)}
                        itemCount={data.products.total_count}
                        limit={pageSize}
                        currentPage={currentPage}
                        itemsPerPageOptions={[20, 60, 120]}
                        showInfoItem={false}
                        ref={(page) => { this.pagination = page }} />
                </div>
                {this.state.isPhone && !this.props.search && <div className="hairbow-custom-list-block">{this.renderCustomArea()}</div>}
            </React.Fragment>
        )
    }

    render() {
        const { props } = this
        const { data, classes, description, categoryImage, title, cateId } = props;
        const styleH = this.state.isPhone ? {} : { width: '75%', display: 'inline-block' };

        return (
            <article className={classes.root}>
                <div className={classes["product-list-container-siminia"]}>
                    {this.renderLeftNavigation(classes)}
                    <div style={styleH}>
                        <SubCategories cateId={cateId} />
                        {
                            categoryImage &&
                            <CategoryHeader
                                name={title}
                                image_url={resourceUrl(categoryImage, { type: 'image-category' })}
                            />
                        }
                        <div className="category-description">{ReactHTMLParser(description)}</div>
                        {this.renderList(classes)}
                    </div>
                </div>
            </article>
        );
    }
};

export default classify(defaultClasses)(Products);
