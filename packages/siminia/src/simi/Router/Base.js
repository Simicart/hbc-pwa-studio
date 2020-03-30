import React from 'react'
import Identify from "src/simi/Helper/Identify"
import { Switch, Route } from 'react-router-dom';
import {PbPageHoc} from 'src/simi/BaseComponents/Pbpage';
import {smoothScrollToView} from "src/simi/Helper/Behavior";

class Abstract extends React.Component{
    render(){
        const simicartConfig = Identify.getAppDashboardConfigs() !== null ? Identify.getAppDashboardConfigs()
            : Identify.getAppDashboardConfigsFromLocalFile();
        const merchantConfig = Identify.getStoreConfig();
        if(simicartConfig
            && merchantConfig
            && merchantConfig.simiStoreConfig)
        {
            //add rtl
            this.renderRTL(merchantConfig.simiStoreConfig)
        }
        smoothScrollToView($('#root'))
        return (
            this.renderLayout()
        )
    }

    renderLayout = ()=>{
        return null;
    }

    /**
    * Page builder routes
    * @returns array
    */
    renderPbRoute = () => {
        const pbRoutes = []
        const simicartConfig = Identify.getAppDashboardConfigs() !== null ? Identify.getAppDashboardConfigs()
        : Identify.getAppDashboardConfigsFromLocalFile();
        if (simicartConfig) {
            const config = simicartConfig['app-configs'][0];
            if (
                config.api_version &&
                parseInt(config.api_version, 10) &&
                config.themeitems &&
                config.themeitems.pb_pages &&
                config.themeitems.pb_pages.length
                ) {
                const merchantConfigs = Identify.getStoreConfig();
                if (merchantConfigs &&
                    merchantConfigs.storeConfig &&
                    merchantConfigs.storeConfig.id) {
                    const storeId = merchantConfigs.storeConfig.id
                    config.themeitems.pb_pages.forEach(element => {
                        if (
                            element.url_path &&
                            element.url_path !== '/' &&
                            element.storeview_visibility &&
                            (element.storeview_visibility.split(',').indexOf(storeId.toString()) !== -1)
                        ){
                            const routeToAdd = {
                                path : element.url_path,
                                render: (props) => <PbPageHoc {...props} pb_page_id={element.entity_id}/>
                            }
                            pbRoutes.push(<Route key={`pb_page_${element.entity_id}`} exact {...routeToAdd}/>)
                        }
                    });
                }
            }
        }
        return pbRoutes
    }

    renderRoute =(router = null)=>{
        if(!router) return <div></div>
        return (
            <Switch>
                <Route exact {...router.home}/>
                <Route exact {...router.search_page}/>
                <Route exact {...router.cart}/>
                <Route exact {...router.product_detail}/>
                <Route exact {...router.category_page}/>
                <Route exact {...router.checkout}/>
                <Route exact {...router.thankyou}/>
                <Route exact {...router.account}/>
                <Route exact {...router.address_book}/>
                <Route exact {...router.oder_history}/>
                <Route exact {...router.order_history_detail}/>
                <Route exact {...router.newsletter}/>
                <Route exact {...router.profile}/>
                <Route exact {...router.wishlist}/>
                <Route exact {...router.share_wishlist}/>
                <Route exact {...router.downloadable_product}/>
                <Route exact {...router.product_reviews}/>
                <Route exact {...router.review_detail}/>
                <Route exact {...router.help_desk}/>
                <Route exact {...router.help_desk_ticket}/>
                <Route exact {...router.reward_points}/>
                <Route exact {...router.login}/>
                <Route exact {...router.create_account} />
                <Route exact {...router.forgot_password} />
                <Route exact {...router.logout}/>
                <Route exact {...router.customer_reset_password} />
                <Route exact {...router.contact}/>
                <Route exact {...router.paypal_express}/>
                <Route exact {...router.print} />
                <Route exact {...router.blog} />
                <Route exact {...router.new_products} />
                {this.renderPbRoute()}
                <Route {...router.noMatch}/>
            </Switch>
        )
    }

    componentDidMount(){
        // sessionStorage.removeItem('ticket_list_local');
    }


    renderRTL = (simiStoreConfig)=>{
        //add rtl
        if (simiStoreConfig.config && parseInt(simiStoreConfig.config.base.is_rtl, 10) === 1) {
            console.log('Is RTL');
        } else {
            try {
                document.getElementById("rtl-stylesheet").remove();
            }
            catch (err) {

            }
        }
    }
}

export default Abstract
