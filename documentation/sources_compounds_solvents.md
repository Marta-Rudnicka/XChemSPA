# Source compounds

## The back end

## Importing compound data from the inventory

The initial selection of compounds is stored in the Project model, in the 'libraries' and 'subsets' attributes. In the beginning of the experiment, the data of the selected compounds is copied from the inventory's SourceWell models into SpaCompound by the `add_new_spa_compounds()` function.

### Copying library data

For every Library in Project.libraries, `get_compounds_from_library()` function finds the current plate(s) and gets all the SourceWell objects that belong to the plate(s) and are still active (i.e. that still have the compounds left in them). Then, they are passed to `add_new_spa_compounds()`.

### Copying subset data

Subsets saved in the Project model can be either user's own cherry-picking lists or subsets belonging to presets. Unlike in the case of whole libraries, where it is assumed the current plate(s) will be used, in case of subsets, the user has to specify the library plate(s) selected for the experiment.
The subset and the selected compounds are passed to `get_compounds_from_subset()`, which finds all source wells in the plate that still contain the selected compounds. These source wells are later passed them to `add_new_spa_compounds()`.


### Three modes of importing data

Data from the form launching the compound import are managed by the view `import_compounds()`. It extracts the information from POST data and launches `import_new_spa_compounds()` with the right arguments depending on the mode chosen by the user. `import_new_spa_compounds()` is responsible for calling `get_compounds_from_library()` and `get_compounds_from_subset()` and passing their output `add_new_spa_compounds()`.

The modes of importing data are the following:

-  "Import only newly added compounds" - the default option
It creates SpaCompound instances for all the compounds in the selection (i.e. all the compounds belonging to the libraries in Project.libraries and subsets in Project.subsets) that haven't been imported yet. When this function is chosen, `import_new_spa_compounds()` is called directly by the view, with the `allow_duplicates` argument set to `False`. This means that the helper function creates a SpaCompound instance for a SourceWell only if there is no other SpaCompound related to the same visit with the same compound (i.e. with the same code and SMILES string).
This mode should be used for the first import, or when the user decided to add more compounds to the experiment.


- "Clear previous import and re-upload selection"- used for correcting errors or simply modifying the selection

With this mode,  the view does not call `import_new_spa_compounds()` directly, but calls a diferent helper function, `overwrite_old_import()`, which first deletes "unused" SpaCompound objects, and then only then calls `import_new_spa_compounds()`.
"Unused" compounds here mean those that are not associated with any Lab object (in practice: they haven't been assigned to any batch). Compounds that are already associated to a crystal should not be deleted because they are likely to have already been used.

(TODO: if a batch has been created in XChemSPA but not yet processed; i.e. the crystals have not yet been soaked, it should be possible to delete the batch first, and then delete the compounds)

This mode is meant to be used for correcting mistakes in imports, users changing their minds etc.

- "Import selection again (for a double screen)"

With this option, `import_new_spa_compounds()` is called with the `allow_duplicates` set to `True`, which means a new SpaCompound is imported for every compound in the selection, no matter if it has already been imported before. Used in double screen or for a combi-soak, where after the first part of experiment, the same compounds are re-used, this time in cocktails.

If the user wishes to repeat the use of only some of the compounds, used before, he or she should just remove all the other compounds from the selection. Once the "old" compounds have been used in the experiment, their data is stored in SpaCompounds objects anyway, and removing them from the Project object does not delete them from the record of the experiment.

## Creating cocktails

If some compounds have already been imported into the experiment, a form for cocktails appears in the user interface. User can then upload a CSV file specifying which compounds are going to be combined together, and the application creates CompoundCombination objects based on that file. CompoundCombination objects are in a many-to-many relationship to SpaCompound objects, not SourceWell or Compounds objects. This means that all the compounds used in cocktails have to be imported before combinations are created (otherwise, the CSV file will not pass the validation and user will get an error message).

### The cocktail CSV file vs. CompoundCombination model

Compounds in the cocktail file can be identified in two ways:
- based on code and SMILES (self-explanatory)
- based on "related crystal". In some experiments, crystals are first soaked in single compounds, and later, based on the result of the first soak, some of those compounds are selected to be grouped together, and those combinations are used to perform the next soak. The `related_crystal` attribute in CompoundCombination point to the sample in the earlier soak based on which the user decided to test the compound again, but in a combination with another compound. The value itself is the `crystal_name` of the relevant crystal, which is enough to uniquely identify a sample at this stage. (Note: crystal_name is assigned only at the the harvesting stage, which is why it is not used at the crystal's identifier throughout the whole experiment. To become the "related crystal", the crystal must have gone through the whole process).

Since not all values are necessary (or available) in every experiment involving combination, the CSV file does not have a strict format, and uses headers to tell which value is which instead:
1. 'Combination' - an integer responsible for grouping the compounds together. If the compounds have the same number in this column, they end up in the same combination. **Note** `CompoundCombination.number` may **not** be the same as the number in the file. Each compound combination has a unique number within the project, and combinations may be uploaded at different occasions, in separate files. To make preparing the upload files easier, each file with a set of combinations is expected to start the combination numbers from 1 (so the user does not need to check what the highest combination number was the last time cocktails were added to the project).

2. and 3. 'Code' and 'SMILES' used to identify the SpaCompound. **TODO**: consider whether both are needed. Compound code is necessary in case of user's own libraries with no SMILES disclosed. Using a unique code-SMILES combination to identify a compound may lead to occasional duplicates (if different libraries happen to share compounds - while testing the inventory app with a real data set, we accidentally found a few compounds shared between DSI-Poised and EUOpenscreen )

\4. 'Related crystal' - the crystal on which the compound was previously used

All the headers have whitespace removed and are converted to lowercase, so headers such as `code`, ` CODE ` and `Code` are all valid and recognised as marking the column with compound code.

Every CSV file needs the combination number and at least one option for identifying the crystal: either SMILES and code, or the related crystal. If both are provided, `related crystal` will be ignored.

(Therefore the possible sets of columns can be (in any column order): 1) 'Combination' and 'Related crystal'; 2) 'Combination', 'Code', and 'SMILES'; 3) all the columns, though in most cases it would be redundant to have them) 

__Usage example:__

User imports some compounds and uploads the following cocktail file:

```
combination, code, smiles
1, code1, <smiles1>
1, code2, <smiles2>
2, code3, <smiles3>
2, code4, <smiles4>
```

This input file will create two combinations, with `number` attribute `1` and `2`. One crystal in the experiment will be simultaneously exposed to compounds with code1 and code2 (as combination with number 1), and another crystal will get code3 and code4 compounds (as combination with number 2). 

A week later, user decides to try more combinations, imports a new library into the project, and uploads another cocktail file:

```
combination, code, smiles
1, code5, <smiles5>
1, code6, <smiles6>
1, code7, <smiles7>
2, code8, <smiles8>
2, code9, <smiles9>
2, code10, <smiles10>
```

This will create two more combinarions: a combination with `number` attribute `3`, that has compounds with code5, code6 and code7, and  a combination with `number` attribute `4`, that has compounds with code8, code9 and code10. 

**TODO**: create a page explaining CSV file formatting for cocktails, like the one in SoakDB that explains file formatting for cherry-picking lists and plate maps.

### Cocktail form upload

The cocktail form is uploaded to the view `create_combinations()`, which calls `create_validated_combinations()` on the user-uploaded file if it is verified as valid (if it is not, user is shown an error page listing all the problems). The helper finds out from what number to start numbering the combinations, and launches `update_combinations()` on each row of the combinations file. `update_combinations()` either creates a new combination, or adds a new compound to a previous combination, depending on what is needed.

**TODO: Test and debug finding compounds based on `related_crystal'**

At the moment, `update_combinations()` only finds the relevant SpaCompound objects based on the code and the smiles.
There is a code block for handling files where these are not provided, but it has not been run or tested yet (no data to test them on has been created yet) and is commented out.
The block is supposed to find Lab object related to the relevant crystal and check what the crystal was soaked in. If it was a single compound, this compound is added to the new combination. If it was a cocktail (compound combination), all the compounds from that cocktail are added to the new combination. (probably creating new cocktails based on previous cocktails is not practiced in the lab yet, but users should know that if they ever decide to do it, they should treat related crystals exposed to a cocktail in exactly the same way as a crystal exposed to just one compound). I'm not sure how to handle the situation when 'related_crystal' was a part of solvent testing - probably this should be treated as an error during upload validation process.

## The front end

The source import page is available at `/source/`, contained within the `Source` component. It provides an interface for importing compounds to the experiment and adding new combinations, as well as displaying the ones that have already been added.

## `<Source>` 

- `componentDidMount()` - the method downloads the data of the project, and all SpaCompound objects and CompoundCombination objects related to the project from the API. It launches other methods that process the downloaded data if it is needed before saving it the the component's state (explained in documentation for the reusable_components directory)

- `componentDidUpdate()` - ensures that the state gets updated once the downloads from the API are complete

- `getTotals()` - counts how many used and unused compounds there are in the state (explained below) **TODO: add options appropriate for compound combinations**

- `render()` - displays the forms and a table listing all the already imported compounds, divided into library plates. Each plate is represented by a `<PlateRow>` element.

##  `<PlateRow>` 
Renders one table row representing  one library plate that is used in the experiment. Each row has `<Show>` and `<Hide>` components that can show or hide `<PlateDetails>` component listing all the compounds in the plate that are used. For more details refer to documentation of `<ExistingBatchRow>` [url], from which this component inherits.

## `<PlateDetails>`
Renders a table (nested in the main table of the site) which represent each compound in one row.

## `<ImportForm>`

This component creates the form used for importing the selected compounds into SpaCompound objects. If the selection contains no subsets, it only presents the importing options (the ones described in the 'Three modes of importing data' section of this document). If there are subsets, it generates `<SubsetSelect>` elements for each of them, which are `<select>` elements where the user can specify which library plate will be used for the subset.

## `<SubsetSelect>`

- `componentDidMount()` - downloads library data (to access the list of available plates); **TODO: maybe some API endpoint from SoakDB could be reused for this?**

- `countCurrent()` - counts current plates in order to check how many plates are needed to fit the whole library (and how many plates user needs to select to make sure all the compounds can be reached)

- `render()` - if the library needs only one plate, a <select> element for the library is rendered, with each available plate as one <option>. If more plates are needed, such an element if displayed for each needed plate (with the same set of <option>s). It is similar to the `<ExportForm>` element in webSoakD (https://github.com/Marta-Rudnicka/webSoakDB/blob/main/documentation/soakDB_frontend.md )

## `<CocktailForm>`

This component provides the form used to upload compound combinations. It is shown only when there already are some SpaCompound objects created for the project (because the user cannot make any combinations before the needed compounds are created).

# Solvents - specification


