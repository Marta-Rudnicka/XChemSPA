import React from 'react';
import { JSON_CSRF } from './csrf';
import axios from 'axios';

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
			    transferTime: this.props.batch.cryo_timestamp ? new Date(Date.parse(this.props.batch.cryo_timestamp)) : null,
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
    

        getStatus(){
            let status = this.props.batch.status;
            if (status==="file"){
                status = this.makeDownloadLinks();
            }
            if (status==="start"){
                status = <button onClick={() => this.cryoTimestamp()}>Add cryo timestamp</button>
            }
            return status;
        }

        cryoTimestamp(){
            const timestamp = new Date();
            this.saveTimestamp(timestamp);
            this.props.changeBatchStatus(this.props.batch, "done");
            this.setState({transferTime: timestamp});
        }

        saveTimestamp(date){
            let token = [JSON_CSRF()]
            let data = new FormData(); 
            data.append("csrfmiddlewaretoken", token);
            data.append("date_str", date.toUTCString());
            data.append("cryo_status", "done")
    
            const url = '/exports/save-timestamp/' + this.props.batch.id + /cryo_timestamp/;
            axios.post(url, data);
        }
    }

}