import React, { Component } from 'react';
import LibraryPlates from './library_plates.js';
import CrystalPlates from './crystal_plates.js';
import BatchForm from './batch_form.js';
import MainThead from './main_thead.js';
import SelectLibraryPlate from './select_library_plate.js';
import SelectCrystalPlate from './select_crystal_plate.js';
import {libraries1, libraries2, crystal_plates1, crystal_plates2} from './fake_data.js';
import CrystalPlateModel from './crystal_plate_model.js';

export class Batches extends Component {
	constructor(props){
		super(props);
		this.state={
					asideClass: 'collapsed',
					libraries: libraries1,
					crystals: crystal_plates1,
					}
	}
	
	showSidebar(){
		this.setState({asideClass: 'show'})
	}
	
	hideSidebar(){
		this.setState({asideClass: 'collapsed'})
	}
	
	
    render() {
        return (
            <div id="batches">
				<h1>Batches</h1>
				<aside className={this.state.asideClass}>
					<h2>Items to match</h2>
					<button id="show-sidebar" onClick={() => this.showSidebar()}>Show</button>
					<button id="hide-sidebar" onClick={() => this.hideSidebar()}>Hide</button>
					<div id="aside-tables">
						<LibraryPlates libraries={this.state.libraries}/>
						<CrystalPlates crystals={this.state.crystals}/>
					</div>
				</aside>
				<main>
					<BatchForm />
					<table id="batch-table" className="table">
						<caption>Match crystallisation plates to library plates</caption>
						<MainThead />						
						<tbody id="batches-tbody">
							<tr className="batch-row">
								<td className="lib-plate" rowSpan="1">
									<SelectLibraryPlate libraries={this.state.libraries} />
								</td>
							
								<td className="cr-plate">
									<SelectCrystalPlate crystals={this.state.crystals}/>
								</td>
							
								<td className="drop">TODO</td>
								<td className="batch"><span className="small">no batch<br/>created yet</span></td>
								<td className="items"><span className="small">no batch<br/>created yet</span></td>	
								<td className="pb-name">TODO</td>
								<td className="checkbox-cell"><span className="small">not ready</span></td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<td id="wide-cell" colSpan="3">Total items (TODO)</td>
								<td id="total-items"></td>
							</tr>
						</tfoot>
					</table>	
				</main>
            </div>
        );
    }
}

export default Batches
