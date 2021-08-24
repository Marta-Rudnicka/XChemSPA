# Purpose of this document

The XChem pipeline accesses data from SoakDB files. If XChemSPA is to replace SoakDB, the pipeline will need to know how to access the same data, but in XCDB.

The schema used by SoakDB was a completely "flat", with a lot of redundancy, and did not reflect the reality of the experiment, e.g. solvent characterization experiment recorded solvent data in table columns meant for fragments, because the schema was only written for compound screen experiments. SoakDB schema also did not accommodate combi-soaks (using more than one compound on a crystal). In this kind of experiments, users made up fictional duplicate crystals as a walk-around solutions, but with XChemSPA's mechanisms that guard data integrity, this kind of "hacks" would be much harder to perform - therefore the schema itself needs to allow linking one crystal to multiple compounds.

This documents maps queries needed to access a specific value in SoakDB's SQLite file schema, to queries needed to access the same value in XChemDB - as written using Django's ORM.

## Overview of the changes
The models used by the inventory application do not have any equivalent in the SoakDB model, therefore they are not covered here.
The main changes in the schema made are:

 - Dividing the `Lab` table into several other models linked by foreign keys. The most significant feature here is introducing the `Batch` model, which takes over numerous attributes (or table columns) that previously belonged to `Lab`. Crystals undergo soaking and cryoprotectant application in batches, and multiple values recorded in that process are the same for every crystal in the batch. In the old schema, they were individually stored for each crystals, which produced a lot of redundancy (one batch may cover over 200 crystals). 
 - Creating three types of entities to which a `Lab` instance can be linked to by foreign key: `SingleCompound` (which covers what was previously covered by a few attributes in `Lab`), `CompoundCombination` and `SolventTestingData`. A `Lab` instance should be linked only to one of the three - the fields for the other two should remain None/NULL. `SingleCompound` stores data of a fragment, `CompoundCombination` stores foreign keys to multiple fragments tested on one crystal (with some meta-data) in a "cocktail" or combi-soak experiment, and `SolventTestingData` stores solvent data in a solvent testing experiment.
 
 ##  Mapping
The queries needed to access a specific value may differ for different types of experiment. To see what kind of experiment a specific sample has undergone, it is enough to check certain values in Lab:

- a Lab instance related to a crystal used in a solvent characterization has a non-null `solvent_data` attribute, and a null `batch`
- a Lab instance related to a crystal used in a regular screen has a non-null `single_compound`
- a Lab instance related to a crystal used in a combi-soak or cocktail experiment screen has a non-null `compound_combination`

__Notes:__
- In the table below "sample" refers to an instance of `Lab`.
- For solvent characterization experiments, some queries are written as `Lab.solvent_data.attribute`, and some as  `Lab.solvent_data.batch.attribute` - this is not an error. Some of the values that are the same for the whole batch in a narmal screen (such as solvent concetration) are different for each crystal in a batch when solvent tolerance is being tested.
- In the table [i] refers to an index within the query set. CompoundCombination is in many-to-many relationship with SpaCompound. For example to find out the library name of the first compound in a cocktail used on *sample*, where *sample* is an instance of Lab, the query in Django would be: `sample.compound_combination.compounds.all()[0].library_name`
- 

|SoakDB SQLite |XChem pipeline|XChemSPA/XCDB  |
|--|--|--|
|mainTable.CryoFraction|Lab.cryo_frac|*if sample.batch:* Lab.batch.cryo_frac|
| ||*if not sample.batch:* Lab.solvent_data.cryo_frac|
|mainTable.CryoStatus|Lab.cryo_status|*if sample.batch:* Lab.batch.cryo_status|
| ||*if not sample.batch:* Lab.solvent_data.batch.cryo_status|
|mainTable.CryoStockFraction|Lab.cryo_stock_frac|*if sample.batch:* Lab.batch.cryo_stock_frac|
| ||*if not sample.batch:* Lab.solvent_data.cryo_stock_frac|
|mainTable.CryoStockFraction|Lab.cryo_stock_frac|*if sample.batch:* Lab.batch.cryo_stock_frac|
| ||*if not sample.batch:* Lab.solvent_data.cryo_stock_frac|
|mainTable.CryoTransferVolume|Lab.cryo_transfer_vol|*if sample.batch:* Lab.batch.cryo_transfer_vol|
| ||*if not sample.batch:* Lab.solvent_data.cryo_transfer_vol|
|mainTable.CrystalName|Lab.crystal_name|Lab.crystal_name.crystal_name|
|mainTable.DataCollectionVisit|Lab.data_collection_visit|Lab.data_collection_visit|
|mainTable.CompoundConcentration|Lab.expr_conc|*if sample.batch:* Lab.batch.expr_conc|
| ||*if not sample.batch:* Lab.solvent_data.expr_conc (should be `None` anyway)|
|mainTable.HarvestStatus|Lab.harvest_status|Lab.harvest_status|
|mainTable.LibraryName|Lab.library_name|*if sample.single_compound:* Lab.single_compound.library_name|
| ||*if sample.compound_combination:* Lab.compound_combination.compounds.all()[i].library_name|
|||*if sample.solvent_data:* N/A|
|mainTable.LibraryPlate|Lab.library_plate|*if sample.single_compound:* Lab.single_compound.library_plate|
| ||*if sample.compound_combination:* Lab.compound_combination.compounds.all()[i].library_plate|
|||*if sample.solvent_data:* N/A|
|mainTable.MountingResult|Lab.mounting_result|Lab.mounting_result|
|mainTable.MountingTime|Lab.mounting_time|Lab.mounting_time|
|mainTable.SoakStatus|Lab.soak_status|*if sample.batch:* Lab.batch.soak_status|
| ||*if not sample.batch:* Lab.solvent_data.batch.soak_status|
|mainTable.SoakingTime|Lab.soak_status|*if sample.batch:* Lab.batch.soaking_time|
| ||*if not sample.batch:* Lab.solvent_data.batch.soaking_time|
|mainTable.SoakTransferVol|Lab.soak_vol|*if sample.batch:* Lab.batch.soak_vol|
| ||*if not sample.batch:* Lab.solvent_data.soak_vol|
|mainTable.SolventFraction|Lab.solv_frac|*if sample.batch:* Lab.batch.solv_frac|
| ||*if not sample.batch:* Lab.solvent_data.solv_frac|
|mainTable.CompoundStockConcentration|Lab.stock_conc|*if sample.batch:* Lab.batch.stock_conc|
| ||*if not sample.batch:* Lab.solvent_data.stock_conc|
|mainTable.LabVisit|Lab.visit|**TODO: figure out how to reconcile it with ispyb_dja**|
|mainTable.CrystalName|Crystal.crystal_name|Crystal.crystal_name|
|mainTable.CrystalName|Crystal.crystal_name|Crystal.crystal_name|
|mainTable.CompoundSMILES|Crystal.compound|*if sample.single_compound:* Lab.single_compound.smiles (or:) Crystal.lab_data.single_compound.smiles|
|||*if sample.compound_combination:* Lab.compound_combination.compounds.all()[i].smiles  (or:) Crystal.lab_data.compound_combination.compounds.all()[i].smiles|




