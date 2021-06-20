import React, { Component } from 'react';
import well from './well.png';

const columns= []
for(let i=1; i < 13; i++){columns.push(i)}
const rows=['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];



export class ModelRow extends Component {
    render() {
		const rowsHeader = rows.map(index => <th>{index}</th>)
		const cells = columns.map(index => {
			let cellClass;
			if (index > this.props.lastColumn && index !== this.props.lastClicked){
					cellClass = "unused";
			}
			else if(index > this.props.lastColumn ){
					cellClass = "chosen-unused";
			}
			else if (index === this.props.lastClicked){
				cellClass = "chosen";
			}
			else {
				cellClass = "used";
			}
			
			return <td key={index} className={cellClass}><img src={well} className="well-pic" /></td>
		});
        
        return (
          <tr>
			<td className="column-header">{this.props.rowIndex}</td>
			{cells}
          </tr>
        );
    }
}

export default ModelRow;
