import React, { Component } from 'react';

export class NewBatches extends Component {
    render() {
        //const libCol = "width: 40%"
        //const numCol = "width: 20%"
        return (
            <React.Fragment>
				<section id="batch-table">
					<table className="table">
                        
                    <colgroup>
                        <col span="1" style={{width: '40%'}} />
                        <col span="1" style={{width: '40%'}} />
                        <col span="1" style={{width: '20%'}} />
                    </colgroup>
					<caption>Create new batches</caption>
					<thead>
						<tr>
							<td>Library Plate</td>
							<td>Crystallisation Plate</td>
							<td>Drops</td>
						</tr>
					</thead>					
					<tbody id="batches-tbody">
                          {this.props.children}
					</tbody>
					<tfoot>
						<tr>
							<td id="wide-cell" colSpan="3">Total items (TODO)</td>
							<td id="total-items"></td>
						</tr>
					</tfoot>
					</table>
				</section>
				<section id="actions">
					<h2>Actions </h2>
					<button className="import-button">Merge selected</button>
					<button className="import-button">Remove selected</button>
				</section>
            </React.Fragment>
        );
    }
}

export default NewBatches;
