import React from 'react'
import Identify from "src/simi/Helper/Identify"
import { Link } from 'src/drivers';
require("./HeaderNavigation.scss");
const $ = window.$;

class Navigation extends React.Component {

    renderJs = () => {
        $(document).ready(function () {
            window.onscroll = function () { myFunction() };

            var header = document.getElementById("hairbow-header");
            var sticky = header.offsetTop;

            function myFunction() {
                if (window.pageYOffset > sticky && window.innerWidth >= 768) {
                    header.classList.add("sticky");
                    $('.minicart-wrapper').addClass('sticky-minicart');
                } else {
                    header.classList.remove("sticky");
                    $('.minicart-wrapper').removeClass('sticky-minicart');
                }
            }
        })

    }

    renderSubAutoRight = (items) => {
        let html = null;
        if (items && items.length) {
            const subChild = items.map((item) => {
                const itemLabel = item.hasOwnProperty('sw_menu_cat_label') && item.sw_menu_cat_label ? <span className={item.sw_menu_cat_label === 'label2' ? 'cat-label cat-label-label2' : (item.sw_menu_cat_label === 'label3' ? 'cat-label cat-label-label3' : 'cat-label cat-label-label1')}>{item.sw_menu_cat_label === 'label1' ? Identify.__("NEW") : (item.sw_menu_cat_label === 'label3' ? Identify.__("SALE") : Identify.__("HOT!"))}</span> : '';

                let title = <span>{item.name}{itemLabel}</span>
                if (item.url_path) {
                    const location = {
                        pathname: '/' + item.url_path,
                        state: {}
                    }
                    title = (
                        <Link to={location}>
                            <span>{Identify.__(item.name)}{itemLabel}</span>
                        </Link>
                    )
                }

                // const parentCls = item.child_cats && item.child_cats.length && !subFullWidth ? 'parent' : '';
                const showItemRight = parseInt(item.level, 10) - 2 > 0 ? 1 : 0;
                // const deepChild = item.child_cats && item.child_cats.length ? this.renderSubMenu(item.child_cats, subFullWidth, showItemRight) : '';

                return <li className={`ui-menu-item level${parseInt(item.level, 10) - 2}`} key={item.entity_id}>
                    {title}
                    {/* {deepChild} */}
                </li>
            })

            html = <ul className={`subchildmenu right-100`}>
            {subChild}
        </ul>
        }
        return html;
    }

    renderSubMenu = (items, subFullWidth = 0, right = 0) => {
        let html = null;
        if (items.length) {
            const subChild = items.map((item) => {
                const itemLabel = item.hasOwnProperty('sw_menu_cat_label') && item.sw_menu_cat_label ? <span className={item.sw_menu_cat_label === 'label2' ? 'cat-label cat-label-label2' : (item.sw_menu_cat_label === 'label3' ? 'cat-label cat-label-label3' : 'cat-label cat-label-label1')}>{item.sw_menu_cat_label === 'label1' ? Identify.__("NEW") : (item.sw_menu_cat_label === 'label3' ? Identify.__("SALE") : Identify.__("HOT!"))}</span> : '';

                let title = <span>{item.name}{itemLabel}</span>
                if (item.url_path) {
                    const location = {
                        pathname: '/' + item.url_path,
                        state: {}
                    }
                    title = (
                        <Link to={location}>
                            <span>{Identify.__(item.name)}{itemLabel}</span>
                        </Link>
                    )
                }

                const parentCls = item.child_cats && item.child_cats.length && !subFullWidth ? 'parent' : '';
                const showItemRight = parseInt(item.level, 10) - 2 > 0 ? 1 : 0;
                const deepChild = item.child_cats && item.child_cats.length ? this.renderSubMenu(item.child_cats, subFullWidth, showItemRight) : '';

                return <li className={`ui-menu-item level${parseInt(item.level, 10) - 2} ${parentCls}`} key={item.entity_id}>
                    {title}
                    {deepChild}
                </li>
            })

            html = right !== 0 ? (<ul className={`subchildmenu ${(right === 1 && !subFullWidth) ? 'right-100' : ''} ${subFullWidth ? 'subchild-full' : ''}`}>
                {subChild}
            </ul>) : subChild
        }
        return html;
    }

    render() {
        let menuItems = []

        const storeConfig = Identify.getStoreConfig();

        if (storeConfig && storeConfig.simiCateTrees && JSON.parse(storeConfig.simiCateTrees.config_json)) {
            const jsonParse = JSON.parse(storeConfig.simiCateTrees.config_json);
            const menuCates = jsonParse.categorytrees;

            if (menuCates && menuCates instanceof Array && menuCates.length) {
                menuCates.sort((a, b) => parseInt(a.position, 10) - parseInt(b.position, 10));
                menuItems = menuCates.map((item, index) => {
                    if (!item.name || !item.include_in_menu)
                        return '';

                    const itemLabel = item.hasOwnProperty('sw_menu_cat_label') && item.sw_menu_cat_label ? <span className={item.sw_menu_cat_label === 'label2' ? 'cat-label cat-label-label2' : (item.sw_menu_cat_label === 'label3' ? 'cat-label cat-label-label3' : 'cat-label cat-label-label1')}>{item.sw_menu_cat_label === 'label1' ? Identify.__("NEW") : (item.sw_menu_cat_label === 'label3' ? Identify.__("SALE") : Identify.__("HOT!"))}</span> : '';
                    if (item.child_cats && item.child_cats.length > 0) {

                        const sw_menu_type = item.hasOwnProperty('sw_menu_type') && item.sw_menu_type ? item.sw_menu_type : '';
                        return (<li className={`ui-menu-item level0 ${sw_menu_type} parent`} key={index}>
                            <div className="open-children-toggle" />
                            <Link className="level-top open-children-toggle-new" to={'/' + item.url_path}>
                                <span>{Identify.__(item.name)}</span>{itemLabel}
                            </Link>
                            <div className="level0 submenu">
                                <ul className="view_all_category_mobile">
                                    <li><Link to={'/' + item.url_path}>{Identify.__("View all ") + Identify.__(item.name)}</Link></li>
                                </ul>
                                <div className="row">
                                    <ul className={`subchildmenu ${sw_menu_type === 'fullwidth' ? `col-md-12 mega-columns columns${item.sw_menu_cat_columns}` : ''}`}>
                                        {this.renderSubMenu(item.child_cats, sw_menu_type === 'fullwidth')}
                                    </ul>
                                </div>
                            </div>
                        </li>)

                    } else {
                        return (
                            <li className="ui-menu-item level0" key={index}>
                                <Link className="level-top" to={'/' + item.url_path} >
                                    <span>{Identify.__("New")}</span>{itemLabel}
                                </Link>
                            </li>
                        )
                    }
                });
                const customMenus = <React.Fragment key={Identify.randomString(3)}>
                    <li className="ui-menu-item level0" key={Identify.randomString(2)}>
                        <Link className="level-top" to={'/new-product'} >
                            <span>{Identify.__("New")}</span>
                        </Link>
                    </li>
                    <li className="ui-menu-item level0" key={Identify.randomString(2)}>
                        <Link className="level-top" to={'/shop_by_theme'} >
                            <span>{Identify.__("Theme")}</span>
                        </Link>
                    </li>
                    <li className="ui-menu-item level0" key={Identify.randomString(2)}>
                        <Link className="level-top" to={'/blog'} >
                            <span>{Identify.__("Blog")}</span>
                        </Link>
                    </li>
                </React.Fragment>
                menuItems.push(customMenus);
            }
        }

        return <div className="sections nav-sections">
            <div className="section-item-content nav-sections-item-content" id="hairbow-header">
                <nav className="navigation sw-megamenu">
                    <ul>
                        {menuItems}
                    </ul>
                </nav>
            </div>
            {this.renderJs()}
        </div>
    }
}
export default Navigation
