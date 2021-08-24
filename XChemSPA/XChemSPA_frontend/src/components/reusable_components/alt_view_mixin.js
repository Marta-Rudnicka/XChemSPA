import React from "react";
import BatchDetailsBySoak from "../batches/old-batches/batch_details_by_soak";
import BatchDetailsCocktail from "../batches/old-batches/batch_details_cocktail";
export function altViewMixin(component){

    return class AltViewMixinClass extends component{

        //display details in two ways: by crystal or by soak
        getChangeView(){
            return (
                <div>
                    <input type="checkbox" onChange={event => this.handleCheckbox(event)} className={this.state.hideClass} />
                    <label className={this.state.hideClass}>view by soak</label>
                </div> 
            );
        }

        getBatchDetails(){
            if (this.state.detailsBySoak)
                return <BatchDetailsBySoak crystals={this.props.batch.crystals} />
            else {
                return <BatchDetailsCocktail crystals={this.props.batch.crystals} />
            }
        }

        handleCheckbox(event){
            if (event.target.checked){
                this.setState({detailsBySoak: true});
            }
            else {
                this.setState({detailsBySoak: false});
            }
        }
    }
}