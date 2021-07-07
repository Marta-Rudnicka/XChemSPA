import React from 'react';

export function cryoMixin(component){

    return class CryoMixinClass extends component {

        constructor(props){
            super(props)
            this.showDetails = this.showDetails.bind(this);
            this.hideDetails = this.hideDetails.bind(this);
            this.state = {
                detailClass: "container-cell-hidden",
                showClass: "",
                hideClass: "hidden",
                detailsBySoak: false,
                path : '/exports/echo-cryo/',
            }
        }

        makeNewValues(){
            const batch = this.props.batch;
            return (
                <React.Fragment>
                    <td className="auto-calc">{batch.cryo_stock_frac}</td>
                    <td className="auto-calc">{batch.cryo_frac}</td>
                    <td className="auto-calc">{batch.cryo_location}</td>
                    <td>{batch.cryo_transfer_vol}</td>
                </React.Fragment>
            );
        }
    }
}