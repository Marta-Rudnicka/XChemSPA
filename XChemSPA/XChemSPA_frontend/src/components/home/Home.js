import React from 'react';

class Home extends React.Component {

	componentDidMount(){
		this.props.switchActive("home");
	}
	
	render() {
		return (
		<div id="home">
			<h1>XChemSPA: Compound Screen</h1>
			<main>
			<section id="stages">
				<h2>Manage experiment</h2>
				<ul>
					<li>
						<p><a href='/source'>Compounds</a> </p>
						<p>The page to import the data of previously selected compounds and see summary view of the selection.</p>
					</li>
					<li>
						<p><a href='/crystals'>Crystals</a> </p>
						<p>The page to upload crystal data and make final decision about which crystals to include in the experiment</p>
					</li>
					<li>
						<p><a href='/batches'>Batches</a> </p>
						<p>The page to match crystals with compounds and create input files for Echo.</p>
					</li>
					<li>
						<p><a href='/soak'>Soak</a> </p>
						<p>The page to manage the soaking process: create input for Echo and monitor the progress.</p>
					</li>
					<li>
						<p><a href='/cryo'>Cryo</a> </p>
						<p>The page to manage the application of cryoprotectant.</p>
					</li>
					<li>
						<p><a href='/harvesting'>Harvesting</a> </p>
						<p>Manage exchange of data with Shifter and barcode reader.</p>
					</li>
				</ul>
			</section>
			
			<section id="others">
				<h2>Experiment</h2>
				<ul>
					<li>
						<p><a href="/dummy" target="_blank" >WebSoakDB Home</a> </p>
						<p>Go back to the main aplication menu (from which you can navigate to Compound Selection and Solvent Characterisation)</p>
					</li>
					<li>
						<p><a href="/dummy" target="_blank" >Look up solvent notes</a> </p>
						<p>See the conclusions from the solvent characterization experiment.</p>
					</li>
					<li>
						<p><a href="/dummy" target="_blank">Detailed view</a></p>
						<p>See all of the experimental data produced so far for individual crystals in one table.</p>
					</li>
				</ul>
			</section>
			</main>
		</div>

		); 
	}
}

export default Home;
