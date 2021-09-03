import React from 'react';
import { CSRFToken } from '../reusable_components/csrf.js';
import { validNaNCrystalScores } from '../reusable_components/constants.js'

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.handleApply = this.handleApply.bind(this);
		this.handleRejectLimitChange = this.handleRejectLimitChange.bind(this);
		this.handleAcceptLimitChange = this.handleAcceptLimitChange.bind(this);
		this.handleAcceptScoreChange = this.handleAcceptScoreChange.bind(this);
		this.handleRejectScoreChange = this.handleRejectScoreChange.bind(this);
		this.state = {
			rejectLimit: '',
			acceptLimit: '',
			rejectScore: '',
			acceptScore: '',
		};  
    }
	
	handleApply(e){
		e.preventDefault(e);
		this.props.filterByScore(this.state.rejectLimit, this.state.acceptLimit, this.state.rejectScore, this.state.acceptScore);
	}
	
	handleRejectLimitChange(e){
		this.setState({rejectLimit: e.target.value,
						acceptLimit: ''});
	}
	
	handleAcceptLimitChange(e){
		this.setState({acceptLimit: e.target.value, 
						rejectLimit: ''});
	}

	handleRejectScoreChange(e){
		const score = e.target.value;
		if(validNaNCrystalScores.includes(score)){
			this.setState({rejectScore: score});
		}
	}
	
	handleAcceptScoreChange(e){
		const score = e.target.value;
		if(validNaNCrystalScores.includes(score)){
			this.setState({acceptScore: score});
		}
	}
	
	render() {
		const numberOfplates = this.props.plates.length;
		const totalUsed = this.props.used;
		const totalAccepted = this.props.accepted;
		const totalRejected = this.props.rejected;
		
		const rejectLimit = this.state.rejectLimit;
		const acceptLimit = this.state.acceptLimit;
		const rejectScore = this.state.rejectScore;
		const acceptScore = this.state.acceptScore;
		
	//	const placeholder = 'TODO'
		
		return (
		<div id="sidebar">
			<aside>
				<div id="summary">
				  <h3>Summary</h3>
				  Plates: <strong>{numberOfplates}</strong><br/>
				  Total used crystals: <strong>{totalUsed}</strong> <br/>
				  Total accepted crystals: <strong>{totalAccepted}</strong><br/> 
				  Total rejected crystals: <strong>{totalRejected}</strong><br />
				  [TODO: conslusion (e.g. 'you need 3 more crystals to test all your compounds')]
				</div>
				<div className="local-menu">
				
					<form id="upload-plate" method="post" action="/imports/import-new-crystals/" encType="multipart/form-data" >
						<h3>Upload crystallisation plate</h3>
						<CSRFToken />
						<input type="hidden" name="visit" value={this.props.visit}/>
						<div className="form-group row">
							<label htmlFor="barcode" className="col-sm-2 col-form-label">Plate barcode:</label>
							<div  className="col-sm-10">
								<input type="text" name="barcode" className="form-control" />
					  		</div>
						</div>
						<div className="form-group row">
							<label htmlFor="drop_volume" className="col-sm-2 col-form-label">Drop volume (nL):</label>
							<div  className="col-sm-10">
								<input type="number" min="1" name="drop_volume" className="form-control"/>
							</div>
						</div>
						<div className="form-group row">
							<label htmlFor="data_file" className="col-sm-2 col-form-label">Choose plate type:</label>
							<div  className="col-sm-10">
								<select name="plate_type" className="form-control">
									<option htmlFor="plate_type" value="">...</option>
									<option htmlFor="plate_type" value="SwissCI-3drop">SwissCI-3drop</option>
									<option htmlFor="plate_type" value="SwissCI-2drop">SwissCI-2drop</option>
									<option htmlFor="plate_type" value="MRC-2drop">MRC-2drop</option>
									<option htmlFor="plate_type" value="MiTInSitu">MiTInSitu</option>
								</select>
							</div>
						</div>

						<div className="form-group row">
							<label htmlFor="data_file" className="col-sm-2 col-form-label">Choose data file:</label>
							<div  className="col-sm-10">
								<input type="file" name="data_file" className="form-control" />
							</div>
						</div>
					  <button type="submit" id="texrank">Upload</button>
					</form>
					 
					<form id="crystal-form">
					<h3>Tools</h3>
						
						  	<label>Remove crystals with number score lower than:</label>
							<div  className="col-sm-10">
								<input type="number" min="0" max="9" value={rejectLimit} onChange={this.handleRejectLimitChange} className="form-control"/>
							</div>
						

							<label>Add crystals with number score higher than:</label>
							<div  className="col-sm-10">
							  <input type="number" min="0" max="9" value={acceptLimit} onChange={this.handleAcceptLimitChange} className="form-control"/>
							</div>

							<label>Remove crystals with letter score:</label>
							<div  className="col-sm-10">
					  			<input type="text" min="0" value={rejectScore} onChange={this.handleRejectScoreChange} className="form-control"/>
							</div>

							<label>Add crystals with letter score:</label>
							<div  className="col-sm-10">
					  			<input type="text" min="0" value={acceptScore} onChange={this.handleAcceptScoreChange} className="form-control"/>
							</div>
					  <button type="submit" onClick={this.handleApply}>Apply</button>
					</form>	
					<p>Valid crystal score values: numbers from 0 to 9, letters: c, l, h, d, g, e, s.</p>
				</div>
			</aside>	
		</div>
		);
	}
}

export default Sidebar;
