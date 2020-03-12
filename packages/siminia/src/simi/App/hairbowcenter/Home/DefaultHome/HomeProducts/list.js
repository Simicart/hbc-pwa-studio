import React, { useEffect } from 'react';
import Identify from "src/simi/Helper/Identify";
import { simiUseQuery } from 'src/simi/Network/Query' 
import getCategory from 'src/simi/queries/catalog/getCategory.graphql'
import getProductsBySkus from 'src/simi/queries/catalog/getProductsBySkus.graphql'
import Loading from "src/simi/BaseComponents/Loading";
import { GridItem } from 'src/simi/App/hairbowcenter/BaseComponents/GridItem'
import {applySimiProductListItemExtraField} from 'src/simi/Helper/Product'

const ProductList = props => {
    const { dataProduct, history, active, numberList} = props;
    let useQuery = getCategory;
    let variables = {
        id: Number(dataProduct.category_id),
        pageSize: Number(8),
        currentPage: Number(1),
        stringId: String(dataProduct.category_id),
        simiProductSort: {
            attribute: 'created_at',
            direction: 'DESC'
        }
    }
    if(dataProduct.product_array && dataProduct.product_array.length > 0) {
        useQuery = getProductsBySkus
        variables = {
            stringSku: dataProduct.product_array,
            currentPage: Number(1),
            pageSize: Number(dataProduct.product_array.length),
            simiProductSort: {
                attribute: 'created_at',
                direction: 'DESC'
            }
        }
    }
    const [queryResult, queryApi] = simiUseQuery(useQuery);
    const {data} = queryResult
    const {runQuery} = queryApi
    
    useEffect(() => {
        runQuery({
            variables
        })
    },[])

    if(!data) return <Loading />

    const handleAction = (location) => {
        history.push(location);
    }

    const shuffleArray = (items) => {
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }

        return items;
    }   

    const renderProductList = (items) => {
        let shuffledItems = items;
        if(parseInt(dataProduct.list_type) === 8) {
            shuffledItems = shuffleArray(items); 
        }
        
        return shuffledItems.map((item, index) => {
            if(index < 8) {
                const itemData =  {
                    ...item,
                    small_image:
                        typeof item.small_image === 'object' && item.small_image.hasOwnProperty('url') ? item.small_image.url : item.small_image
                }
                return (
                    <GridItem
                        item={itemData}
                        handleLink={handleAction}
                        list_type="grid"
                        lazyImage
                        hideActionButton={true}
                        key={index}
                    />
                )
            }

            return null;
        });
    }

    let style = {
        display: 'none'
    }
    if(active) {
        style = {
            display: 'block'
        }
    }

    if(data.simiproducts.items && data.simiproducts.total_count > 0) {
        const productItem = applySimiProductListItemExtraField(data.simiproducts);
        return (
            <div id={`product-list-${numberList}`} className="data-item content" style={style}>
                <div className="products wrapper grid columns4 flex-grid products-grid">
                    <ol className="filterproducts products list items product-items ">
                        {renderProductList(productItem.items)}
                    </ol>
                </div>
            </div>
        );
 
    }

  
    return (
        <div id={`product-list-${numberList}`} className="data-item content" style={style}>
            <div className="products wrapper grid columns4 flex-grid products-grid">
                <ol className="filterproducts products list items product-items ">
                    {'Product was found'}
                </ol>
            </div>
        </div>
    );

}

export default ProductList;