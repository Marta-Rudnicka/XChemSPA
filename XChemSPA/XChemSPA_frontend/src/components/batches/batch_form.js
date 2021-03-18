import React, { Component } from 'react';

export class BatchForm extends Component {
    render() {
        return (
           <form id="batch-size-form">
				<label id="divide">Specify batch size:</label>
				<br />
				<input type="radio" name="batch-making-method" id="one-per-match" value="one-per-match" checked onChange={() => console.log('a')}/>
				<label htmlFor="one-per-match">1 batch per plate </label>
				<input type="radio" name="batch-making-method" id="by-number-of-crystals" value="by-number-of-crystals" onChange={() => console.log('b')}/>
				<label htmlFor="number-of-crystals">
				<input id="number-of-crystals" type="number" min="16" value="16" step="16" onChange={() => console.log('b')}/> crystals per plate</label>
			</form>
        );
    }
}

export default BatchForm;
