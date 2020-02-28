import React from 'react'
import defaultClasses from './index.css'
import { mergeClasses } from 'src/classify'
require('./index.scss');

export const Checkbox = (props) => {
    const propsClasses = props.classes ? props.classes : {}
    // const classes = mergeClasses(defaultClasses, propsClasses);
    return (
        <div
            {...props}
            className={`checkbox-item ${props.className} ${props.selected ? 'selected' : ''}`}
        >
            <div className={`checkbox-item-icon`} />
            <span className={`checkbox-item-text`}>
                {props.label}
            </span>
        </div>
    )
}
export default Checkbox
