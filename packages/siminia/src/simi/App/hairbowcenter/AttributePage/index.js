import React, { useEffect, useState } from 'react';
import ReactHTMLParse from 'react-html-parser';
import {getOptionList} from '../Model/AttributePage';
import Loading from 'src/simi/BaseComponents/Loading'
import Image from 'src/simi/BaseComponents/Image'
import {Link} from 'react-router-dom';
import TitleHelper from 'src/simi/Helper/TitleHelper'
import BreadCrumb from "src/simi/BaseComponents/BreadCrumb"
import Identify from "src/simi/Helper/Identify";
require('./attributepage.scss');

const AttributePage = props => {
    const {page} = props
    const [data, setData] = useState(null);
    const basePath = '/' + page.identifier;
    let displaySettings = null;
    if(page.display_settings) {
        displaySettings = JSON.parse(page.display_settings);
    }

    useEffect(() => {
        const params = {
            attribute_id: page.attribute_id,
        }
        if(page.excluded_option_ids) params.excluded_option_ids = page.excluded_option_ids
        setData('loading');
        getOptionList(getOptionListCallBack, params);
    }, [])

    const getOptionListCallBack = (data) => {
        if(data.errors) {
            setData(null);
        } else {
            setData(data);
        }
    }

    const renderContentItem = (item) => {
        console.log(displaySettings);
        if(displaySettings && displaySettings.listing_mode === 'link') {
            return item.name
        } 

        return <Image src={item.image} alt={item.name} />
    }

    const renderOptions = () => {
        if(!data.attributepages || !data.attributepages.length || data.attributepages.length <= 0) {
            return "This page has no options"
        }

        const cols = displaySettings.column_count || 5

        const classRow = 'attributepages-cols-' + cols;

        const html = data.attributepages.map((item, index) => {
            return (
                <li className="item" key={index}>
                    <Link to={basePath + '/' + item.identifier} alt={item.name}>
                        {renderContentItem(item)}
                    </Link>
                </li>
            )
        })

        return (
            <ul className={`attributepages-grid ${classRow}`} >  
                {html}
            </ul>
        )
    }

    if(data === 'loading') {
        return <Loading />
    }

    if(!data) {
        return null;
    }

    let style = {}
    if(page.root_template) {
        if(page.root_template === '2columns-left') {
            style.width = '75%'
            style.marginRight = 'auto'
        } else if(page.root_template === '2columns-right') {
            style.width = '75%'
            style.marginLeft = 'auto'
        } else if(page.root_template === '3columns') {
            style.width = '50%'
            style.margin = '0 auto'
        }
    }

    return (
        <div className="page-attribute-wrapper">
            <BreadCrumb breadcrumb={[
                { name: Identify.__("Home"), link: '/' },
                { name: page.title }
            ]} />

            {TitleHelper.renderMetaHeader({
                title: page.meta_title ? page.meta_title : page.title,
                desc: page.meta_description
            })}
            <div className="container">
                <h1 className="page-title">
                    <span className="base">{page.page_title}</span>
                </h1>
                <div className="main-content" style={style}>
                    {displaySettings.display_mode !== "children" && <div className="category-description std">
                        {ReactHTMLParse(page.content)}
                    </div>}
                    {displaySettings.display_mode !== "description" && <div className="attributepages-grid-wrapper attributepages-options">
                        {renderOptions()} 
                    </div>}
                </div>
            </div>
        </div>
    );

}

export default AttributePage;