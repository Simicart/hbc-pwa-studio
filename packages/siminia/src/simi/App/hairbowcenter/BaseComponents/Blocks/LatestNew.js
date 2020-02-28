import React from 'react';
import AliceCarousel from 'react-alice-carousel'
import "react-alice-carousel/lib/scss/alice-carousel.scss";
import {Link} from 'react-router-dom';
import Identify from 'src/simi/Helper/Identify'
require('./lastest-news.scss')

const LatestNew = props =>  {
    const { simiStoreConfig } = Identify.getStoreConfig();

    const renderItem = (blogs) => {
        const {blog} = blogs
        return blog.map((post, index) => {
            const date = post.date.split('-');
            const formatDate = new Date (date[0], date[1] - 1, date[2])
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return (
                <div className="post-item" key={index}>
                    <div className="row">
                        <div className="col-sm-5">
                            <div className="post-image">
                                <img src={post.image} alt={post.title}/>
                            </div>
                        </div>
                        <div className="col-sm-7">
                            <div className="post-date">
                                <span className="day">{formatDate.getDate()}</span>
                                <span className="month">{months[formatDate.getMonth()]}</span>
                            </div>
                            <div className="post-title">
                                <h2>
                                    <a href={post.url}>{post.title}</a>
                                </h2>
                            </div>
                            <div className="post-content">
                                <p>{post.desc}</p>
                            </div>
                            <a href={post.url}>{Identify.__(" Read more")}</a>
                        </div>
                    </div>
                </div>
            )
     
        })
    }

    if(simiStoreConfig.config && simiStoreConfig.config.home_configs && simiStoreConfig.config.home_configs.home_blog_config) {
        const blogConfig = JSON.parse(simiStoreConfig.config.home_configs.home_blog_config);
        return (
            <div className="lastest-news">
                <h2 className="filterproduct-title">
                    <span className="content">
                        <strong>{Identify.__('FROM THE BLOG')}</strong>
                    </span>
                </h2>
                <div className="lastest-new-items">
                    <AliceCarousel mouseTrackingEnabled dotsDisabled={true} buttonsDisabled={true} autoPlay={true} autoPlayInterval={5000}>
                        {renderItem(blogConfig)}
                    </AliceCarousel>
                </div>
            </div>
        );
    } 
    return null
}

export default LatestNew;