import Identify from 'src/simi/Helper/Identify';

const { simiStoreConfig } = Identify.getStoreConfig();

export const getGooglePublicKey = () => {
    if(simiStoreConfig.config && simiStoreConfig.config.google_public_key) {
        return simiStoreConfig.config.google_public_key
    }

    return null
}

export const getEasyBanner = (id) => {
    if(simiStoreConfig.config && simiStoreConfig.config.easy_banners) {
        return simiStoreConfig.config.easy_banners.items.find(item => item.identifier === id);
    }

    return null
}

export const getProductLabel = () => {
    if(simiStoreConfig.config && simiStoreConfig.config.product_label) {
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
    const d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

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

export const getFormatMonth = (number) =>{
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
    return months[number -1]
}
