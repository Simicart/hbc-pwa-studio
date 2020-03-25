import Identify from 'src/simi/Helper/Identify';

const { simiStoreConfig } = Identify.getStoreConfig();

export const hasBlogConfig = simiStoreConfig.config && simiStoreConfig.config.hasOwnProperty('amasty_blog_configs') && simiStoreConfig.config.amasty_blog_configs || null;

export const getGooglePublicKey = () => {
    if (simiStoreConfig.config && simiStoreConfig.config.google_public_key) {
        return simiStoreConfig.config.google_public_key
    }

    return null
}

export const getEasyBanner = (id) => {
    if (simiStoreConfig.config && simiStoreConfig.config.easy_banners) {
        return simiStoreConfig.config.easy_banners.items.find(item => item.identifier === id);
    }

    return null
}

export const getProductLabel = () => {
    if (simiStoreConfig.config && simiStoreConfig.config.product_label) {
        return simiStoreConfig.config.product_label;
    }

    return null
}

export const getFormattedDate = (data) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
        "July", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    //let dated = Date.parse(data);
    // console.log(data);
    const t = data.split(/[- :]/);
    // Apply each element to the Date function
    const d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

    const date = new Date(d);
    const dd = date.getDate();
    /* switch (dd){
        case 1:
            dd = dd + 'st'
            break;
        case 2:
            dd = dd + 'nd'
            break;
            case 3:
            dd = dd + 'rd'
            break;
        default:
            dd = dd + 'th'
            break;
    } */
    const yy = date.getFullYear();
    return dd + ' ' + monthNames[date.getMonth()] + ' ' + yy;
}

export const getFormatMonth = (number) => {
    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]
    return months[number - 1]
}

export const getCategoryById = (id) => {
    if (hasBlogConfig && simiStoreConfig.config.amasty_blog_configs.categories_tree.length) {
        const { categories_tree } = simiStoreConfig.config.amasty_blog_configs;
        for (let c = 0; c < categories_tree.length; c++) {
            const cItem = categories_tree[c];
            if (Number(cItem.value) === id) {
                return cItem;
                break;
            } else if (cItem.hasOwnProperty('optgroup') && cItem.optgroup.length) {
                return recursiveBlogCateTree(cItem.optgroup, id);
            }
        }
    }
    return null;
}

function recursiveBlogCateTree(trees, id) {
    for (let k = 0; k < trees.length; k++) {
        const kItem = trees[k];
        if (Number(kItem.value) === id) {
            console.log(kItem)
            return kItem;
            break;
        } else if (kItem.hasOwnProperty('optgroup') && kItem.optgroup.length) {
            return recursiveBlogCateTree(kItem.optgroup, id);
        }
    }
    return null;
}

export function getRootCategoriesArray(root, id) {
    let node;
    for (let i = 0; i < root.length; i++) {
        node = root[i];
        if (Number(node.entity_id) === id || node.child_cats && (node = getRootCategoriesArray(node.child_cats, id))) {
            return node;
        }
    }
    return null;
}

export function getAttributePage () {
    if(
        simiStoreConfig 
        && simiStoreConfig.config
        && simiStoreConfig.config.attribute_page 
        && simiStoreConfig.config.attribute_page.items 
        && simiStoreConfig.config.attribute_page.items.length 
        && simiStoreConfig.config.attribute_page.items.length > 0
    ) {
        return simiStoreConfig.config.attribute_page.items
    }

    return null;
}
