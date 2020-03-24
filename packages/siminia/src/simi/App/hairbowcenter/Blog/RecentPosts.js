import React from 'react';
import { simiUseQuery } from 'src/simi/Network/Query';
import amBlogPosts from 'src/simi/App/hairbowcenter/queries/blog/amBlogPosts';
import Identify from 'src/simi/Helper/Identify';
import ReactHTMLParser from 'react-html-parser';
import { Link } from 'src/drivers';

const RecentPosts = (props) => {
    const { recentProp } = props;

    const [queryResult, queryApi] = simiUseQuery(amBlogPosts);
    const { data } = queryResult;
    const { runQuery } = queryApi;

    if (!data && (!recentProp || (recentProp && recentProp.items.length < 1))) {
        runQuery({
            variables: {
                type: 'grid',
                page: 1
            }
        });
    }

    const renderRecent = (rcData) => {

        let htmlRecent = null;
        if (rcData && rcData.items && rcData.items.length) {
            const b5Items = rcData.items.slice(0, 5);
            htmlRecent = b5Items.map((bItem, idk) => {
                return <li key={idk}><Link to={`/blog/${bItem.url_key}`} key={idk}>{ReactHTMLParser(bItem.title)}</Link></li>
            });
        }
        return htmlRecent;
    }

    return <aside className="widget widget_recent_posts">
        <div className="widget-title">{Identify.__("Recent Posts")}</div>
        <ul>{renderRecent(data ? data.amBlogPosts : (recentProp ? recentProp : ''))}</ul>
    </aside>

}

export default RecentPosts;
