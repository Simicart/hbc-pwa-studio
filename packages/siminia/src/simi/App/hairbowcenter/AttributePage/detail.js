import React, {useState, useEffect} from 'react';
import getCategory from 'src/simi/queries/catalog/getCategory.graphql'
import { Simiquery } from 'src/simi/Network/Query'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import { applySimiProductListItemExtraField } from 'src/simi/Helper/Product'
import BreadCrumb from "src/simi/BaseComponents/BreadCrumb"
import { cateUrlSuffix } from 'src/simi/Helper/Url';
import Products from 'src/simi/App/hairbowcenter/BaseComponents/Products';
import {getOption} from '../Model/AttributePage';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import Identify from "src/simi/Helper/Identify";
import LoadingSpiner from 'src/simi/BaseComponents/Loading/LoadingSpiner'
import Loading from 'src/simi/BaseComponents/Loading'

var sortByData = null
var filterData = null

const AtrributePageDetail = props => {  
    const {page, urlKey} = props;
    const [data, setData] = useState(null);
    
    useEffect(() => {
        setData('loading');
        getOption(getOptionCallBack, urlKey);
    }, [])

    const getOptionCallBack = (dataPage) => {
        if(dataPage && dataPage.errors) {
            setData(null);
        } else if (dataPage && dataPage.attributepage) {
            setData(dataPage.attributepage);
        } else {
            setData(null);
        }
    }

    if(data === 'loading') {
        return <Loading />
    } 

    if(!data) {
        return null
    }

    const {simiStoreConfig} = Identify.getStoreConfig();
    const {root_category_id} = simiStoreConfig;

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

    console.log(data)

    const defaultFilter = {};
    console.log(data.attribute_code);
    defaultFilter[data.attribute_code] =  data.option_id

    const variables = {
        id: Number(root_category_id),
        pageSize: pageSize,
        currentPage: currentPage,
        stringId: String(root_category_id),
        simiFilter: JSON.stringify(defaultFilter)
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

    smoothScrollToView($('#root'))
    return (
        <Simiquery query={getCategory} variables={variables}>
            {({ loading, error, data }) => {
                if (error) return <div>Data Fetch Error</div>;
                if (!data || !data.simiproducts) return <LoadingSpiner />;

                if (data) {
                    data.products = applySimiProductListItemExtraField(data.simiproducts)
                    if (data.products.simi_filters)
                        data.products.filters = data.products.simi_filters
                }
                const pathArray = [];
                pathArray.unshift({ name: Identify.__("Home"), link: '/' })
                {/* pathArray.push({ name: , link: '#' }) */}

                return (
                    <div className="container">
                        <BreadCrumb breadcrumb={pathArray} />
                        {TitleHelper.renderMetaHeader({
                            title: data.category.meta_title ? data.category.meta_title : data.category.name,
                            desc: data.category.meta_description
                        })}

                        <Products
                            // title={categoryTitle}
                            // description={categoryDesc}
                            // categoryImage={categoryImage}
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
    
}

export default AtrributePageDetail;