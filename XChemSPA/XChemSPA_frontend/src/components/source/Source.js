import React, { Component } from 'react';
import ImportForm from './import_form.js';
import PlateRow from './plate_row.js';
import axios from 'axios';
import {groupCompoundsByPlate, groupCompoundsIntoCombinations} from '../reusable_components/functions.js';
import CocktailForm from './cocktail_form.js';

class Source extends Component {
  constructor(props){
    super(props);
    this.state = {
      plates: null,
      combinations: null,
      projectData: null,
      compoundCount: 0,
      allUsed: 0,
      allUnused: 0,      
    }
  }
    
  componentDidMount(){
    this.props.switchActive("source");
    console.log('downloading project data in Source')
    console.log(this.props)
    let combinations = [];
    
    let apiUrl = '/api/project/' + this.props.proposal + '/';

    axios.get(apiUrl)
        .then(res => {
        const projectData = res.data;
        this.setState({ projectData })
     });

     apiUrl = '/api/combinations/' + this.props.visit + '/';

     axios.get(apiUrl)
       .then(res => {
        combinations = res.data;
        this.setState({combinations});
     });

     apiUrl = '/api/source_compounds/' + this.props.proposal + '/';

     axios.get(apiUrl)
       .then(res => {
        const compounds = res.data;
        this.setState({compoundCount: compounds.length})
        let plates = groupCompoundsByPlate(compounds);
        plates = groupCompoundsIntoCombinations(combinations, plates)
        this.setState({ plates : plates })
      });

      this.getTotals();
  }
   
    componentDidUpdate(pervProps, prevState){
      if(prevState.plates !== this.state.plates){
        this.getTotals();
      }

      if (prevState.combinations !== prevState.combinations){
        const plates = groupCompoundsIntoCombinations(this.state.combinations, this.state.plates);
        this.setState({ plates });
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

    let rows = <tr><td colSpan="6">Loading...</td></tr>;

    if (this.state.plates) {
      rows = this.state.plates.map((plate, index) => {
        return(
          <PlateRow key={index} plate={plate} />
          );
      });
    }
   
    return (
        <div id="source">
      <h1>Source compounds</h1>
      <main id="source-main">
        <div id="sidebar">
        {this.state.projectData ? 
          <ImportForm proposal={this.state.projectData} visit={this.props.visit}/>
          : null}
        {this.state.compoundCount > 0 ? 
          <CocktailForm visit={this.props.visit}/>
          : null}
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
