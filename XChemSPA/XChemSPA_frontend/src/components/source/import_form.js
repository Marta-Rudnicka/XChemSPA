import React from 'react';
import axios from 'axios';
import { CSRFToken } from '../reusable_components/csrf.js';

class SubsetSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { library: null};
  }
  
  componentDidMount() {
    const apiUrl = '/api/library_detail/' + this.props.subset.library.id + '/';
    
    axios.get(apiUrl)
      .then(res => {
      const library = res.data;
      this.setState({library});
    });
  }
  
  countCurrent(){
    if (this.state.library) {
        return this.state.library.plates.filter(plate => plate.current).length;
    }
    else {
        return 0;
    }
  }
  
  render(){
    
    let selects = null;
    let options = null;
    
    if(this.state.library) {
      const current_plates_count = this.countCurrent();
      options = this.state.library.plates.map((plate, index) =>
        <option key={index} value={plate.id}>{plate.barcode} {plate.current ? '(current)' : ''}</option>
      );

      if (current_plates_count === 1){
        selects = (
            <p key="0">
                <select name={this.props.subset.id} required>
                <option value="">Select plate...</option>
                {options}
                </select>
            </p>
            );
      }
      else {
        selects = [];
        for (let i = 1; i <= current_plates_count; i++){
          const sel = (
				      <p key ={i}>
                 <select name={this.props.subset.id + '-' + i} required>
                  <option value="">Select plate...</option>
                  {options}
                </select>
              </p>
          );
          selects.push(sel);        
        }
      }
    }
    
    return(
    <tr>
      <td>
        <label>Library plate(s) for {this.props.subset.library.name}</label>
      </td>
      <td>
        {selects}
      </td>
    </tr>
    
    );
  }
}

class ImportForm extends React.Component {
  
  render() {
    
    const subsets = this.props.proposal.subsets.map((subset, index) =>{
      return <SubsetSelect key={index} subset={subset} />;
    });
    
    
    return (
      <form id="import-compounds" action="/imports/import-compounds/" method="post">
        <CSRFToken />
        <input type="hidden" name="visit" value={this.props.visit} />
        <button type="submit" className="import-button" >Import selected compounds</button>
        <br />
        <strong>Import options:</strong>
        <p>
          <label>
            <input type="radio" id="add" name="mode" value="add" defaultChecked />
            <span> Import only newly added compounds</span>
          </label>
        </p>
        <p>
        <label>
          <input type="radio" id="redo" name="mode" value="redo" />
          <span> Clear previous import and re-upload selection </span>
        </label>
        </p>
        <p>
        <label>
          <input type="radio" id="double" name="mode" value="double" />
          <span> Import selection again (for a double screen)</span>
        </label>
        </p>
        
        { this.props.proposal.subsets.length > 0 ? <p><strong>Select library plates for cherry-picking lists and subsets</strong></p> : null }
        <table className="table">
          <tbody>
            {subsets}
          </tbody>
        </table>
      </form>
    ); 
  }
}

export default ImportForm;

//onClick={event => this.props.showTable(event)}
//<input type="hidden" name="visit" value={this.props.visit} />