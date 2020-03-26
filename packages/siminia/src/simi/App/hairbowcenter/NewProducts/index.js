import React from 'react';
import LoadingSpiner from 'src/simi/BaseComponents/Loading/LoadingSpiner';
import { number } from 'prop-types';
import simiQueryNewProducts from 'src/simi/queries/catalog/getCateProductsNoFilter.graphql';
import Products from 'src/simi/App/hairbowcenter/BaseComponents/Products';
import Identify from 'src/simi/Helper/Identify';
import { withRouter } from 'react-router-dom';
import { Simiquery } from 'src/simi/Network/Query';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import { applySimiProductListItemExtraField } from 'src/simi/Helper/Product';
import BreadCrumb from "src/simi/BaseComponents/BreadCrumb";
import { smoothScrollToView } from 'src/simi/Helper/Behavior';

const NewProducts = (props) => {

    const { id } = props;
    let pageSize = Identify.findGetParameter('product_list_limit')
    pageSize = pageSize ? Number(pageSize) : 12
    let currentPage = Identify.findGetParameter('page')
    currentPage = currentPage ? Number(currentPage) : 1;

    const variables = {
        pageSize: pageSize,
        currentPage: currentPage,
        stringId: String(id),
        simiFilter: "{\"created_at\":\"new_product\"}",
        sort: {
            created_at: "DESC"
        }
    }

    smoothScrollToView($('#root'))
    return (
        <Simiquery query={simiQueryNewProducts} variables={variables}>
            {({ loading, error, data }) => {
                if (error) return <div>Data Fetch Error</div>;
                if (!data) return <LoadingSpiner />;

                if (data && Object.keys(data).length) {
                    data.products = applySimiProductListItemExtraField(data.simiproducts)
                    if (data.products.simi_filters)
                        data.products.filters = data.products.simi_filters
                }

                const pathArray = [];
                pathArray.unshift({ name: Identify.__("Home"), link: '/' })
                // pathArray.push({ name: data.category.name, link: '#' })

                return (
                    <div className="container">
                        <BreadCrumb breadcrumb={pathArray} />
                        {TitleHelper.renderMetaHeader({
                            title: Identify.__("New Product")
                        })}

                        <Products
                            history={props.history}
                            location={props.location}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            data={loading ? null : data}
                            new_product={true}
                        />
                    </div>
                )

            }}
        </Simiquery>
    );
}

NewProducts.propTypes = {
    id: number,
    pageSize: number
};

NewProducts.defaultProps = {
    id: 3,
    pageSize: 12
};

export default (withRouter)(NewProducts);
