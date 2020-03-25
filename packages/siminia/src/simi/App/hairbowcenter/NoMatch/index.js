import React from 'react'
import Product from 'src/simi/App/hairbowcenter/RootComponents/Product'
import Category from 'src/simi/App/hairbowcenter/RootComponents/Category'
import CMSPage from 'src/simi/App/hairbowcenter/RootComponents/CMS/CMS'
import Simicms from 'src/simi/App/core/Simicms'
import resolveUrl from 'src/simi/queries/urlResolver.graphql'
import { simiUseQuery } from 'src/simi/Network/Query';
import Loading from 'src/simi/BaseComponents/Loading'
import Identify from 'src/simi/Helper/Identify'
import Page404 from './Page404';
import { getDataFromUrl } from 'src/simi/Helper/Url';
import Blog from 'src/simi/App/hairbowcenter/Blog';
import ResolveUrlResult from './ResolveUrlResult';
import AttributePage from '../AttributePage';
import AtrributePageDetail from '../AttributePage/detail';
import {getAttributePage} from '../Helper';


var parseFromDoc = true
const TYPE_PRODUCT = 'PRODUCT'
const TYPE_CATEGORY = 'CATEGORY'
const TYPE_CMS_PAGE = 'CMS_PAGE'

const NoMatch = props => {
    const {location} = props
    const renderByTypeAndId = (type, id, relative_url, preloadedData = null) => {
        if (type === TYPE_PRODUCT)
            return <Product {...props} preloadedData={preloadedData}/>
        else if (type === TYPE_CATEGORY)
            return <Category {...props} id={parseInt(id, 10)}/>
        else if (type === TYPE_CMS_PAGE){
            if (relative_url === 'simi_blog_post') {
                return <Blog {...props} post_id={parseInt(id, 10)} />
            } else if (relative_url === 'simi_blog_category') {
                return <Blog {...props} category_id={parseInt(id, 10)} />
            } else if (relative_url === 'simi_blog_tag') {
                return <Blog {...props} tag_id={parseInt(id, 10)} />
            } else{
                return <CMSPage {...props} id={parseInt(id, 10)}/>
            }
        }
    }

    const attributePages = getAttributePage();
    if(attributePages && location.pathname) {
        const pathNameArray = location.pathname.split('/')
        let type = 'index';
        if(pathNameArray.length && pathNameArray.length > 2) type = 'detail';

        const page = attributePages.find((attributePage) => location.pathname.indexOf('/' + attributePage.identifier) === 0 )
        if(page) {
            if(type === 'detail') {

                return <AtrributePageDetail page={page} urlKey={pathNameArray[2]}/>
            }
            return <AttributePage page={page}/>
        }
    }   

    if (
        parseFromDoc &&
        document.body.getAttribute('data-model-type') &&
        document.body.getAttribute('data-model-id')&&
        document.body.getAttribute('data-model-relative_url')
    ) {
        parseFromDoc = false
        const type = document.body.getAttribute('data-model-type')
        const id = document.body.getAttribute('data-model-id')
        const relative_url = document.body.getAttribute('data-model-relative_url')
        const result = renderByTypeAndId(type, id, relative_url)
        if (result)
            return result
    } else if (location && location.pathname) {
        parseFromDoc = false
        const pathname = location.pathname

        //load from dict
        const dataFromDict = getDataFromUrl(pathname)
        if (dataFromDict && dataFromDict.id) {
            let type = TYPE_CATEGORY
            const id = dataFromDict.id
            if (dataFromDict.sku)  {
                type = TYPE_PRODUCT
            }
            const result = renderByTypeAndId(type, id, dataFromDict.relative_url, dataFromDict)
            if (result)
                return result
        }
        //check if simicms
        const simiStoreConfig = Identify.getStoreConfig();
        if (simiStoreConfig && simiStoreConfig.simiStoreConfig &&
            simiStoreConfig.simiStoreConfig.config &&
            simiStoreConfig.simiStoreConfig.config.cms &&
            simiStoreConfig.simiStoreConfig.config.cms.cmspages &&
            simiStoreConfig.simiStoreConfig.config.cms.cmspages.length
            ) {
                let simiCms = null
                simiStoreConfig.simiStoreConfig.config.cms.cmspages.forEach(simicmspage => {
                    if (
                        simicmspage.cms_content && simicmspage.cms_url &&
                        (simicmspage.cms_url === pathname) || (`/${simicmspage.cms_url}` === pathname)
                        )
                        simiCms = simicmspage
                });
                if (simiCms)
                    return <Simicms csmItem={simiCms} />
        }


        //get type from server
        return <ResolveUrlResult pathname={pathname} renderByTypeAndId={renderByTypeAndId}/>
    }

    parseFromDoc = false
    return (
        <Loading />
    )
}
export default NoMatch
