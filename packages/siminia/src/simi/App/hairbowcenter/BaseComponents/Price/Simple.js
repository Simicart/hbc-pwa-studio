import React from 'react';
import Abstract from './Abstract';
import Identify from 'src/simi/Helper/Identify'

class Simple extends Abstract {
    renderView=()=>{
        const {classes} = this.props
        ////simple, configurable ....
        let price_label = <div></div>;
        let special_price_label = <div></div>;
        let price_excluding_tax = <div></div>;
        let price_including_tax = <div></div>;
        let price = <div></div>;
        if (
            typeof this.props.isSale === 'undefined' && (this.prices.regularPrice.amount.value !== this.prices.minimalPrice.amount.value || this.prices.has_special_price)
            || this.props.isSale
        ) {
            
            if (this.prices.show_ex_in_price !== null && this.prices.show_ex_in_price === 1) {
                
                special_price_label = (<div>{this.prices.special_price_label}</div>);
                price_excluding_tax = (
                    <div>{Identify.__('Excl. Tax')}: {this.formatPrice(this.prices.minimalPrice.excl_tax_amount.value, this.prices.minimalPrice.amount.currency)}</div>
                );
                price_including_tax = (
                    <div>{Identify.__('Incl. Tax')}: {this.formatPrice(this.prices.minimalPrice.amount.value, this.prices.minimalPrice.amount.currency)}</div>
                );
            } else {
                price = (<div className="final-price">{this.formatPrice(this.prices.minimalPrice.amount.value, this.prices.minimalPrice.amount.currency)}</div>);
            }
            
            price_label = (
                <div className="old-price">{this.props.showLabel ? <span className="label">{Identify.__('was')}</span> : null}<span className="old-price-label">{this.formatPrice(this.prices.regularPrice.amount.value, false)}</span></div>
                // <div>{Identify.__('Regular Price')}: {this.formatPrice(this.prices.regularPrice.amount.value, false)} <span
                //     className={classes["sale_off"]}>-{this.prices.discount_percent}%</span></div>
            );
        } else {
            if (this.prices.show_ex_in_price !== null && this.prices.show_ex_in_price === 1) {
                price_excluding_tax = (
                    <div>{Identify.__('Excl. Tax')}: {this.formatPrice(this.prices.minimalPrice.excl_tax_amount.value, this.prices.minimalPrice.amount.currency)}</div>
                );
                price_including_tax = (
                    <div>{Identify.__('Incl. Tax')}: {this.formatPrice(this.prices.minimalPrice.amount.value, this.prices.minimalPrice.amount.currency)}</div>
                );
            } else {
                price = (<div>{this.formatPrice(this.prices.minimalPrice.amount.value, this.prices.minimalPrice.amount.currency)}</div>);
            }
        }
        return (
            <div className="product-prices" >
                {price_label}
                {price}
                {special_price_label}
                {price_excluding_tax}
                {price_including_tax}
            </div>
        );
    };

    render(){
        return super.render();
    }
}
export default Simple;