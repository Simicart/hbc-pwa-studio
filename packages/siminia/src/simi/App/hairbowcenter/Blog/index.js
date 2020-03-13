import React, { Fragment, useState, useEffect } from "react";
import Identify from 'src/simi/Helper/Identify'
import ReactHTMLParser from 'react-html-parser';
import { Link } from 'src/drivers';
import Loading from 'src/simi/BaseComponents/Loading'
import { Whitebtn } from 'src/simi/BaseComponents/Button';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import { getFormattedDate, getFormatMonth } from './../Helper';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { showToastMessage } from 'src/simi/Helper/Message';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import amBlogPosts from 'src/simi/App/hairbowcenter/queries/blog/amBlogPosts';
import amBlogRecentPostsWidget from 'src/simi/App/hairbowcenter/queries/blog/amBlogRecentPostsWidget';
import amBlogPostsByCategory from 'src/simi/App/hairbowcenter/queries/blog/amBlogPostsByCategory';
import amBlogPostsByTag from 'src/simi/App/hairbowcenter/queries/blog/amBlogPostsByTag';
import { Simiquery } from 'src/simi/Network/Query';
import BlogItem from './BlogItem';
import Post from './Post';

require('./style.scss');
const $ = window.$;

const Blog = (props) => {

    const { history, location } = props;
    smoothScrollToView($("#root"));
    const simiStoreConfig = Identify.getStoreConfig();

    const blog_configs = simiStoreConfig && simiStoreConfig.hasOwnProperty('simiStoreConfig') && simiStoreConfig.simiStoreConfig &&
        simiStoreConfig.simiStoreConfig && simiStoreConfig.simiStoreConfig.config.hasOwnProperty('amasty_blog_configs') &&
        simiStoreConfig.simiStoreConfig.config.amasty_blog_configs || null;


    const currentPage = Identify.findGetParameter('page') ? Number(Identify.findGetParameter('page')) : 1

    const callOlderPosts = () => {
        const { search } = location;
        const queryParams = new URLSearchParams(search);
        queryParams.set('page', currentPage + 1);
        history.push({ search: queryParams.toString() });
    }

    const callNewerPosts = () => {
        const { search } = location;
        const queryParams = new URLSearchParams(search);
        queryParams.set('page', currentPage - 1);
        history.push({ search: queryParams.toString() });
    }

    const renderSidebar = () => {
        return <div className="widget-area">
            <aside className="widget widget-search">
                <form>
                    <input type="text" name="blog-search" id="" />
                    <button>{Identify.__("Search")}</button>
                </form>
            </aside>
            {renderRecentPosts()}
            {renderCategoriesSidebar()}
        </div>
    }

    const variables = {
        type: 'grid',
        page: currentPage
    }

    const hasCateId = props.hasOwnProperty('category_id') && props.category_id;
    const hasTagId = props.hasOwnProperty('tag_id') && props.tag_id;
    if (hasCateId) {
        variables['cateId'] = props.category_id;
    } else if (hasTagId) {
        variables['tagId'] = props.tag_id;
    }

    const renderBlogData = (blogData) => {
        let html = null;
        if (blogData && blogData.items && blogData.items.length) {
            const { total } = blogData;
            const postPerPage = blog_configs && blog_configs.hasOwnProperty('count_per_page') ? Number(blog_configs.count_per_page) : 10;
            let blogHtml = blogData.items.map((post, idx) => {
                return <BlogItem key={idx} item={post} type="blog" />
            });

            html = <Fragment>
                {blogHtml}
                <div className="blog-pagination">
                    {currentPage * postPerPage < total && <div className="nav-previous">
                        <div onClick={callOlderPosts}><span className="meta-nav">←</span>{Identify.__(' Older posts')}</div>
                    </div>}
                    {currentPage > 1 && <div className="nav-next">
                        <div onClick={callNewerPosts}>{Identify.__("Newer posts ")}<span class="meta-nav">→</span></div>
                    </div>}
                </div>
            </Fragment>
        }
        return html;
    }

    const renderArchive = (blogCate) => {
        let html = null;
        if (blogCate) {
            html = <header className="archive-header">
                {blogCate.name && <h1 className="archive-title">
                    {Identify.__("Category Archives: ")} <span>{ReactHTMLParser(blogCate.name)}</span>
                </h1>}
                <div className="archive-meta">{Identify.__("This section of our blog is designated for showcasing projects submitted by our customers and fan base! We can’t wait to see what you want to share with us…")}</div>
            </header>
        }
        return html;
    }

    const renderArchiveTag = (blogTag) => {
        let html = null;
        if (blogTag) {
            html = <header className="archive-header">
                {blogTag.name && <h1 className="archive-title">
                    {Identify.__("Tag Archives: ")} <span>{ReactHTMLParser(blogTag.name)}</span>
                </h1>}
            </header>
        }
        return html;
    }

    const renderCategoriesSidebar = () => {
        let html = null;
        if (blog_configs && blog_configs.hasOwnProperty('categories_tree') && blog_configs.categories_tree.length) {
            html = <aside className="widget widget_categories">
                <div className="widget-title">{Identify.__("Categories")}</div>
                <ul>{renderCategories(blog_configs.categories_tree, true)}</ul>
            </aside>
        }
        return html;
    }

    const renderCategories = (categories_tree, hasCount = false) => {
        let html = null;
        if (categories_tree && categories_tree.length) {

            html = categories_tree.map((itemX, idx) => {
                return <li className="cate-item" key={idx}>
                    <Link to={`/blog/category/${itemX.url_key}`}>{ReactHTMLParser(itemX.label)}</Link>
                    {hasCount && itemX.hasOwnProperty('post_count') ? <b>({itemX.post_count})</b> : ''}
                    {itemX.hasOwnProperty('optgroup') && itemX.optgroup.length ? renderTreeCates(itemX.optgroup, true) : ''}
                </li>
            });
        }
        return html;
    }

    const renderTreeCates = (categories, hasCount = false) => {
        let ht = categories.map((cate, idc) => {
            const cateChild = cate.hasOwnProperty('optgroup') && cate.optgroup.length ? renderTreeCates(cate.optgroup, hasCount) : '';
            return <li key={idc} className="cat-item"><Link to={`/blog/category/${cate.url_key}`}>{ReactHTMLParser(cate.label)}</Link>
                {hasCount && cate.hasOwnProperty('post_count') ? <b>({cate.post_count})</b> : ''}
                {cateChild}
            </li>
        });

        return <ul className="children">{ht}</ul>
    }

    const renderRecentPosts = () => {
        /* const recentPostVariables = {

        }

        return (<Simiquery query={amBlogPosts} variables={variables} fetchPolicy="no-cache" >

        </Simiquery>); */
    }

    const renderNavigation = () => {
        return <nav className="main-navigation">
            <button className="menu-toggle">{Identify.__("Menu")}</button>
            <div className="menu-menu-1-container">
                <ul className="nav-menu">
                    <li className="menu-object-item">
                        <Link to="/blog">{Identify.__("Blog Home")}</Link>
                    </li>
                    {blog_configs && blog_configs.hasOwnProperty('categories_tree') && blog_configs.categories_tree.length ?
                        <li className="menu-object-item">
                            <Link to="/">{Identify.__("Blog Categories")}</Link>
                            <ul className="sub-menu">{renderCategories(blog_configs.categories_tree)}</ul>
                        </li>
                        : ''}
                </ul>
            </div>
        </nav>
    }

    return (
        <div className="blog-data-page">
            <div className="blog-container">
                <div className="blog-site-content">
                    {renderNavigation()}
                    {props.post_id ? <Post post_id={props.post_id} /> : <Simiquery query={hasCateId ? amBlogPostsByCategory : (hasTagId ? amBlogPostsByTag : amBlogPosts)} variables={variables} fetchPolicy="no-cache" >
                        {({ loading, error, data }) => {
                            if (error) return <div>{Identify.__('Data Fetch Error')}</div>;

                            let blogData = null;
                            if (data && data.amBlogPosts) {
                                blogData = data.amBlogPosts;
                            }
                            if (blogData) {
                                return <Fragment>
                                    {data && data.amBlogCategory ? renderArchive(data.amBlogCategory) : ''}
                                    {data && data.amBlogTag ? renderArchiveTag(data.amBlogTag) : ''}
                                    {renderBlogData(blogData)}
                                </Fragment>
                            }
                            if (loading)
                                return <Loading />
                        }}
                    </Simiquery >}
                </div>
                <div className="blog-sidebar">
                    {renderSidebar()}
                </div>

            </div>
        </div>
    );

}

const mapDispatchToProps = {
    toggleMessages
};

export default connect(null, mapDispatchToProps)(Blog);
