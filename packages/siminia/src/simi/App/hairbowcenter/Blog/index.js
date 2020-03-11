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
import { Simiquery } from 'src/simi/Network/Query';
import BlogItem from './BlogItem';
import Post from './Post';

require('./style.scss');
const $ = window.$;

const Blog = (props) => {

    const { history, location } = props;
    const simiStoreConfig = Identify.getStoreConfig();

    const blog_configs = simiStoreConfig && simiStoreConfig.hasOwnProperty('simiStoreConfig') && simiStoreConfig.simiStoreConfig &&
        simiStoreConfig.simiStoreConfig && simiStoreConfig.simiStoreConfig.config.hasOwnProperty('amasty_blog_configs') &&
        simiStoreConfig.simiStoreConfig.config.amasty_blog_configs || null;

    smoothScrollToView($("#root"));

    const currentPage = Identify.findGetParameter('page') ? Number(Identify.findGetParameter('page')) : 1


    const renderBlogData = (blogData) => {
        let html = null;
        if (blogData && blogData.items.length) {
            const { total } = blogData;
            const postPerPage = blog_configs && blog_configs.hasOwnProperty('count_per_page') ? Number(blog_configs.count_per_page) : 10;
            let blogHtml = blogData.items.map((post, idx) => {
                return <BlogItem key={idx} item={post} />
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
            {renderCategories()}
        </div>
    }

    const variables = {
        type: 'grid',
        page: currentPage
    }

    const renderCategories = () => {
        let html = null;
        if (blog_configs && blog_configs.hasOwnProperty('categories_tree') && blog_configs.categories_tree.length) {

            let cateList = blog_configs.categories_tree.map((itemX, idx) => {
                return <li className="cate-item" key={idx}>
                    <Link to={`/blog/category/${itemX.url_key}`}>{itemX.label}</Link>
                    {itemX.hasOwnProperty('optgroup') && itemX.optgroup.length ? renderTreeCates(itemX.optgroup) : ''}
                </li>
            });
            html = <aside className="widget widget_categories">
                <div className="widget-title">{Identify.__("Categories")}</div>
                {cateList && <ul>{cateList}</ul>}
            </aside>
        }
        return html;
    }

    const renderTreeCates = (categories) => {
        let ht = categories.map((cate, idc) => {
            const cateChild = cate.hasOwnProperty('optgroup') && cate.optgroup.length ? renderTreeCates(cate.optgroup) : '';
            return <li key={idc} className="cat-item"><Link to={`/blog/category/${cate.url_key}`}>{cate.label}</Link>
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

    return (
        <div className="blog-data-page">
            <div className="blog-container">
                <div className="blog-site-content">
                    {props.post_id ? <Post post_id={props.post_id} /> : <Simiquery query={amBlogPosts} variables={variables} fetchPolicy="no-cache" >
                        {({ loading, error, data }) => {
                            if (error) return <div>{Identify.__('Data Fetch Error')}</div>;

                            let blogData = null;
                            if (data && data.amBlogPosts) {
                                blogData = data.amBlogPosts;
                            }
                            if (blogData) {
                                return renderBlogData(blogData)
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
