import React from 'react'
import resolveUrl from 'src/simi/queries/urlResolver.graphql'
import { simiUseQuery } from 'src/simi/Network/Query';
import Page404 from './Page404'

const ResolveUrlResult = props => {
    const { pathname, renderByTypeAndId } = props

    //get type from server
    const [queryResult, queryApi] = simiUseQuery(resolveUrl);
    const { data } = queryResult;
    const { runQuery } = queryApi;
    if (!data) {
        runQuery({
            variables: {
                urlKey: pathname
            }
        });
    }
    if (data) {
        if (data.urlResolver) {
            const result = renderByTypeAndId(data.urlResolver.type, data.urlResolver.id, data.urlResolver.relative_url)
            if (result)
                return result
        }
        return <Page404 />
    }

    return ''
}

export default ResolveUrlResult;
