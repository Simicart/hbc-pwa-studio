import Identify from 'src/simi/Helper/Identify';

const storeConfig = Identify.getStoreConfig();
const simiStoreConfig = storeConfig && storeConfig.simiStoreConfig;
export const hasBlogConfig = simiStoreConfig && simiStoreConfig.config && simiStoreConfig.config.hasOwnProperty('amasty_blog_configs') && simiStoreConfig.config.amasty_blog_configs || null;

export const getGooglePublicKey = () => {
    const storeConfig = Identify.getStoreConfig();
    if (storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.google_public_key) {
        return simiStoreConfig.config.google_public_key
    }

    return null
}

export const getEasyBanner = (id) => {
    const storeConfig = Identify.getStoreConfig();
    if (storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.easy_banners) {
        return storeConfig.simiStoreConfig.config.easy_banners.items.find(item => item.identifier === id);
    }

    return null
}

export const getProductLabel = () => {
    const storeConfig = Identify.getStoreConfig();
    if (storeConfig && storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.product_label) {
        return storeConfig.simiStoreConfig.config.product_label;
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
    const storeConfig = Identify.getStoreConfig();
    if (storeConfig.simiStoreConfig && hasBlogConfig && storeConfig.simiStoreConfig.config.amasty_blog_configs.categories_tree.length) {
        const { categories_tree } = storeConfig.simiStoreConfig.config.amasty_blog_configs;
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

export function getAttributePage() {
    const storeConfig = Identify.getStoreConfig();
    if (
        storeConfig.simiStoreConfig
        && storeConfig.simiStoreConfig.config
        && storeConfig.simiStoreConfig.config.attribute_page
        && storeConfig.simiStoreConfig.config.attribute_page.items
        && storeConfig.simiStoreConfig.config.attribute_page.items.length
        && storeConfig.simiStoreConfig.config.attribute_page.items.length > 0
    ) {
        return storeConfig.simiStoreConfig.config.attribute_page.items
    }

    return null;
}

export const convertImageToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const niceBytes = (x) => {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
        n = n / 1024;
    }
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}
