import React, { Component } from 'react';
import ImportForm from './import_form.js';
import {sel, proposal} from '../batches/fake_data.js';
import PlateRow from './plate_row.js';
import axios from 'axios';

class Source extends Component {
  constructor(props){
    super(props);
    this.state = {
      proposal: null,
      plates: null,
      compoundCount: 0,
      allUsed: 0,
      allUnused: 0,      
    }
  }
    
  componentDidMount(){
    this.props.switchActive("source");

    //const proposalApiUrl = '/api/proposals/' + this.props.proposal;
    let proposalApiUrl = '/api/proposals/test_proposal_2/';

    axios.get(proposalApiUrl)
        .then(res => {
        const proposal = res.data;
        this.setState({ proposal })
     });

     proposalApiUrl = '/api/source_compounds/test_proposal_2/';

     axios.get(proposalApiUrl)
       .then(res => {
      const compounds = res.data;
      this.setState({compoundCount: compounds.length})
      const plates = this.groupCompoundsByPlate(compounds);
      this.setState({ plates : plates })
  });

   }
  
    groupCompoundsByPlate(compounds){
      console.log('fired groupCompoundsByPlate')
      let plates = {};
      let plates_with_compounds = [];
      let allUsed = 0;
      let allUnused = 0;

      compounds.forEach(c => {
        plates[c.library_name] = c.library_plate;
      });

      console.log('plates: ', plates);
      for (const [key, value] of Object.entries(plates)) {
        let newPlate = {library_name: key, library_plate: value, used: 0, unused: 0};
        let c = compounds.filter(compound => compound.library_name === newPlate.library_name && compound.library_plate === newPlate.library_plate);
        c.forEach(compound =>{
          if (compound.crystal){
            compound.used = true;
            newPlate.used ++;
            allUsed ++;
          }
          else{
            compound.used = false;
            newPlate.unused ++;
            allUnused++;
          }

        });
        newPlate.compounds = c;
        plates_with_compounds.push(newPlate)
      };

      console.log(plates_with_compounds);
      this.setState({allUsed: allUsed, allUnused: allUnused});
      return plates_with_compounds;

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
    
  
    console.log('this.state.selection: ', this.state.selection);
    
        return (
        <div id="source">
      <h1>Source compounds</h1>
      <main id="source-main">
        <div id="sidebar">
        {this.state.proposal ? <ImportForm proposal={this.state.proposal} /> : ""}
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
