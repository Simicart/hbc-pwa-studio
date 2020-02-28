import React, { useState } from 'react'
import Identify from "src/simi/Helper/Identify";
import defaultClasses from '../header.css'
import SearchAutoComplete from './searchAutoComplete/index'
import { mergeClasses } from 'src/classify'
require('./search.scss')

const SearchForm = props => {
    let searchField = null
    const [showAC, setShowAC] = useState(false)
    const [searchVal, setSearchVal] = useState('')

    const startSearch = () => {
        if (searchVal) {
            props.history.push(`/search.html?query=${searchVal}`)
        }
    }
    const handleSearchField = () => {
        if (searchField.value) {
            setShowAC(true)
            if (searchField.value !== searchVal)
                setSearchVal(searchField.value)
        } else {
            setShowAC(false)
        }
    }

    const classes = mergeClasses(defaultClasses, props.classes)

    return (
        <div className={classes['header-search-form']}>
            <label htmlFor="siminia-search-field" className="hidden">{Identify.__('Search')}</label>
            <input
                type="text"
                id="siminia-search-field"
                ref={(e) => { searchField = e }}
                placeholder={Identify.__('Search...')}
                onChange={() => handleSearchField()}
                onKeyPress={(e) => { if (e.key === 'Enter') startSearch() }}
            />
            <div role="button" tabIndex="0" className="action search" onClick={() => startSearch()} onKeyUp={() => startSearch()}>
                <span>Search</span>
            </div>
            <SearchAutoComplete visible={showAC} setVisible={setShowAC} value={searchVal} />
        </div>
    );
}
export default SearchForm
