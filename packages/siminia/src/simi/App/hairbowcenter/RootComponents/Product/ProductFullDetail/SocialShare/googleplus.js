import React from 'react';

const Googleplus = props => {
    const {url} = props;
    const handleShareGoogleplus = (e) => {
        e.preventDefault()
        window.open('https://plus.google.com/share', '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600')
        return false
    }
    
    return (
        <div className="buttons-googleplus-one">
            <a className="plus-googleplus-one" href={`https://plus.google.com/share?url=${url}`} onClick={handleShareGoogleplus}>
                <img src="https://www.gstatic.com/images/icons/gplus-32.png" alt="Share on Google+"/>
            </a>
        </div>
    );
}

export default Googleplus;