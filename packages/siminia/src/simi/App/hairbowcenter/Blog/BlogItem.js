import React from 'react';
import { Link } from 'src/drivers';
import ReactHTMLParser from 'react-html-parser';
import Image from 'src/simi/BaseComponents/Image';
import Identify from 'src/simi/Helper/Identify';
import { getFormattedDate, hasBlogConfig } from './../Helper';
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

    const renderShareSocial = (networks) => {
        let html = null;
        if (networks && networks.length) {
            let arrSocial = [];
            const linkShare = type === 'post' ? window.location : window.location.origin + '/blog/' + item.url_key;
            for (let k = 0; k < networks.length; k++) {
                const nwItem = networks[k];
                switch (nwItem) {
                    case 'twitter':
                        arrSocial.push(<li className={`amblog-icon _${nwItem}`} key={k}><a target="_blank" className="amblog-social" href={encodeURI(`https://twitter.com/?status=${item.title} : ${linkShare}`)} title={nwItem} /></li>)
                        break;
                    case 'facebook':
                        arrSocial.push(<li className={`amblog-icon _${nwItem}`} key={k}><a target="_blank" className="amblog-social" href={encodeURI(`http://www.facebook.com/share.php?u=${linkShare}`)} title={nwItem} /></li>)
                        break;
                    case 'vkontakte':
                        arrSocial.push(<li className={`amblog-icon _${nwItem}`} key={k}><a target="_blank" className="amblog-social" href={encodeURI(`http://vkontakte.ru/share.php?url=${linkShare}`)} title={nwItem} /></li>)
                        break;
                    case 'odnoklassniki':
                        arrSocial.push(<li className={`amblog-icon _${nwItem}`} key={k}><a target="_blank" className="amblog-social" href={encodeURI(`http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st.comments=${item.short_content}&st._surl=${linkShare}`)} title={nwItem} /></li>)
                        break;
                    case 'blogger':
                        arrSocial.push(<li className={`amblog-icon _${nwItem}`} key={k}><a target="_blank" className="amblog-social" href={encodeURI(`http://blogger.com/blog-this.g?t=${item.title}&n=${item.short_content ? item.short_content : ''}&u=${linkShare}`)} title={nwItem} /></li>)
                        break;
                    case 'pinterest':
                        arrSocial.push(<li className={`amblog-icon _${nwItem}`} key={k}><a target="_blank" className="amblog-social" href={encodeURI(`http://pinterest.com/pin/create/button/?url=${linkShare}&media=${item.list_thumbnail}&description=${item.title}`)} title={nwItem} /></li>)
                        break;
                    case 'tumblr':
                        arrSocial.push(<li className={`amblog-icon _${nwItem}`} key={k}><a target="_blank" className="amblog-social" href={encodeURI(`http://www.tumblr.com/share/link?url=${linkShare}&name=${item.title}&description=${item.short_content}`)} title={nwItem} /></li>)
                        break;
                    case 'digg':
                        arrSocial.push(<li className={`amblog-icon _${nwItem}`} key={k}><a target="_blank" className="amblog-social" href={encodeURI(`http://digg.com/submit?phase=2&url=${linkShare}`)} title={nwItem} /></li>)
                        break;
                    case 'delicious':
                        arrSocial.push(<li className={`amblog-icon _${nwItem}`} key={k}><a target="_blank" className="amblog-social" href={encodeURI(`http://del.icio.us/post?url=${linkShare}`)} title={nwItem} /></li>)
                        break;
                    case 'stumbleupon':
                        arrSocial.push(<li className={`amblog-icon _${nwItem}`} key={k}><a target="_blank" className="amblog-social" href={encodeURI(`http://www.stumbleupon.com/submit?url=${linkShare}&title=${item.title}`)} title={nwItem} /></li>)
                        break;
                    case 'slashdot':
                        arrSocial.push(<li className={`amblog-icon _${nwItem}`} key={k}><a target="_blank" className="amblog-social" href={encodeURI(`http://slashdot.org/slashdot-it.pl?op=basic&url=${linkShare}`)} title={nwItem} /></li>)
                        break;
                    case 'reddit':
                        arrSocial.push(<li className={`amblog-icon _${nwItem}`} key={k}><a target="_blank" className="amblog-social" href={encodeURI(`http://reddit.com/submit?url=${linkShare}&title=${item.title}`)} title={nwItem} /></li>)
                        break;
                    case 'linkedin':
                        arrSocial.push(<li className={`amblog-icon _${nwItem}`} key={k}><a target="_blank" className="amblog-social" href={encodeURI(`http://www.linkedin.com/shareArticle?mini=true&url=${linkShare}&title=${item.title}`)} title={nwItem} /></li>)
                        break;
                    default:
                        break;
                }
            }
            html = <ul className="amblog-list">{arrSocial}</ul>
        }
        return html;
    }

    return <article className="blog-grid-item">
        <header className="entry-header">
            <h2 className="entry-title">
                {type === 'post' ? item.title : <Link to={`/blog/${item.url_key}`}>{item.title}</Link>}
            </h2>
        </header>
        <div className="entry-content">
            {item.list_thumbnail && type !== 'post' ? <p><Image src={item.list_thumbnail} alt={item.title} /></p> : ''}
            {type === 'post' ? ReactHTMLParser(item.full_content) : <React.Fragment>
                {ReactHTMLParser(item.short_content)}
                <Link to={`/blog/${item.url_key}`} className="more-link">{Identify.__("Continue Reading")} <span className="meta-nav">→</span></Link>
            </React.Fragment>}
        </div>
        <footer className="entry-meta">
            {Identify.__("This entry was posted in ")}<span className="meta-attribute-link">{getListMeta('category', categories)}</span>
            {tag_ids && Identify.__(" and tagged ")} {tag_ids && <span className="meta-attribute-link">{getListMeta('tag', tag_ids)}</span>}
            {Identify.__(" on ")} {getFormattedDate(item.published_at)}
            {Identify.__(" by ")} {item.author_id}
        </footer>
        {hasBlogConfig && hasBlogConfig.hasOwnProperty('social_network') && hasBlogConfig.social_network.length ? <div className="amblog-social-container">{renderShareSocial(hasBlogConfig.social_network)}</div> : ''}
        {type === 'post' && <Comments post_id={item.post_id} />}
    </article>
}


export default BlogItem;
