import React, { useEffect, useState } from 'react';
import ReactHTMLParse from 'react-html-parser';
import {getOptionList} from '../Model/AttributePage';
import Loading from 'src/simi/BaseComponents/Loading'
import Image from 'src/simi/BaseComponents/Image'
import {Link} from 'react-router-dom';
require('./attributepage.scss');

const AttributePage = props => {
    const {page} = props
    const [data, setData] = useState(null);
    const basePath = '/' + page.identifier;
    
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

    const renderOptions = () => {
        if(!data.attributepages || !data.attributepages.length || data.attributepages.length <= 0) {
            return "This page has no options"
        }

        const html = data.attributepages.map((item, index) => {
            return (
                <li className="item" key={index}>
                    <Link to={basePath + '/' + item.identifier} alt={item.name}>
                        {<Image src={item.image} alt={item.name} />}
                    </Link>
                </li>
            )
        })

        return (
            <ul className="attributepages-grid attributepages-cols-5 mode-image"> 
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

    
    return (
        <div className="page-attribute-wrapper">
            <div className="container">
                <h1 className="page-title">
                    <span className="base">{page.page_title}</span>
                </h1>
                <div className="main-content">
                    <div className="category-description std">
                        {ReactHTMLParse(page.content)}
                    </div>
                    <div className="attributepages-grid-wrapper attributepages-options">
                        {renderOptions()}
                        
                    </div>
                </div>
            </div>
        </div>
    );

}

export default AttributePage;