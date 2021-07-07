import React from 'react';

export function cocktailBatchInfoMixin(component) {
    return class CocktailBatchInfoMixinClass extends component{

        makeBatchInfo(){
            const libs = this.getLibrariesInCombinations();
            const batch = this.props.batch;
            return (
                <React.Fragment>
                    <td className={this.props.extra}><strong>Combinations</strong><br></br>{libs.libraries}</td>
                    <td className={this.props.extra}>{libs.plates}</td>
                    <td className={this.props.extra}>{batch.crystal_plate.name}</td>
                    <td className={this.props.extra}>{batch.crystal_plate.drop_volume}</td>
                    <td className={this.props.extra}>{batch.crystals.length}</td>
                </React.Fragment>
            );
        }
    }
}