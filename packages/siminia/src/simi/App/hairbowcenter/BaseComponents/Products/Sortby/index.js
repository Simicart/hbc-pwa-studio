import React, { useState } from 'react';
import Identify from 'src/simi/Helper/Identify';
import Check from 'src/simi/BaseComponents/Icon/TapitaIcons/SingleSelect';
import { configColor } from "src/simi/Config";
import Dropdownoption from 'src/simi/App/hairbowcenter/BaseComponents/Dropdownoption/'
import { withRouter } from 'react-router-dom';
import isObjectEmpty from 'src/util/isObjectEmpty';

const Sortby = props => {
    const { history, location, sortByData } = props;
    const { search } = location;
    const storageSortDir = Identify.ApiDataStorage('custom_list_sort_dir') || 'ASC';

    // const [sortDirAsc, setSortDirAsc] = useState(storageSortDir);
    let dropdownItem = null
    const orders = [
        { "key": "position", "value": "Position"},
        { "key": "color", "value": "Select Color" },
        { "key": "color_general", "value": "Select Option" },
        { "key": "ribbon_width", "value": "Ribbon Width" },
        { "key": "shabby_prints", "value": "Shabby Prints" },
        { "key": "schiff_colors", "value": "Select Color" },
    ];

    const changedSortBy = (item) => {
        if (dropdownItem && item) {
            dropdownItem.handleToggle();

            Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'custom_list_sort_type', item.key);
            Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'custom_list_sort_dir', storageSortDir);

            const queryParams = new URLSearchParams(search);
            queryParams.set('product_list_order', item.key);
            queryParams.set('product_list_dir', storageSortDir);
            history.push({ search: queryParams.toString() });
        }
    }

    const sortDirectory = (dir) => {
        const dirText = dir === 'DESC' ? 'ASC' : 'DESC';
        let obKey = orders[0].key;
        if (sortByData && !isObjectEmpty(sortByData)) {
            obKey = Object.keys(sortByData)[0];
        } else if (Identify.ApiDataStorage('custom_list_sort_type')) {
            obKey = Identify.ApiDataStorage('custom_list_sort_type');
        }
        Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'custom_list_sort_dir', dirText);
        Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'custom_list_sort_type', obKey);

        const queryParams = new URLSearchParams(search);
        queryParams.set('product_list_order', obKey);
        queryParams.set('product_list_dir', dirText);
        history.push({ search: queryParams.toString() });

    }

    const { classes } = props
    parent = props.parent
    let selections = []

    let sortByTitle = orders[0].value;

    selections = orders.map((item, idx) => {
        let itemCheck = ''
        const itemTitle = `${item.value}`
        if (sortByData && sortByData.hasOwnProperty(`${item.key}`)) {
            itemCheck = (
                <span className={classes["is-selected"]}>
                    <Check color={configColor.button_background} style={{ width: 16, height: 16, marginRight: 4 }} />
                </span>
            )
            sortByTitle = item.value
        }else if (idx === 0 && (!sortByData || Object.keys(sortByData).length < 1)){
            itemCheck = (
                <span className={classes["is-selected"]}>
                    <Check color={configColor.button_background} style={{ width: 16, height: 16, marginRight: 4 }} />
                </span>
            )
        }

        return (
            <div
                role="presentation"
                key={Identify.randomString(5)}
                className={classes["dir-item"]}
                onClick={() => changedSortBy(item)}
            >
                <div className={classes["dir-title"]}>
                    {itemTitle}
                </div>
                <div className={classes["dir-check"]}>
                    {itemCheck}
                </div>
            </div>
        );
    });

    return (
        <div className={classes["top-sort-by"]}>
            {
                selections.length === 0 ?
                    <span></span> :
                    <div className={classes["sort-by-select"]}>
                        <span>{Identify.__("Sort by")}</span>
                        <div className="sort-dropdown">
                            <Dropdownoption
                                classes={classes}
                                title={sortByTitle}
                                ref={(item) => { dropdownItem = item }}
                            >
                                {selections}
                            </Dropdownoption>
                            <span className={`action sorter-action ${storageSortDir === 'ASC' ? 'sort-asc' : 'sort-desc'}`} onClick={() => sortDirectory(storageSortDir)} title={Identify.__("Set Descending Direction")} />
                        </div>
                    </div>
            }
        </div>
    )
}

export default (withRouter)(Sortby);
