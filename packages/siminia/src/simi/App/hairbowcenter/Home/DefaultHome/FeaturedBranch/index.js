import React, {useState} from 'react';
import AliceCarousel from 'react-alice-carousel'
import "react-alice-carousel/lib/scss/alice-carousel.scss";
require('./featuredbranch.scss')

const FeatureBranch = props => {

    const {data} = props;
    let brands = null
    if(data.home && data.home.brand) {
        brands = data.home.brand;
    }

    const responsive = {
        0: {
            items: 1
        }, 
        768: {
            items: 2
        },
        1024: {
            items: 6
        }
    }

    const onSlideChange = (e) => {
        console.log(e);
    }

    const renderItems = () => {
        const carouselItem = [];
        brands.items.forEach((item, index) => {
            if(item.brand_image) {
                carouselItem.push(
                    <div className="slide-item" key={index}>
                        <img className="img-responsive" src={item.brand_image} alt={item.title}/>
                    </div>
                )
            }
        })
        return carouselItem
    }

    if(brands) {
        return (
            <div className="home-feature-bracnch">
                <h2 className="filterproduct-title">
                    <span className="content">
                        <strong>Featured Brands</strong>
                    </span>
                    <hr className="home-middle-line"/>
                </h2>
                <div className="brands-slider">
                    <AliceCarousel buttonsDisabled responsive={responsive} onSlideChange={onSlideChange}>
                        {renderItems()}
                    </AliceCarousel>
                </div>
              
            </div>
        );
    }

    return null
  
}

export default FeatureBranch;