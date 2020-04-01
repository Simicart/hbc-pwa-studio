import React from 'react';
import LoadingSpiner from 'src/simi/BaseComponents/Loading/LoadingSpiner'
import { number } from 'prop-types';
import simicntrCategoryQuery from 'src/simi/queries/catalog/getCategory.graphql'
import Products from 'src/simi/App/hairbowcenter/BaseComponents/Products';
import Identify from 'src/simi/Helper/Identify';
import ObjectHelper from 'src/simi/Helper/ObjectHelper';
import { withRouter } from 'react-router-dom';
import { Simiquery } from 'src/simi/Network/Query'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import { applySimiProductListItemExtraField } from 'src/simi/Helper/Product'
import BreadCrumb from "src/simi/BaseComponents/BreadCrumb"
import { cateUrlSuffix } from 'src/simi/Helper/Url';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';

var sortByData = null
var filterData = null

const genPath = (item, id, pathArray) => {
    if (item.entity_id && Number(item.entity_id) === id) {
        return true
    } else if (item.child_cats && Array.isArray(item.child_cats)) {
        let hasTheOne = false
        item.child_cats.map(child => {
            if (!hasTheOne) hasTheOne = genPath(child, id, pathArray)
        })
        if (hasTheOne) {
            if (item.url_path) pathArray.unshift({ name: item.name, link: '/' + item.url_path + cateUrlSuffix() })
            return true
        }
    } else if (item.categorytrees && Array.isArray(item.categorytrees)) {
        let hasCOne = false
        item.categorytrees.map(child => {
            if (!hasCOne) hasCOne = genPath(child, id, pathArray)
        })
        if (hasCOne) {
            if (item.url_path) pathArray.unshift({ name: item.name, link: '/' + item.url_path + cateUrlSuffix() })
            return true
        }
    }
    return false
}

const Category = props => {
    const { id } = props;
    let pageSize = Identify.findGetParameter('product_list_limit')
    pageSize = pageSize ? Number(pageSize) : 20
    let currentPage = Identify.findGetParameter('page')
    currentPage = currentPage ? Number(currentPage) : 1
    sortByData = null
    const productListOrder = Identify.findGetParameter('product_list_order')
    const productListDir = Identify.findGetParameter('product_list_dir')
    const newSortByData = productListOrder ? productListDir ? { [productListOrder]: productListDir.toUpperCase() } : { [productListOrder]: 'ASC' } : null
    if (newSortByData && (!sortByData || !ObjectHelper.shallowEqual(sortByData, newSortByData))) {
        sortByData = newSortByData
    }
    filterData = null
    const productListFilter = Identify.findGetParameter('filter')
    if (productListFilter) {
        if (JSON.parse(productListFilter)) {
            filterData = productListFilter
        }
    }

    const variables = {
        id: Number(id),
        pageSize: pageSize,
        currentPage: currentPage,
        stringId: String(id),
        simiProductSort: {
            attribute: 'position',
            direction: 'ASC'
        }
    }
    if (filterData)
        variables.simiFilter = filterData
    if (sortByData) {
        const sortAtt = {};
        for (let i in sortByData) {
            sortAtt['attribute'] = i;
            sortAtt['direction'] = sortByData[i];
        }
        variables.simiProductSort = sortAtt
    }

    const cateQuery = simicntrCategoryQuery
    smoothScrollToView($('#root'))
    return (
        <Simiquery query={cateQuery} variables={variables}>
            {({ loading, error, data }) => {
                if (error) return <div>Data Fetch Error</div>;
                if (!data || !data.category) return <LoadingSpiner />;

                if (data) {
                    data.products = applySimiProductListItemExtraField(data.simiproducts)
                    if (data.products.simi_filters)
                        data.products.filters = data.products.simi_filters
                }
                const categoryTitle = data && data.category ? data.category.name : '';
                const categoryDesc = data && data.category ? data.category.description : '';
                const categoryImage = data && data.category ? data.category.image : '';
                const pathArray = [];
                const storeConfig = Identify.getStoreConfig();
                if (storeConfig && storeConfig.simiCateTrees && data.category.id) {
                    const jsonParseCateTrees = JSON.parse(storeConfig.simiCateTrees.config_json);
                    genPath(jsonParseCateTrees, data.category.id, pathArray);
                }
                pathArray.unshift({ name: Identify.__("Home"), link: '/' })
                pathArray.push({ name: data.category.name, link: '#' })

                return (
                    <div className="container">
                        <BreadCrumb breadcrumb={pathArray} />
                        {TitleHelper.renderMetaHeader({
                            title: data.category.meta_title ? data.category.meta_title : data.category.name,
                            desc: data.category.meta_description
                        })}

                        <Products
                            title={categoryTitle}
                            description={categoryDesc}
                            categoryImage={categoryImage}
                            history={props.history}
                            location={props.location}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            data={loading ? null : data}
                            sortByData={sortByData}
                            filterData={filterData ? JSON.parse(productListFilter) : null}
                            cateId={data.category.id}
                        />
                    </div>
                )

            }}
        </Simiquery>
    );
};

Category.propTypes = {
    id: number,
    pageSize: number
};

Category.defaultProps = {
    id: 3,
    pageSize: 12
};

export default (withRouter)(Category);
