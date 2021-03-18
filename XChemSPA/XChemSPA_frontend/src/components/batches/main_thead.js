import React, { Component } from 'react';

export class MainThead extends Component {
    render() {
        return (
          <thead>
			<tr>
				<th className="lib-plate">Library (source) <br/>plate</th>
				<th className="cr-plate">Crystallisation <br/> (destination) plate</th>
				<th className="drop" >Drops</th>
				<th className="batch">Batch</th>
				<th className="items">Batch size</th>
				<th className="pb-name">PlateBatch Name</th>
				<th className="checkbox-cell">Select</th>
			</tr>
		</thead>
        );
    }
}

export default MainThead;
