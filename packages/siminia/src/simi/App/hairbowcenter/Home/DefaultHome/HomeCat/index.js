import React from 'react';
import { Link } from 'react-router-dom';
import Identify from "src/simi/Helper/Identify";
import {cateUrlSuffix} from 'src/simi/Helper/Url';
require('./homecat.scss')

const HomeCat = props => {
    const {data} = props;

    const renderChildItems = (cat) => {
        if(cat.has_children && cat.children) {
            const numberCatChild = cat.children.length;
            return cat.children.map((item, index) => {
                if (index < 4) {
                    return (
                        <li key={index}>
                            <Link to={item.request_path}>{item.name}</Link>
                        </li>
                    )
                    
                } else if(index === 4) {
                    if(numberCatChild === 5) {
                        return (
                            <li key={index}>
                                <Link to={item.request_path}>{item.name}</Link>
                            </li>
                        )
                    } else {
                        return (
                            <li key={index}>
                                <Link className="link-more" to={cat.url_path + cateUrlSuffix()}>{`More in ${cat.cat_name}...`}</Link>
                            </li>
                        )
                    }
                }
            })
        }
    }

    const renderItems = () => {
        if(data.home && data.home.homecategories && data.home.homecategories.homecategories && data.home.homecategories.homecategories.length > 0) {
            const dataCat = data.home.homecategories.homecategories;
            return dataCat.map((item, index) => (
                <li className="item" key={index}>
                    <h5 className="category-name parent-category">
                        <Link to={item.url_path + cateUrlSuffix()}>{item.cat_name}</Link>
                    </h5>
                    <Link className="product-image" to={item.url_path + cateUrlSuffix()}>
                        <img src={item.simicategory_filename} alt={item.cat_name}/>
                    </Link>

                    <ul className="list-subcategories">
                        {renderChildItems(item)}
                    </ul>
                </li>
            ))
        } 

        return null
    }

    return (
        <div className="home-category">
            <h2 className="filterproduct-title">
                <span className="content">
                    <strong>Categories</strong>
                </span>
                <hr className="home-middle-line"/>
            </h2>
            <div className="row">
                <div className="col-12"> 
                    <div className="easycatalogimg">
                        <ul className="easycatalog-grid easycatalogimg-cols-5">
                            {renderItems()}
                        </ul>
                    </div>
                </div>
                
            </div>
        </div>
    );

}

export default HomeCat;