import React, { Component } from 'react';
import axios from 'axios';
import {Redirect} from "react-router-dom";

export default class Visit extends Component {

    constructor(props) {
		super(props);
		this.state = { visit_string: "", proposal: "", extra: false};
	}


    componentDidUpdate(prevProps, prevState){
        if (prevState.proposal !== this.state.proposal){
            this.handleProposalData();
        }
    }

    getProposal(string){
        const regex =  /([A-Za-z0-9_]+)(\-[0-9]+)/;
        const m = string.match(regex);

        if (m===null){
            return false;
        }
        else{
            return m[1]; //returns Proposal.proposal
        }
    }
	
    queryProposal(string){
        const apiUrl = '/api/project/' + string +'/';
        axios.get(apiUrl)
            .then(res => {
            const proposal = res.data;
            this.setState({ proposal });
        });
    }

    getVisitString(string){
        this.setState({visit_string: string})
    }

    setValidVisitString(){
        const string = this.state.visit_string
        console.log('getting visit string: ', string)
        
        const p = this.getProposal(string)
        if(p){
            this.setState({visit_string : string})
            this.queryProposal(p)
 
        }
        else {
            this.setState({error: "Invalid visit. The valid format is: <proposal>-<visit number>, e.g. MyProposal-1. "})
        }
    }

    handleProposalData(){
        if (this.state.proposal.proposal){
            this.props.setVisit(this.state.visit_string);
            this.props.setProposal(this.state.proposal.proposal);
            this.setState({extra: "redirect"});
            
        }
        else{
            this.setState({error: "Unrecognised proposal in the visit string."});
        }

    }

    render() {
        let extra = this.state.extra;
        if (extra === "redirect"){
            extra = <Redirect  to="/" />;       
        }
        return (
            <main>
                <h1>Enter proposal</h1>
                <div>
                    <label>Visit: </label>
                    <input onChange={() => this.getVisitString(event.target.value)} type="text" name="visit" />
                    <button onClick={() => this.setValidVisitString()}> Submit</button>
                </div>
                <div className="error-message">{extra}{extra ? "Please try again." : ""}</div>
            </main>
        );
    }
}
