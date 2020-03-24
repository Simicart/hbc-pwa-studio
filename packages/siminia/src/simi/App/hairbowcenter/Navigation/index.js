export { default as Navigation } from './navigation';

import { connect } from 'src/drivers';
import { closeDrawer } from 'src/actions/app';
import { getUserDetails } from 'src/actions/user';
import { getUserPoints } from 'src/simi/Redux/actions/simiactions';
import { createCart, getCartDetails } from 'src/actions/cart';
import Navigation from './navigation';

const mapStateToProps = ({ app, user, cart }) => {
    const { currentUser, isSignedIn } = user;
    const { drawer } = app
    const { cartId } = cart
    return {
        drawer,
        currentUser,
        isSignedIn,
        cartId
    }
}
const mapDispatchToProps = {
    closeDrawer,
    getUserDetails,
    createCart,
    getCartDetails,
    getUserPoints
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
