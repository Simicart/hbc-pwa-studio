import React from 'react';
import PropTypes from 'prop-types';
import BundlePrice from './Bundle';
import Simple from './Simple';
import Grouped from './Grouped';
require('./price.scss');

class PriceComponent extends React.Component {
    constructor(props) {
        super(props);
        this.type = this.props.type;
    }

    renderView() {
        this.prices = this.props.prices
        if (this.type === "bundle") {
            return <BundlePrice prices={this.prices} parent={this} classes={this.props.classes} />
        }
        else if (this.type === "grouped") { 
            // for list page group product
            return <Grouped prices={this.prices} parent={this} classes={this.props.classes} />
        }
        else {
            ////simple, configurable ....
            return <Simple prices={this.prices} parent={this} classes={this.props.classes} showLabel={this.props.showLabel} isSale={this.props.isSale}/>
        }
    }

    render() {
        const {props} = this
        const classes = props.clasess?props.clasess:{}
        return (
            <div className={`price-${this.type} ${classes[`price-${this.type}`]}`}>{this.renderView()}</div>
        );
    }
}
PriceComponent.defaultProps = {
    prices : 0,
    type : 'simple',
    stylePrice : {},
    styleSpecialPrice : {},
    classes : {},
    showLabel: false,
    isSale: undefined
};
PriceComponent.propTypes = {
    type : PropTypes.string,
    stylePrice : PropTypes.object,
    styleSpecialPrice : PropTypes.object,
    classes : PropTypes.object,
    showLabel: PropTypes.bool
};
export default PriceComponent;