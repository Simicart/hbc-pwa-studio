import React, { useEffect } from 'react';
import ContactForm from './Components/Form';
import Loading from 'src/simi/BaseComponents/Loading'
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Identify from "../../../Helper/Identify";
import ReactHTMLParser from 'react-html-parser';
require('./style.scss');

const Contact = (props) => {

    const storeConfigs = Identify.getStoreConfig();

    if (!storeConfigs) {
        return <Loading />
    }

    const hasContactConfigs = storeConfigs && storeConfigs.simiStoreConfig && storeConfigs.simiStoreConfig.config && storeConfigs.simiStoreConfig.config.contact_configs;

    const showMap = hasContactConfigs && storeConfigs.simiStoreConfig.config.contact_configs.hasOwnProperty('map_enable') && storeConfigs.simiStoreConfig.config.contact_configs.map_enable;

    useEffect(() => {
        if (showMap) {
            const { contact_configs } = storeConfigs.simiStoreConfig.config;
            const latLng = new google.maps.LatLng(Number(contact_configs.latitude), Number(contact_configs.longitude));
            const map = new google.maps.Map(document.getElementById('store_map'), {
                center: latLng,
                zoom: Number(contact_configs.zoom)
            });
            const marker = new google.maps.Marker({ position: latLng, map: map });
        }
    }, []);

    const renderContactDetail = () => {
        if (showMap && storeConfigs.simiStoreConfig.config.contact_configs.contact_info_heading) {
            return <React.Fragment>
                <div className="contacts-title">{Identify.__("Contact")} <b>{Identify.__("Details")}</b></div>
                {ReactHTMLParser(storeConfigs.simiStoreConfig.config.contact_configs.contact_info_heading)}
            </React.Fragment>
        }
        return null;
    }

    return (
        <div className="contact-page">
            {TitleHelper.renderMetaHeader({
                title: Identify.__("Contact"),
                desc: Identify.__("Contact")
            })}
            <div className="container">
                <div className="row">
                    <div id="store_map" style={showMap ? { minHeight: 300, width: '100%' } : {}}></div>
                </div>
                <div className="row" style={{marginTop: 14}}>
                    <div className="col-md-8">
                        <ContactForm />
                    </div>
                    <div className="col-md-4">
                        {renderContactDetail()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
