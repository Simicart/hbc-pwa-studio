import React from 'react';
import { Link } from 'src/drivers';
import ReactHTMLParser from 'react-html-parser';
import Image from 'src/simi/BaseComponents/Image';
import Identify from 'src/simi/Helper/Identify';
import { getFormattedDate } from './../Helper';
import Comments from './Comments';

const BlogItem = (props) => {
    const { item, type } = props;
    const { categories, tag_ids } = item;

    const getListMeta = (type, categories) => {
        let cateHtml = null;
        if (categories && JSON.parse(categories) && JSON.parse(categories).length) {
            const categoriesParsed = JSON.parse(categories);
            cateHtml = categoriesParsed.map((ct, idk) => {
                return <Link key={idk} to={`/blog/${type}/${ct.url_key}`}>{ReactHTMLParser(ct.name)}</Link>
            });
        }
        return cateHtml;
    }

    return <article className="blog-grid-item">
        <header className="entry-header">
            <h2 className="entry-title">
                {type === 'post' ? item.title : <Link to={`/blog/${item.url_key}`}>{item.title}</Link>}
            </h2>
        </header>
        <div className="entry-content">
            {item.list_thumbnail && <p><Image src={item.list_thumbnail} alt={item.title} /></p>}
            {type === 'post' ? ReactHTMLParser(item.full_content) : <React.Fragment>
                {ReactHTMLParser(item.short_content)}
                <Link to={`/blog/${item.url_key}`} className="more-link">{Identify.__("Continue Reading")} <span className="meta-nav">→</span></Link>
            </React.Fragment>}
        </div>
        <footer className="entry-meta">
            {Identify.__("This entry was posted in ")}<span className="meta-attribute-link">{getListMeta('category', categories)}</span>
            {tag_ids && Identify.__(" and tagged ")} {tag_ids && <span className="meta-attribute-link">{getListMeta('tag', tag_ids)}</span>}
            {Identify.__(" on ")} {getFormattedDate(item.published_at)}
        </footer>
        {type === 'post' && <Comments post_id={item.post_id} /> }
    </article>
}


export default BlogItem;
