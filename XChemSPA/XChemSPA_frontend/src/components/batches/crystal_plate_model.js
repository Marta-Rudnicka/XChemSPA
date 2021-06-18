import React, { Component } from 'react';
import ModelRow from './model_row.js';
import { XIcon } from '../reusable_components/icons.js';
import { crystalPlateColumns, crystalPlateRows } from '../reusable_components/constants.js';

export class CrystalPlateModel extends Component {
	constructor(props){
		super(props);
		this.state = {
			lastColumn: 12,
			lastClicked: 12,
			columns: null,
			selected: 0,
			highlighted: 0,
			}
	}
	
	componentDidMount(){
		this.setState({columns: this.divideCrystalsIntoColumns()}); 
	}

	componentDidUpdate(prevProps, prevState){
		if (prevState.columns === null && this.state.columns !== null){
			//once you created columns, choose all the crystals
			this.setToLast(12)
			this.choose(12);
		}
	}

	divideCrystalsIntoColumns(){
		const str1 = '[A-H]';
		const str3 = '[acd]';
		let cols = [];

		crystalPlateColumns.forEach(number => {
			let newColumn = {id : number }
			let numStr = String(number);
			if (numStr.length === 1){
				numStr = '0' + numStr;
			}
			//newColumn.name = "col" + numStr;
			const pattern = new RegExp(str1 + numStr + str3)

			//get all unused crystals that have the column number in the name
			newColumn.crystals = this.props.plate.items.filter(crystal => (crystal.well.match(pattern) !== null  && crystal.status !== "used"))
			
			newColumn.count = newColumn.crystals.length;
			cols.push(newColumn);
		});
		return cols;
	}

	setToLast(index){
		this.setState({lastColumn : index});
		this.setState({highlighted : this.countCrystals(index)});
	}
	
	reset(){
		const last = this.state.lastClicked;
		this.setState({lastColumn : last});
		this.setState({highlighted : this.countCrystals(last)});
	}
	
	choose(index){
		this.setState({lastClicked : index});
		this.setState({selected : this.countCrystals(index)});
	}
	
	countCrystals(columnIndex){
		if (this.state.columns === null){
			return 0;
		}
		let count = 0;
		for (let i = 1; i <= columnIndex; i++ ){
			count = count + this.state.columns[i-1].count;
		}
		return count;
	}
	
	saveAllotment(){
		let plate = this.props.plate;
		plate.items = [];
		let newSize = 0;
		plate.excluded = 0;

		this.state.columns.forEach(column => {
			if (column.id <= this.state.lastClicked){
				column.crystals.forEach(crystal => {
					crystal.status = "unused";
					plate.items.push(crystal);
					newSize ++;
				});
			}
			else {
				column.crystals.forEach(crystal => {
					crystal.status = "excluded";
					plate.items.push(crystal);
					plate.excluded ++;
				});				
			}
		
		this.props.closePlateModel();
		});

		if (plate.matchedItems > 0){
			this.props.resetAll();
		}
		this.props.resizeAndRefresh(plate.id, newSize);	
	}

    render() {
		const rowsHeader = crystalPlateColumns.map(index => {
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
		
		
		
		const rowsContent = crystalPlateRows.map(index => 
		<ModelRow 
			key={index} 
			rowIndex={index} 
			lastColumn={this.state.lastColumn} 
			lastClicked={this.state.lastClicked} 
		/>);
        
		const selected = this.state.selected;
		const highlighted = this.state.highlighted;

		return (
				<div id="allot" className={this.props.display}>
					<XIcon size="20" handleClick={() => this.props.closePlateModel()} />
					<h2>Allot crystals to the nearest soak - {this.props.plate.name}</h2>
					<p>If you want to use only some of the crystals today, and save the rest for later, click on the number of the last column you want to use today.</p>
					<p>Available: {String(this.props.plate.size  + this.props.plate.excluded)}<br/>
						Selected: {selected} <br/> 
						Highlighted: {highlighted} </p>
						
					<table id="crystal-plate-model">
						<thead>
							<tr>
								<th></th>
								{rowsHeader}
							</tr>
						</thead>
						<tbody>
							{rowsContent}
						</tbody>
					  </table>
					  <button onClick={() => this.saveAllotment()}>Save</button><span>(If the plate is currently assigned to a new batch, this will reset all the batches)</span>
				</div>
         
        );
    }
}

export default CrystalPlateModel;
