import React from 'react'
import { Link } from 'src/drivers';
import Newsletter from "./Newsletter";
import Identify from "src/simi/Helper/Identify"
import ReactHTMLParser from 'react-html-parser';
require("./style.scss");

const Footer = props => {

    const merchantConfig = Identify.getStoreConfig();

    const hasFooterConfigs = merchantConfig && merchantConfig.simiStoreConfig && merchantConfig.simiStoreConfig.config.footer_configs ? merchantConfig.simiStoreConfig.config.footer_configs : null;
    if (!hasFooterConfigs) return null;

    const hasFooterMiddle = hasFooterConfigs && hasFooterConfigs.hasOwnProperty('footer_middle') && hasFooterConfigs.footer_middle;
    const hasFooterBottom = hasFooterConfigs && hasFooterConfigs.hasOwnProperty('footer_bottom') && hasFooterConfigs.footer_bottom;

    const renderRibbon = hasFooterMiddle && hasFooterConfigs.footer_middle.footer_ribbon ? <div className="footer-ribbon">
        <span>{hasFooterConfigs.footer_middle.footer_ribbon_text}</span>
    </div> : '';

    const renderColumn1 = () => {
        let html;
        if (hasFooterConfigs && hasFooterMiddle && hasFooterConfigs.footer_middle && hasFooterConfigs.footer_middle.footer_middle_column_1 === 'custom') {
            html = ReactHTMLParser(hasFooterConfigs.footer_middle.footer_middle_column_1_custom.toString().replace(/\/Store/g, '').replace(/\/customer\/account/g, '/account.html').replace(/\/sales\/order\/history/g, '/orderhistory.html').replace(/\/rewards\/account/g, '/reward-points.html').replace(/\/wishlist/g, '/wishlist.html'));
        }
        return html;
    }

    const renderColumn2 = () => {
        let html;
        if (hasFooterConfigs && hasFooterMiddle && hasFooterConfigs.footer_middle && hasFooterConfigs.footer_middle.footer_middle_column_2 === 'custom') {
            html = ReactHTMLParser(hasFooterConfigs.footer_middle.footer_middle_column_2_custom.toString().replace(/\/Store/g, '').replace(/\/contacts/g, '/contact.html'));
        }
        return html;
    }

    const renderColumn3 = () => {
        let html;
        if (hasFooterConfigs && hasFooterMiddle && hasFooterConfigs.footer_middle && hasFooterConfigs.footer_middle.footer_middle_column_3 === 'custom') {
            html = ReactHTMLParser(hasFooterConfigs.footer_middle.footer_middle_column_3_custom.toString().replace(/\/Store/g, ''));
        }
        return html;
    }

    const renderColumn4 = () => {
        let html;
        if (hasFooterConfigs && hasFooterMiddle && hasFooterConfigs.footer_middle) {
            if (hasFooterConfigs.footer_middle.footer_middle_column_4 === 'custom') {
                html = ReactHTMLParser(hasFooterConfigs.footer_middle.footer_middle_column_4_custom.toString().replace(/\/Store/g, ''));
            } else if (hasFooterConfigs.footer_middle.footer_middle_column_4 === 'newsletter') {
                html = <div className="block newsletter">
                    <div className="block-title"><strong>{Identify.__("Don't miss a sale!")}</strong></div>
                    <div className="content">
                        <p>{Identify.__("Keep in touch with us and never miss a sale!  Sign up for our newsletter today.")}</p>
                        <Newsletter />
                    </div>
                </div>
            }
        }
        return html;
    }

    const renderFooterMiddle = () => {
        return <div className="footer-middle">
            <div className="container">
                {renderRibbon}
                <div className="row">
                    {renderColumn1() && <div className="col-lg-3">
                        {renderColumn1()}
                    </div>}
                    {renderColumn2() && <div className="col-lg-3">
                        {renderColumn2()}
                    </div>}
                    {renderColumn2() && <div className="col-lg-3">
                        {renderColumn3()}
                    </div>}
                    <div className="col-lg-3">
                        {renderColumn4()}
                        <p>
                            <br />
                            <a href="https://secure.trust-guard.com/security/9772" target="_blank" rel="nofollow" name="trustlink">
                                <img style={{ border: 0 }} src="//secure.trust-guard.com/seals/stacked/9772-lg.gif" alt="Security Seals" name="trustseal" />
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    }

    const renderFooterBottom = () => {
        return <div className="footer-bottom">
            <div className="container">
                {hasFooterBottom && hasFooterConfigs.footer_bottom.footer_bottom_custom_1 ? <div className="custom-block">
                    {ReactHTMLParser(hasFooterConfigs.footer_bottom.footer_bottom_custom_1)}
                </div> : ''}
                {hasFooterBottom && hasFooterConfigs.footer_bottom.footer_bottom_copyrights ? <address>{ReactHTMLParser(hasFooterConfigs.footer_bottom.footer_bottom_copyrights.toString().replace(/\/Store/g, ''))}</address> : ''}
            </div>
        </div>
    }

    return (
        <footer className="page-footer">
            <div className="footer">
                {renderFooterMiddle()}
                {renderFooterBottom()}
            </div>
        </footer>
    )
}
export default Footer;
