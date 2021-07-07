import React from 'react';
import SoakForm from '../soak/soak_form';

class CryoForm extends SoakForm{

    getCryoStockConc(e){

        this.props.updateCryoStockConc(parseInt(e.target.value));
    }

    getCryoConc(e){
        this.props.updateCryoConc(parseInt(e.target.value));
    }

    getCryoLocation(e){
        this.props.updateCryoLocation(e.target.value);
    }
    getInputs(){
        return (
            <React.Fragment>
                <legend>Cryo parameters</legend>
                <div className="one-line-form-input">
                    <label className="">Cryo stock concentration (%):</label>
                    <input className="" type="number" onChange={event => this.getCryoStockConc(event)}/>
                </div>
                <div className="one-line-form-input">
                    <label className="">Desired cryo concentration (%):</label>
                    <input className="" type="number" min="0" max="100" onChange={event => this.getCryoConc(event)} />
                </div>
                <div className="one-line-form-input">
                    <label className="">Cryo location:</label>
                    <input className="" type="text" onChange={event => this.getCryoLocation(event)} />
                </div>
            </React.Fragment>
        );
	}

}

export default CryoForm