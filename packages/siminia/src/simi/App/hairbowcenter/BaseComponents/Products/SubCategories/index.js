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
        const cateHtml = child_cats.map((child, ix) => {
         
            const thumbnailUrl = child.thumbnail ? resourceUrl(child.thumbnail, { type: 'image-category' }) : '/icons/placeholder.svg' ;
            const subCate = child.child_cats && child.child_cats.length ? child.child_cats.map((subC, idx) => {
                return <li><Link key={ix+idx} to={'/' + subC.url_path} title={subC.name} className="category-name child-category">{subC.name}</Link></li>
            }) : '';
            return <li className="item" key={ix}>
                <Link to={'/' + child.url_path} title={child.name}>
                    <Image src={thumbnailUrl} width={200} heigth={200}/>
                </Link>
                <div className="category-name parent-category">
                    <Link to={'/' + child.url_path}>{child.name}</Link>
                </div>
                {subCate ? <ul className="list-subcategories">{subCate}</ul> : ''}
            </li>
        });
        return <ul className="easycatalog-grid easycatalogimg-cols-3">{cateHtml}</ul>
    }

    return <div className="easycatalogimg">
        {cateR && cateR.child_cats && cateR.child_cats.length ? renderSubCate(cateR.child_cats) : ''}
    </div>
}

export default SubCategories;
