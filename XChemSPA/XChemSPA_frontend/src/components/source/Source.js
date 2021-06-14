import React, { Component } from 'react';
import ImportForm from './import_form.js';
import PlateRow from './plate_row.js';
import axios from 'axios';
import {groupCompoundsByPlate} from '../reusable_components/functions.js';

class Source extends Component {
  constructor(props){
    super(props);
    this.state = {
      plates: null,
      proposalData: null,
      compoundCount: 0,
      allUsed: 0,
      allUnused: 0,      
    }
  }
    
  componentDidMount(){
    this.props.switchActive("source");
    
    let apiUrl = '/api/proposals/' + this.props.proposal + '/';

    axios.get(apiUrl)
        .then(res => {
        const proposalData = res.data;
        this.setState({ proposalData })
     });
     
     apiUrl = '/api/source_compounds/' + this.props.proposal + '/';

     axios.get(apiUrl)
       .then(res => {
        const compounds = res.data;
        this.setState({compoundCount: compounds.length})
        const plates = groupCompoundsByPlate(compounds);
        this.setState({ plates : plates })
      });

      this.getTotals();
    }
   
    componentDidUpdate(pervProps, PrevState){
      if(PrevState.plates !== this.state.plates){
        this.getTotals();
      }
    }

   getTotals(){
      try{
        let used = 0;
        let unused = 0;
        this.state.plates.forEach(plate=>{
          used = used + plate.used;
          unused = unused + plate.unused;
        });
        this.setState({allUsed: used, allUnused: unused});
      }
      catch(TypeError){
        return;
      }
    }

    render() {
    let rows = null;

    try {
      rows = this.state.plates.map((plate, index) => {
        return(
          <PlateRow key={index} plate={plate} />
          );
      });
    }
    catch(err){
      rows = null;
    }
     
    
    return (
        <div id="source">
      <h1>Source compounds</h1>
      <main id="source-main">
        <div id="sidebar">
        {this.state.proposalData ? <ImportForm proposal={this.state.proposalData} visit={this.props.visit}/> : ""}
        </div>
        <div>
          <table className="table" data-toggle="table" data-pagination="true" data-search="true" id="table">
            <thead>
              <tr>
                <th>Library</th>
                <th>Plate (barcode)</th>
                <th>Selected compounds</th>
                <th>Used compounds</th>
                <th>Unused compounds</th>
                <th>Show / hide <br/> plate map</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
            <tfoot>
              <tr>
                <th>Total numer:</th>
                <td>{this.state.plates ? this.state.plates.length : ""}</td>
                <td>{this.state.compoundCount}</td>
                <td>{this.state.allUsed}</td>
                <td>{this.state.allUnused}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </main>
    </div>
        )
    }
}

export default Source
