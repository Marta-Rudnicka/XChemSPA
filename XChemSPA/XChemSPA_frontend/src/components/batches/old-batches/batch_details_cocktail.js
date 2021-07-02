import React from 'react';
import BatchDetails from './batch_details';

export class BatchDetailsCocktail extends BatchDetails {

    getExtraHeaders(){
        return (
			<React.Fragment>
                <th>Related crystal</th>
                <th>Soak</th>
            </React.Fragment>
        );
    }

    getCrystalRows(){
        return this.props.crystals.map(item => this.getCombinationRows(item));

    }

    getCombinationRows(crystal){
        const height = crystal.compound_combination.compounds.length;
        let counter = 0;

        const rows = crystal.compound_combination.compounds.map((item, index) => {

            counter ++;
            return (
                <tr key={index}>
                    {this.getFirstCell(crystal, counter, height)}
                    
                    <td>{item.well}</td>
                    <td>{item.code}</td>
                    <td>{item.smiles}</td>
                    <td>{item.related_crystal}</td>
                    <td>{counter}</td>
                </tr>
            );
        });
        return rows;
    }

    getFirstCell(crystal, counter, height){
        if (counter===1){
            return <td rowSpan ={height}>{crystal.crystal_name.well}</td>;
        }
        else{
            return null;
        }
    }
}

export default BatchDetailsCocktail;
