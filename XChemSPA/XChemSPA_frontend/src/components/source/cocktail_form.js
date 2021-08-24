import React from 'react';
import { CSRFToken } from '../reusable_components/csrf.js';

class CocktailForm extends React.Component {
  
  render() {
    
    return (
			<form method="post" action="/imports/create-combinations/" target="_blank" encType="multipart/form-data">
				<CSRFToken />
				<input type="hidden" name="visit" value={this.props.visit} />
				<label htmlFor="combi-csv">Upload combination list: </label>
				<br />
				<input type="file" id="combi-csv" name="data_file" />
				<button type="submit">Submit</button>
			</form>
        );
    }
}

export default CocktailForm;