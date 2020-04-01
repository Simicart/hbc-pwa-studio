import React, { useEffect, useState } from 'react'
import { getHomeData } from 'src/simi/Model/Home';
import Banner from './DefaultHome/Banner';
//import defaultClasses from './style.css';
import LoadingSpiner from 'src/simi/BaseComponents/Loading/LoadingSpiner'
import { withRouter } from 'react-router-dom';
import Identify from 'src/simi/Helper/Identify';
import * as Constants from 'src/simi/Config/Constants';
import Side from './DefaultHome/Side';
import HomeBar from './DefaultHome/HomeBar';
import HomeProducts from './DefaultHome/HomeProducts';
import HomeCat from './DefaultHome/HomeCat';
import Intro from './DefaultHome/Intro';
import FeatureBranch from './DefaultHome/FeaturedBranch';
import BlogRating from 'src/simi/App/hairbowcenter/BaseComponents/Blocks/BlogRating'
import LatestNew from 'src/simi/App/hairbowcenter/BaseComponents/Blocks/LatestNew'
import HomeContentBanner from './DefaultHome/HomeContentBanner';
require('./home.scss');

const Home = props => {
    const {  history } = props;
    const [isPhone, setIsPhone] = useState(window.innerWidth < 1024)
    const cached_home = Identify.ApiDataStorage(`home`)

    const [data, setHomeData] = useState(cached_home)

    const { simiStoreConfig } = Identify.getStoreConfig();

    const resizePhone = () => {
        window.onresize = function () {
            const width = window.innerWidth;
            const newIsPhone = width < 1024
            if(isPhone !== newIsPhone){
                setIsPhone(newIsPhone)
            }
        }
    }

    useEffect(() => {
        if(!data) {
            getHomeData(setData, true);
        }
        resizePhone();
    },[data, isPhone])

    const setData = (data) => {
        if(!data.errors) {
            Identify.ApiDataStorage(`home`,'update', data)
            setHomeData(data)
        }
    }

    if(!data) {
        return <LoadingSpiner />
    } 

    return (
        <div className="home-page-wrapper">
            <div style={{padding: '29px 0 36px', backgroundColor: '#fff'}}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-lg-8">
                            <Banner data={data} history={history} isPhone={isPhone}/>
                        </div>
                        <div className="col-md-12 col-lg-4">
                            <Side />
                        </div>
                    </div>
                </div>
            </div>
            <div className="homepage-bar">
                <HomeBar />
            </div>
            <main className="container">
                <div className="columns">
                    <div className="column main">
                        <div className="row">
                            <div className="col-md-9 col-sm-8">
                                <HomeProducts data={data} history={history}/> 
                                <HomeCat data={data} />
                                <HomeContentBanner />
                                <FeatureBranch data={data}/>
                                <Intro />
                            </div>
                            <div className="col-md-3 col-sm-4 sidebar">
                                <div className="custome-block" style={{marginTop: '44px', paddingBottom: '37px', marginBottom: '15px'}}>
                                    <div className="block block-border">
                                        {simiStoreConfig && simiStoreConfig.config && simiStoreConfig.config.shopper_reviews && <BlogRating type="reviews_home"/>}
                                        <div style={{textAlign: 'right', marginTop: '30px'}}>
                                            <a href="http://www.shopperapproved.com/reviews/hairbowcenter.com/" target="_blank" rel="nofollow">
                                                <img className="sa_widget_footer" src="https://www.shopperapproved.com/widgets/widgetfooter-darknarrow.png" alt=""/>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <LatestNew />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    );
}

export default withRouter(Home);