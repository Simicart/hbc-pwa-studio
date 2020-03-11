import React from 'react';
import { Link } from 'src/drivers';
import ReactHTMLParser from 'react-html-parser';
import Image from 'src/simi/BaseComponents/Image';
import Identify from 'src/simi/Helper/Identify';
import { getFormattedDate } from './../Helper';

const BlogItem = (props) => {
    const { item } = props;

    return <article className="blog-grid-item">
        <header className="entry-header">
            <h2 className="entry-title">
                <Link to={`/blog/${item.url_key}`}>{item.title}</Link>
            </h2>
        </header>
        <div className="entry-content">
            {item.list_thumbnail && <p><Image src={item.list_thumbnail} alt={item.title} /></p>}
            {item.short_content && ReactHTMLParser(item.short_content)}
            <Link to={`/blog/${item.url_key}`} className="more-link">{Identify.__("Continue Reading")} <span className="meta-nav">→</span></Link>
        </div>
        <footer className="entry-meta">
            {Identify.__("This entry was posted in")}
            {Identify.__(" and tagged ")}
            {Identify.__(" on ")} {getFormattedDate(item.published_at)}

        </footer>
    </article>
}


export default BlogItem;
