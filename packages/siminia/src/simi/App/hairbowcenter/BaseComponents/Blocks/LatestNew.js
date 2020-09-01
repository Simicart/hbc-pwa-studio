import React from 'react';
import AliceCarousel from 'react-alice-carousel'
import "react-alice-carousel/lib/scss/alice-carousel.scss";
import { Link } from 'react-router-dom';
import Identify from 'src/simi/Helper/Identify';
import amBlogPosts from 'src/simi/App/hairbowcenter/queries/blog/amBlogPosts';
import { simiUseQuery } from 'src/simi/Network/Query';
import ReactHTMLParser from 'react-html-parser';
import Image from 'src/simi/BaseComponents/Image'
require('./lastest-news.scss');

const LatestNew = props => {
    const { simiStoreConfig } = Identify.getStoreConfig();
    //const [data, setData] = useState(null);

    const [queryResult, queryApi] = simiUseQuery(amBlogPosts);
    const { data } = queryResult;
    const { runQuery } = queryApi;
    if (!data) {
        runQuery({
            variables: {
                type: 'grid',
                page: 1,
            }
        });
    }

    const renderItem = (blogs) => {
        let html = null;
        if (blogs.length) {
            html = blogs.slice(0, 5).map((post, index) => {
                const dateP = post.created_at;
                // const formatDate = new Date(date[0], date[1] - 1, date[2]);
                const dateF = dateP.split(/[- :]/);
                let formatDate = new Date(dateF[0], dateF[1], dateF[2], dateF[3], dateF[4], dateF[5]);
                var month_index =  parseInt(dateF[1],10) - 1;
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return (
                    <div className="post-item" key={index}>
                        <div className="row">
                            <div className="col-sm-5">
                                <div className="post-image">
                                    <Image src={post.post_thumbnail} alt={post.title} />
                                </div>
                            </div>
                            <div className="col-sm-7">
                                <div className="post-date">
                                    <span className="day">{formatDate.getDate()}</span>
                                    <span className="month">{months[month_index]}</span>
                                </div>
                                <div className="post-title">
                                    <h2>
                                        <Link to={`/blog/${post.url_key}`}>{post.title}</Link>
                                    </h2>
                                </div>
                                {post.short_content && <div className="post-content">
                                    {ReactHTMLParser(post.short_content)}
                                </div>}
                                <Link to={`/blog/${post.url_key}`}>{Identify.__(" Read more")}</Link>
                            </div>
                        </div>
                    </div>
                )
            })
        }
        return html;
    }

    if (data && data.amBlogPosts && data.amBlogPosts.items && data.amBlogPosts.items.length)
        return (
            <div className="lastest-news">
                <h2 className="filterproduct-title">
                    <span className="content">
                        <strong>{Identify.__('FROM THE BLOG')}</strong>
                    </span>
                </h2>
                <div className="lastest-new-items">
                    <AliceCarousel mouseTrackingEnabled dotsDisabled={true} buttonsDisabled={true} autoPlay={true} autoPlayInterval={5000}>
                        {renderItem(data.amBlogPosts.items)}
                    </AliceCarousel>
                </div>
            </div>
        );

    return null
}

export default LatestNew;
