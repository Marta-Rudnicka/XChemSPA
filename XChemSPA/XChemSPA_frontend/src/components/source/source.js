import React, { Component } from 'react';


class Source extends Component {
    render() {
        return (
        <div id="source">
			<h1>Source compounds</h1>
			<main id="source-main">
				<div id="sidebar">
					<form id="import-compounds" action="">
						<button type="submit" className="import-button">Import selected compounds</button>
						<br />
						<input type="hidden" id="proposal" value={this.props.proposal} />
						<strong>Import options:</strong>
						<p>
							<label>
								<input type="radio" id="add" name="mode" value="add" />
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
					</form>
				</div>
				<div>
					<table  data-toggle="table" data-pagination="true" data-search="true" className="table table-bordered table-hover" id="table">
						<thead>
							<tr>
								<th>Library</th>
								<th>Plate</th>
								<th>Origin</th>
								<th>Selected compounds</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
			</main>
		</div>
        )
    }
}

export default Source
