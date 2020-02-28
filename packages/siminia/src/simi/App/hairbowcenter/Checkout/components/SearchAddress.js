import React from "react";
/* global google */

class SearchAddress extends React.Component {
    constructor(props) {
        super(props);
        this.autocompleteInput = React.createRef();
        this.autocomplete = null;
        this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
        this.componentForm = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'short_name',
            country: 'short_name',
            postal_code: 'short_name'
        };
    }

    componentDidMount() {
        this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteInput.current,
            { "types": ["geocode"] });

        this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
    }

    handlePlaceChanged() {
        const place = this.autocomplete.getPlace();

        const componentForm = this.componentForm;
        for (var component in componentForm) {
            if (document.getElementById(component)) {
                document.getElementById(component).value = '';
            }
        }

        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType]];
                if (document.getElementById(addressType)) {
                    document.getElementById(addressType).value = val;
                }
            }
        }
        this.props.changeInput();
    }



    render() {
        const { configFields, initialValues } = this.props;
        return (
            <input ref={this.autocompleteInput} id="street_number" name='street[0]' placeholder="Enter your address"
                type="text" className={!configFields || (configFields && configFields.hasOwnProperty('street_show') && configFields.street_show === 'req') ? 'isrequired' : ''} defaultValue={(initialValues.street && initialValues.street[0]) ? initialValues.street[0] : ''} />
        );
    }
}
export default SearchAddress;
