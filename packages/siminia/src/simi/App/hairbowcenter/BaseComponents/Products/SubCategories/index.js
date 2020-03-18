import React from 'react';
import { getRootCategoriesArray } from './../../../Helper/index';
import Identify from 'src/simi/Helper/Identify';
import { Link } from 'src/drivers';
import Image from 'src/simi/BaseComponents/Image';
import { resourceUrl } from 'src/simi/Helper/Url';

const SubCategories = (props) => {

    const { cateId } = props;
    let cateR = null;
    const storeConfig = Identify.getStoreConfig();
    if (storeConfig && storeConfig.simiCateTrees && cateId) {
        const jsonParseCateTrees = JSON.parse(storeConfig.simiCateTrees.config_json);
        cateR = getRootCategoriesArray(jsonParseCateTrees.categorytrees, cateId);
    }

    const renderSubCate = (child_cats) => {
        console.log(child_cats);
        const cateHtml = child_cats.map((child, ix) => {
            const thumbnailUrl = child.thumbnail ? resourceUrl(child.thumbnail, { type: 'image-category' }) : require('./../../../Images/placeholder.svg');
            return <li className="item" key={ix}>
                <Link to={'/' + child.url_path} title={child.name}>
                    <Image src={thumbnailUrl} />
                </Link>
                <div className="category-name parent-category">
                    <Link to={'/' + child.url_path}>{child.name}</Link>
                </div>
            </li>
        });
        return <ul className="easycatalog-grid easycatalogimg-cols-3">{cateHtml}</ul>
    }

    return <div className="easycatalogimg">
        {cateR && cateR.child_cats && cateR.child_cats.length ? renderSubCate(cateR.child_cats) : ''}
    </div>
}

export default SubCategories;