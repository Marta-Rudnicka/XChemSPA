import React from 'react';
import BatchRowSoak from './batch_row_soak.js';
import { removeFromArray } from '../reusable_components/functions.js';
import { basicCocktailMixin } from '../reusable_components/basic_cocktail_mixin.js';
import { cocktailBatchInfoMixin } from '../reusable_components/cocktail_batch_info_mixin.js';

export class BatchRowCocktailSoak extends basicCocktailMixin(cocktailBatchInfoMixin(BatchRowSoak)) {

	constructor(props){
		super(props)
		this.showDetails = this.showDetails.bind(this);
		this.hideDetails = this.hideDetails.bind(this);
		this.state = {
			detailClass: "container-cell-hidden",
			showClass: "",
			hideClass: "hidden",
			detailsBySoak: false,
			path : '/exports/echo-soak/',
			soakCounter : this.countSoaks(),

		}
	}

	makeDownloadLinks(){
		const counter = this.countSoaks();

		const links = counter.map(index => {
			return  (
				<p key={index}>
					<a 
						href={this.state.path + this.props.batch.id + '/' + index + '/'}
						onClick={() => this.trackDownloads(index)}>
							Download Echo file (soak {index})
					</a>
				</p>
			);
		});

		return links;
	}

	countSoaks(){
		let counters = [];
		
		this.props.batch.crystals.forEach( crystal => {
			let i = 1;
			crystal.compound_combination.compounds.forEach(compound => {
				if (!counters.includes(i)){
					counters.push(i);
					i++;
				}
			});

		});
		return counters;
	}

	trackDownloads(i){
		let counterCopy = [... this.state.soakCounter]
		counterCopy = removeFromArray(counterCopy, [i]);
		if (counterCopy.length === 0){
			this.handleFileDownload();
		}
		this.setState({soakCounter: counterCopy});
	}
}

export default BatchRowCocktailSoak;
