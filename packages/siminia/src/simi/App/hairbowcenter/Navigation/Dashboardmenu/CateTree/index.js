import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import {Link} from 'react-router-dom';
const $ = window.$
require('./cateTree.scss')

class CateTree extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded : false,
            open:false,
        }
    }

    shouldComponentUpdate(){
        return !this.renderedOnce
    }

    handleCloseMenu = ()=>{
        this.props.handleClose()
    }

    handleOpenSubMenu = (index, e) => {
        e.preventDefault()
        const selector = $(`#submenu-${index}`)
        if(!selector.hasClass('opened')) {
            $(`#submenu-${index}`).addClass('opened')
            $(`#submenu-${index}`).prev().addClass('ui-state-active')
        } else {
            $(`#submenu-${index}`).removeClass('opened')
            $(`#submenu-${index}`).prev().removeClass('ui-state-active')
        }
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
                        <Link to={location} onClick={() => this.handleCloseMenu()}>
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


    renderTreeMenu (categoryTrees) {
        categoryTrees.sort((a, b) => parseInt(a.position, 10) - parseInt(b.position, 10));
        return categoryTrees.map((item, index) => {
            if (!item.name || !item.include_in_menu) return '';

                const itemLabel = item.hasOwnProperty('sw_menu_cat_label') && item.sw_menu_cat_label ? <span className={item.sw_menu_cat_label === 'label2' ? 'cat-label cat-label-label2' : (item.sw_menu_cat_label === 'label3' ? 'cat-label cat-label-label3' : 'cat-label cat-label-label1')}>{item.sw_menu_cat_label === 'label1' ? Identify.__("NEW") : (item.sw_menu_cat_label === 'label3' ? Identify.__("SALE") : Identify.__("HOT!"))}</span> : '';
                if (item.child_cats && item.child_cats.length > 0) {

                    const sw_menu_type = item.hasOwnProperty('sw_menu_type') && item.sw_menu_type ? item.sw_menu_type : '';
                    return (
                        <li className={`ui-menu-item level0 ${sw_menu_type}`} key={index} onClick={(e) => this.handleOpenSubMenu(index, e)}>
                            <div className="open-children-toggle" />
                            <a className="level-top open-children-toggle-new" href="#">
                                <span>{Identify.__(item.name)}</span>{itemLabel}
                            </a>
                            <div id={`submenu-${index}`} className="level0 submenu">
                                <div className="container">
                                    <ul className="view_all_category_mobile">
                                        <li><Link to={'/' + item.url_path} onClick={() => this.handleCloseMenu()}>{Identify.__("View all ") + Identify.__(item.name)}</Link></li>
                                    </ul>
                                    <div className="row">
                                        <ul className={`subchildmenu ${sw_menu_type === 'fullwidth' ? `col-md-12 mega-columns columns${item.sw_menu_cat_columns}` : ''}`}>
                                            {this.renderSubMenu(item.child_cats, sw_menu_type === 'fullwidth')}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )

                } else {
                    return (
                        <li className="ui-menu-item level0" key={index}>
                            <Link to={'/' + item.url_path} className="level-top" onClick={() => this.handleCloseMenu()} >
                                <span>{Identify.__(item.name)}</span>{itemLabel}
                            </Link>
                        </li>
                    )
                }
        })
    }

    render(){
        const storeConfig = Identify.getStoreConfig();
        if (!storeConfig || !storeConfig.simiCateTrees)
            return <div></div>

        this.renderedOnce = true
        const jsonParse = JSON.parse(storeConfig.simiCateTrees.config_json);

        return (
            <nav className="mobile-navigation cat-tree-navigation" id="navigation-menu">
                <ul>
                    {this.renderTreeMenu(jsonParse.categorytrees)}
                </ul>
            </nav>
        )
    }
}

export default CateTree
