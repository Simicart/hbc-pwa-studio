import React, { useRef } from 'react';
import { Link } from 'src/drivers';
import { StaticRate } from 'src/simi/App/hairbowcenter/BaseComponents/Rate'
import Image from 'src/simi/BaseComponents/Image'
import { productUrlSuffix, saveDataToUrl, resourceUrl } from 'src/simi/Helper/Url';
import AliceCarousel from 'react-alice-carousel'
import "react-alice-carousel/lib/scss/alice-carousel.scss";
require('./rating-list.scss');

const RatingList = (props) => {
    const carouselRef = useRef(null);
    const { data } = props;

    if (!data) {
        return null;
    }

    const handleOnDragStart = (e) => e.preventDefault()

    const renderItem = (items) => {
        let html = null;
        if (items.length) {
            html = items.map((item, key) => {
                const childItem = item && item.map((it, idx) => {
                    const location = `/${it.url}${productUrlSuffix()}`;
                    return <div className="product product-item" key={idx}>
                        <div className="product-item-info">
                            <Link to={location} className="product photo product-item-photo">
                                <Image src={resourceUrl(it.image, { type: 'image-product', width: 300 })} alt={it.title} className="product-image-photo default_image " />
                            </Link>
                            <div className="product details product-item-details">
                                <strong className="product name product-item-name">
                                    <Link to={location} className="product-item-link">{it.title}</Link>
                                </strong>
                                <div className="product-reviews-summary short">
                                    <StaticRate rate={it.count} classes={{}} />
                                </div>
                                {it.price && <div className="product-price final_price">
                                    <span className="price">{it.price}</span>
                                </div>}
                            </div>
                        </div>
                    </div>
                })

                return <div className="block-list-item" onDragStart={handleOnDragStart} key={key}>
                    {childItem}
                </div>
            })
        }
        return html;
    }

    return (
        <div className="rating-list-block">
            <div className="block-title">Featured</div>
            <nav className="custom-nav-react">
                <span onClick={() => carouselRef.current.slidePrev()}>
                    <em className="porto-icon-left-open-huge"></em>
                </span>
                <span onClick={() => carouselRef.current.slideNext()}>
                    <em className="porto-icon-right-open-huge"></em>
                </span>
            </nav>
            <AliceCarousel mouseTrackingEnabled dotsDisabled={true} buttonsDisabled={true} ref={carouselRef} infinite={false}>
                {renderItem(data)}
            </AliceCarousel>
            <hr />
        </div>
    )
}

export default RatingList;
