import React, { Component } from 'react';
import ModelRow from './model_row.js';
import Close from '../Icons.js';

const columns= []
for(let i=1; i < 13; i++){columns.push(i)}
const rows=['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// type="checkbox" onChange={event => console.log('z')} 

export class CrystalPlateModel extends Component {
	constructor(props){
		super(props);
		this.state = {
			lastColumn: 12,
			lastClicked: 12,
			}
	}
	
	setToLast(index){
		this.setState({lastColumn : index});
	}
	
	reset(){
		this.setState({lastColumn : this.state.lastClicked});
	}
	
	choose(index){
		this.setState({lastClicked : index});
	}
	
	
    render() {
		const rowsHeader = columns.map(index => {
			let thClass;
			if (index === this.state.lastClicked){
				thClass = "chosen";
			}
			
			return <th 
					key={index} 
					onMouseOver={() => this.setToLast(index)}
					onMouseOut={() => this.reset()}
					onClick={()=> this.choose(index)}
					className={thClass}>
					{index}
				</th>}
			);
		
		
		const rowsContent = rows.map(index => <ModelRow key={index} rowIndex={index} lastColumn={this.state.lastColumn} lastClicked={this.state.lastClicked} />);
        return (
				<div id="allot" className={this.props.display}>
				<Close handleClick={() => this.props.closePlateModel()} className="close-icon" />
					<h2>Allot crystals to the nearest soak - {this.props.plate.name}</h2>
					<p>If you want to use only some of the crystals today, and save the rest for later, click on the number of the last column you want to use today.</p>
					<p>Available: [TODO]<br/> Selected: [TODO] <br/> Highlighted: [TODO]</p>
						
					<table id="crystal-plate-model">
						<thead>
							<tr>
								<th><input type="checkbox" /></th>
								{rowsHeader}
							</tr>
						</thead>
						<tbody>
							{rowsContent}
						</tbody>
					  </table>
					  <button>Save</button>
				</div>
         
        );
    }
}

export default CrystalPlateModel;
