import React from 'react';
import {Carousel} from 'react-responsive-carousel';
import Identify from "src/simi/Helper/Identify";
import ImageLightbox from "./ImageLightbox";
import memoize from 'memoize-one';
import isProductConfigurable from 'src/util/isProductConfigurable';
import { resourceUrl } from 'src/simi/Helper/Url'
import findMatchingVariant from 'src/util/findMatchingProductVariant';
import { transparentPlaceholder } from 'src/shared/images';
import Image from 'src/simi/BaseComponents/Image'
require('./style.scss')


const $ = window.$;

class ProductImage extends React.Component {

    constructor(props) {
        super(props);
        this.title = this.props.title || 'Alt';
        this.showThumbs = this.props.showThumbs || true;
        this.showArrows = this.props.showArrows || true;
        this.showIndicators = this.props.showIndicators || false;
        this.autoPlay = this.props.autoPlay || true;
        // this.showStatus = this.props.showStatus || true;
        this.itemClick = this.props.itemClick || function (e) {
        };
        this.onChange = this.props.onChange || function (e) {
        };
        this.onClickThumb = this.props.onClickThumb || function (e) {
        };
        this.defaultStatusFormatter = function defaultStatusFormatter(current, total) {
            return Identify.__('%c of %t').replace('%c', current).replace('%t', total);
        };
        this.statusFormatter = this.props.statusFormatter || this.defaultStatusFormatter;
        this.infiniteLoop = this.props.infiniteLoop || false;
        this.state = {
            isPhone: window.innerWidth < 1024
        }
    }

    componentDidMount() {
        const obj = this;
        window.onresize = function () {
            const width = window.innerWidth;
            const newIsPhone = width < 1024
            if(obj.state.isPhone !== newIsPhone){
                obj.setState({isPhone: newIsPhone})
            }
        }
    }
    
    
    openImageLightbox = (index) => {
        this.lightbox.showLightbox(index);
    }

    renderImageLighboxBlock = () => {
        let images = this.images
        images = images.map((item) => {
            return item.file
            ? resourceUrl(item.file, { type: 'image-product', width: 640 })
            : transparentPlaceholder
        });
        return (
            <ImageLightbox ref={(lightbox) => {
                this.lightbox = lightbox
            }} images={images}/>
        );
    }

    renderImage() {
        const width = $('.left-layout.product-media').width();
        return this.images.map(function (item) {
            const src = item.file
            ? resourceUrl(item.file, { type: 'image-product', width: 640 })
            : transparentPlaceholder
            return (
                <div key={Identify.randomString(5)} style={{cursor: 'pointer', backgroundColor: '#ffffff'}} className="carousel-image-container">
                    <Image width={width} src={src} height={width} alt={item.url}  style={{objectFit: 'scale-down'}}/>
                </div>
            );
        })
    }

    onChangeItemDefault = () => {
        
    }

    onClickThumbDefault = () => {
        
    }

    sortAndFilterImages = memoize(items =>
        items
            .filter(i => !i.disabled)
            .sort((a, b) => {
                const aPos = isNaN(a.position) ? 9999 : a.position;
                const bPos = isNaN(b.position) ? 9999 : b.position;
                return aPos - bPos;
            })
    );

    mediaGalleryEntries = () => {
        const { props } = this;
        const { product } = props;

        const media_gallery_entries = product.media_gallery_entries ? 
                product.media_gallery_entries :  product.small_image ? 
                    [{file: product.small_image, disabled: false, label: '', position: 1}] : []
                
        const images = [
            ...media_gallery_entries
        ];
        const returnedImages = []
        var obj = {};
        images.forEach(image=> {
            if (!obj[image.file]) {
                obj[image.file] = true
                returnedImages.push(image)
            }
        })

        return returnedImages
    }


    sortedImages() {
        const images= this.mediaGalleryEntries();
        return this.sortAndFilterImages(images);
    }

    renderJs = () => {
        $(document).ready(function () {
            const carousel = $('.carousel.carousel-slider');
            const mediaWidth = carousel.width();
            carousel.height(mediaWidth);
            $('.carousel.carousel-slider img').height(mediaWidth);
        });
    }

    render() {
        this.images = this.sortedImages()
        const {images} = this
        const {isPhone} = this.state;
        return (
            <div className="product-detail-carousel">
                <Carousel 
                        key={(images && images[0] && images[0].file) ? images[0].file : Identify.randomString(5)}
                        showArrows={ this.showArrows}  
                        showThumbs={!isPhone ? true : false}
                        showIndicators={isPhone ? true : false}
                        showStatus={false}
                        onClickItem={(e) => this.openImageLightbox(e)}
                        onClickThumb={(e) => this.onClickThumbDefault(e)}
                        onChange={(e) => this.onChangeItemDefault(e)}
                        infiniteLoop={false}
                        autoPlay={this.autoPlay}
                        thumbWidth={80}
                        statusFormatter={this.statusFormatter}
                >
                    
                    {this.renderImage()}
                </Carousel>
                <div className="fullscreen-icon"></div>
                {this.renderImageLighboxBlock()}
                {this.renderJs()}
            </div>

        );
    }
}

export default ProductImage;