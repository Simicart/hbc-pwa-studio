import React, { Component } from 'react'
require('./popup.scss');
const $ = window.$;

class Popup extends Component {
    constructor(props) {
        super(props);
        this.width = this.props.width;
        this.height = this.props.height;
    }

    handleClose = (e) => {
        e.preventDefault();
        $('#fancybox').hide();
    }

    render() {
        console.log('run');
        const {width, height} = this;

        return (
            <div id="fancybox" className="fancybox-overlay fancybox-overlay-fixed">
                <div className="fancybox-wrap fancybox-desktop fancybox-type-inline fancybox-opened" style={{width}}>
                    <div className="fancybox-skin">
                        <div className="fancybox-outer">
                            <div className="fancybox-inner" style={{width, height}}>
                                {this.props.children}
                            </div>
                        </div>
                        <a href="#" className="fancybox-item fancybox-close fancybox-newsletter-close" title="Close" onClick={(e) => this.handleClose(e)}></a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Popup;
