import React, {useState, useEffect} from 'react';
import getCateProductsNoFilter from 'src/simi/queries/catalog/getCateProductsNoFilter.graphql'
import { Simiquery } from 'src/simi/Network/Query'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import { applySimiProductListItemExtraField } from 'src/simi/Helper/Product'
import BreadCrumb from "src/simi/BaseComponents/BreadCrumb"
import { cateUrlSuffix } from 'src/simi/Helper/Url';
import ReactHTMLParse from 'react-html-parser';
import Products from 'src/simi/App/hairbowcenter/BaseComponents/Products';
import {getOption} from '../Model/AttributePage';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import Identify from "src/simi/Helper/Identify";
import LoadingSpiner from 'src/simi/BaseComponents/Loading/LoadingSpiner'
import Loading from 'src/simi/BaseComponents/Loading'
require('./attributepage.scss');

var sortByData = null
var filterData = null

const AtrributePageDetail = props => {  
    const {page, urlKey, location} = props;
    const [pageData, setPageData] = useState(null);
    
    useEffect(() => {
        setPageData('loading');
        getOption(getOptionCallBack, urlKey);
    }, [])

    const getOptionCallBack = (data) => {
        if(data && data.errors) {
            setPageData(null);
        } else if (data && data.attributepage) {
            setPageData(data.attributepage);
        } else {
            setPageData(null);
        }
    }

    if(pageData === 'loading') {
        return <Loading />
    } 

    if(!pageData) {
        return null
    }

    let displaySettings = null;
    if(pageData.display_settings) {
        displaySettings = JSON.parse(pageData.display_settings);
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

    const defaultFilter = {};
    defaultFilter[pageData.attribute_code] =  pageData.option_id

    const variables = {
        id: Number(root_category_id),
        pageSize: pageSize,
        currentPage: currentPage,
        stringId: String(root_category_id),
        simiFilter: JSON.stringify(defaultFilter),
        simiProductSort: {
            attribute: 'cat_index_position',
            direction: 'asc'
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

    smoothScrollToView($('#root'))
    return (
        <Simiquery query={getCateProductsNoFilter} variables={variables}>
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
                pathArray.push({ name: page.title, link: `/${page.identifier}` })
                pathArray.push({ name: pageData.title })

                const style = {width: '100%' }
                if(pageData.root_template) {
                    if(pageData.root_template === '2columns-left') {
                        style.width = '75%'
                        style.marginLeft = 'auto'
                    } else if(pageData.root_template === '2columns-right') {
                        style.width = '75%'
                        style.marginRight = 'auto'
                    } else if(pageData.root_template === '3columns') {
                        style.width = '50%'
                        style.margin = '0 auto'
                    }
                }

                return (
                    <div className="page-attribute-wrapper">
                        
                        <div className="container">
                            <BreadCrumb breadcrumb={pathArray} />
                            {TitleHelper.renderMetaHeader({
                                title: pageData.meta_title ? pageData.meta_title : pageData.page_title,
                                desc: pageData.meta_description
                            })}
                            
                            <h1 className="page-title">
                                <span className="base">{pageData.page_title}</span>
                            </h1>
                            <div className="main-content" style={style}>
                                {page.content && displaySettings.display_mode !== 'children' && <div className="category-description std">
                                    {ReactHTMLParse(pageData.content)}
                                </div>}
                                {displaySettings.display_mode !== 'description' && <Products
                                    history={props.history}
                                    location={props.location}
                                    currentPage={currentPage}
                                    pageSize={pageSize}
                                    data={loading ? null : data}
                                    sortByData={sortByData}
                                    filterData={filterData ? JSON.parse(productListFilter) : null}
                                    search={true}
                                />}
                            </div>
                        </div>
                    </div>
                    
                )
            }}
        </Simiquery>
    );
    
}

export default AtrributePageDetail;