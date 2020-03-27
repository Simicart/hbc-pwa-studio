import React from 'react'
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent'
import Account from 'src/simi/App/hairbowcenter/Customer/Account'
import Login from 'src/simi/App/hairbowcenter/Customer/Login'

const Home = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Home"*/'src/simi/App/hairbowcenter/RootComponents/CMS/Home')} {...props}/>
}

const Checkout = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Checkout"*/'src/simi/App/hairbowcenter/Checkout')} {...props}/>
}

const Thankyou = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Thankyou"*/'src/simi/App/hairbowcenter/Checkout/Thankyou')} {...props}/>
}

const Cart = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Cart"*/'src/simi/App/hairbowcenter/Cart')} {...props}/>
}

const Contact = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Contact"*/'src/simi/App/hairbowcenter/Contact')} {...props}/>
}

const Product = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "SimiProduct"*/'src/simi/App/hairbowcenter/RootComponents/Product')} {...props}/>
}

const Search = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Search"*/'src/simi/App/hairbowcenter/RootComponents/Search')} {...props}/>
}

const Logout = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Logout"*/'src/simi/App/core/Customer/Logout')} {...props}/>
}

const PaypalExpress = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "PaypalExpress"*/'src/simi/App/core/Payment/Paypalexpress')} {...props}/>
}

const NoMatch = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "NoMatch"*/'src/simi/App/hairbowcenter/NoMatch')} {...props}/>
}

const Blog = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Blog"*/'src/simi/App/hairbowcenter/Blog')} {...props}/>
}

const NewProducts = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "NewProducts"*/'src/simi/App/hairbowcenter/NewProducts')} {...props}/>
}

const ResetPassword = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "ResetPassword"*/'src/simi/App/hairbowcenter/Customer/ResetPassword')} {...props}/>
}


const router = {
    home : {
        path: '/',
        render : (location) => <Home {...location}/>
    },
    search_page: {
        path: '/search.html',
        render : (props) => <Search {...props}/>
    },
    cart : {
        path : '/cart.html',
        component : (location)=><Cart {...location}/>
    },
    product_detail : {
        path: '/product.html',
        render : (location) => <Product {...location}/>
    },
    category_page : {
        path: '/category.html',
        render : (location) => <Product {...location}/>
    },
    checkout : {
        path: '/checkout.html',
        render : (location) => <Checkout {...location}/>
    },
    thankyou : {
        path: '/thankyou.html',
        render : (location) => <Thankyou {...location}/>
    },
    login : {
        path: '/login.html',
        render : (location) => <Login {...location} page="login"/>
    },
    create_account: {
        path: '/create-account.html',
        render: (location) => <Login {...location} page="create-account"/>
    },
    forgot_password: {
        path: '/forgot-password.html',
        render: (location) => <Login {...location} page="forgot-password"/>
    },
    logout : {
        path: '/logout.html',
        render : (location) => <Logout {...location}/>
    },
    customer_reset_password : {
        path : '/reset-password.html',
        render : (location) => <ResetPassword {...location} />
    },
    account : {
        path: '/account.html',
        render : (location) => <Account {...location} page='dashboard'/>
    },
    address_book : {
        path : '/addresses.html/:id?',
        render : location => <Account {...location} page={`address-book`} />
    },
    oder_history : {
        path : '/orderhistory.html',
        render : location => <Account {...location} page={`my-order`} />
    },
    order_history_detail : {
        path : '/orderdetails.html/:orderId',
        render : location => <Account {...location} page={`order-detail`} />
    },
    newsletter : {
        path : '/newsletter.html',
        render : location => <Account {...location} page={`newsletter`} />
    },
    profile : {
        path : '/profile.html',
        render : location => <Account {...location} page={`edit-account`} />
    },
    wishlist : {
        path: '/wishlist.html',
        render : (location) => <Account {...location} page={`wishlist`}/>
    },
    share_wishlist : {
        path: '/share-wishlist.html',
        render : (location) => <Account {...location} page={`share-wishlist`}/>
    },
    downloadable_product : {
        path: '/downloadable-product.html',
        render : (location) => <Account {...location} page={`downloadable`}/>
    },
    product_reviews : {
        path: '/product-reviews.html',
        render : (location) => <Account {...location} page={`product-reviews`}/>
    },
    review_detail : {
        path : '/review-detail.html/:reviewId',
        render : location => <Account {...location} page={`review-detail`} />
    },
    help_desk : {
        path: '/help-desk.html/:orderId?',
        render : (location) => <Account {...location} page={`help-desk`}/>
    },
    reward_points : {
        path: '/reward-points.html',
        render : (location) => <Account {...location} page={`reward-points`}/>
    },
    contact: {
        path: '/contact.html',
        render : (location) => <Contact {...location} />
    },
    paypal_express: {
        path: '/paypal_express.html',
        render : location => <PaypalExpress {...location} />
    },
    print: {
        path: '/print.html/:orderId',
        render: location => <Account {...location} page={`print`}/>
    },
    blog: {
        path: '/blog',
        render : (location) => <Blog {...location} />
    },
    new_products: {
        path: '/new-product',
        render : (location) => <NewProducts {...location} />
    },
    noMatch: {
        component : location => <NoMatch {...location} />
    }
}
export default router;
