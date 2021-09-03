# Different kinds of table rows - component inheritance and mixins
Most of the XChemSPA is mostly composed of tables listing all the relevant items (such as library plates or batches). For most tasks, it is not necessary for the user to see individual crystal or compound data all the time. The larger items are listed in the page's main table, and when necessary, user can reveal and hide a nested table which lists all the individual samples in the item.
Since several pages in the app follow more or less the same a pattern, the code is largely reused with the aid of inheritance and mix-ins. There are two types of components involved in this:
- a table row representing one of the larger items (these are mostly called `<...BatchRow...>`)
- a nested table that lists all the samples in a batch (these are mostly calles `<BatchDetails...`>

Even though JavaScript is technically prototype-based, and not class-based, this guide will describe everything in terms of classes. The code uses the syntactic sugar that imitates classes in JS everywhere, even in places where it is not dictated by using class-based React components. (Also, this is how I conceptualise it, having dealt with OOP in class-based languages before I learnt JS).

The base classes from which everything else inherits are `<ExistingBatchRow>` and `<BatchDetails>` used on the "Batches" page. A lot of extra methods need to be used in more than just one component, therefore they are implemented as in mixins.

- [Batch page components (prototypes)](#batch)
- [(What are the two views for cocktails?)](#cocktail)
- [Source page components](#source)
- [Soaking page components](#soak)
- [Cryoprotectant page components](#cryo)
- [Harvesting page components](#harvest)
- [Mixins](#mixin)



## Components 

**Batch page (prototypes)**<a name="batch"></a>
### `<ExistingBatchRow>`
This is one top-level row in the table listing already created batches on the "Batches" page. `<ExistingBatchRow>` is used for single-soak batches (those with one compound per crystal). It has a few methods whose only job is to return some element to be rendered - in this way, sub-classes can modify specific elements without the need to overwrite the whole `render()` method. The state of this element only governs which parts of the cmponent are currently visible. `detailsBySoak` state variable does nothing and only matters in sub-classes
- **showDetails() and hideDetails()** - these methods manipulate the state, which leads to showing and hiding `<BatchDetails>` - an embedded table listing all the crystals and compounds - as well as icons used to change the state 
### `<BatchDetails>`
This is the sub-table user can reveal to see all the crystals in the batch. The methods don'd "do" anything, only return some elements that are later rendered. The `editedPlate` state variable is not used for anything (yet). If it was not meant to be a superclass of a few other components, this component would only have the `render()` method, since all it does is showing a static table.
### `<ExistingBatchRowCocktail>`
This is a table row with a batch where there are multiple compounds used on one crystal. The component  inherits from `<ExistingBatchRow>` and adds methods from `basicCocktailMixin()` (the mixin is described below). When it shows the batch details, it allows switching between two views.
**Two ways of presenting crystals and compounds in a cocktail batch**<a name="cocktail"></a>
Batch details information is grouped in two ways: by crystal, and by soak. The former is quite intuitive: for every crystal, all the compounds that go with it are listed in adjacent table rows. 
Grouping by soak is related to how a cocktail is handled by the Echo dispenser. Echo dispenses cocktails one compound at a time, and each input file for Echo can only map one compound to one crystal. To create cocktails composed of *n* compounds, Echo needs *n* files, and *n* "rounds" in which it dispenses something onto the destination plate: the first file directs adding the first compound to each crystal well, and each next file adds one more compound (to the same wells). Each "round" is referred to as "soak".
When the batch data is grouped "by soak", it shows a separate sub-table for each soak, with one compound going with one crystal (each sub-table has the same crystals, but different compounds).

### `<BatchDetailsCocktail>`
This is the equivalent of `<BatchDetails>`, but for cocktails, and inherits from `<BatchDetails>`. It groups compounds by crystal. It overwrited some of the methods of the super-class.
- `getFirstCell()` - this method generates the table cell that displays the well name in which the crystal is (this the only value related to the crystal). This cell spans all the rows with compounds that go with the crystal.
- `getCombinationRows()` - this produces table rows for one crystal combination: one high cell with the crystal's well at the beginning of the row, and regular table rows with compound data

### `<BatchDetailsBySoak>`
This is the equivalent of `<BatchDetailsCocktail>`, but it groups samples by soak, not by crystal. It does not inherit from any other XChemSPA class, only React's `Component`.
- `countSoaks()` - this method establishes how many soaks there will be (by checking how many compounds there are in the combination with the largest number of compounds in it)

**Source page**<a name="source"></a>
### `<PlateRow>`
This is the only component that extends `ExistingBatchRow`, but does not show a batch. It represents one library plate, and re-uses the mechanism to show and hide a nested table listing all the compounds in it.
The single compounds are listed in  `<PlateDetails>` , which performs the same function as `<BatchDetails...>` components, but does not extend any of them (the data is too different).

**Soak page**<a name="soak"></a>
### `<BatchRowSoak>`
A table row representing one single-soak batch on the "Soak" page. It inherits from `<ExistingBatchRow>` and uses `timestampMixin()`.  This component is much more complicated than its prototype, as it is involved in generating data, not just displayng it for reference. It mostly inherits showing and hiding a table with details - all the rest of the method, inluding the constructor and `render()` is new.
**New state variables**
- `path ` - the beginning of the URL for the download link (for the Echo file)
- `transferTime` - the timestamp marking when the batch started soaking (if it has)
-  `elapsedTime` - time since the start of soaking (displayed during the soak)
**Some of the methods**
- `componentDidMount()` - ensures that if the soaking process for the batch has started,  elapsedTime is measured
- `getStatus()` - returns appropriate interface elements depending on the batch's status: it could be just the string with the status, a download button or timer
- `startSoak()` and `stopSoak()`methods - initiate time-tracking and interface changes needed at the beginning and the end of the soak
- `measureTime()` responsible for updating `elapsedTime` while the crystals are soaking
- `saveSoakTime()` sends the  generated timestamp to the API to be saved
### `<BatchRowCocktailSoak>`
An equivalent of `<BatchRowSoak>`, but for cocktails. It extends `<BatchRowSoak>`, and adds two more mixins: `basicCocktailMixin`(just like `<ExistingBatchRowCocktail>`), and `cocktailBatchInfoMixin` (also uses  `timestampMixin()`which it gets from  `<BatchRowSoak>`).
- `soakCounter` state variable - an array of ints, each representing one soak
- `makeDownloadLinks()` - creates separate download links for each Eacho file needed for the cocktail batch
- `trackDownloads()` - makes sure all the Echo files for the batch have been downloaded before the batch status is changed and timestamps are created; with every download, it removes an element corresponding to it from soakCounter, and once the array is empty, it fires `handleFileDownload()`

**Cryo page**<a name="cryo"></a>
###  `<BatchRowCryo>` and `<BatchRowCocktailCryo>`
Both these components inherit from `<BatchRowSoak>` and add `cryoMixin()`. Additionally `<BatchRowCocktailCryo>` uses two more mixins : `cocktailBatchInfoMixin()` and `basicCocktailMixin()` (just like `<BatchRowCocktailSoak>`).
All the behaviour related to creating multiple links and tracking downloads is not needed for the cocktail batches because the cryoprotectant is dispensed in the same way no matter in how many compounds the crystal has been soaked.

**Harvesting page**<a name="harvest"></a>
### `<BatchRowHarvesting>`
A table row on the "Harvesting" page. Extends `<BatchRowSoak>`.
- `shifterExchange()` - provides interface for generating and downloading an input file for Shifter, and for importing the file later produced by Shifter
- `barcodeReaderExchange()` - produces interface for uploading the barcode reader file
### `<BatchRowCocktailHarvesting>`
 `<BatchRowHarvesting>` with added `basicCocktailMixin()`. **Note** unlike other table rows with cocktails, it does not provide alternative views. At this stage, the crystal has already been through the soaking process and the "soak view" is not really relevant.
### `<BatchDetailsHarvesting>`
Extends `<BatchDetails>` and adds `timestampMixin()`. Does the same thing as `<BatchDetails>`, only includes much more data (which has been produced on the previous stages of the experiment)
### `<BatchDetailsCocktailHarvesting>`
This detail component extends `<BatchDetailsCocktail>`  and uses `timestampMixin()`. 
**TODO:  It might be a good idea to separate out an extra mixin for harvesting details - probably there are some methods in common**
## Mix-ins <a name="mixin"></a>

### `basicCocktailMixin()`
This mixin contain methods that create interface elements needed for batches that use cocktails.
- `getChangeView()` - this method produced a checkbox that allow switching the batch detail view between grouping samples by crystal and by soak (managed by the `handleCheckbox()` method)
- `getBatchDetails()` - overwrites the original method by a new one, which can produce either of the two `<BatchDetails...>` elements used with cocktails depending on the value of the `detailsBySoak` state variable (this variable is present but not used for batches with single soak)
- `getLibrariesInCombinations()` - theoretically one compound combination can contain compounds from different library plates. The "library" and "library plate" fields in the table for a batch should therefore list all the libraries and plates used for it. This method creates strings in which all the library names or plate barcodes are concatenated (separated by a comma), and those strings end up in the table. For example, if the cocktails have some of the compounds from library1 plate1, and some from library2 plate2, this method will produce strings `library1, library2,` which will later go to the "library" fields for the batch, and `plate1, plate2,` which will go to the "library plate" field. 
### `cocktailBatchInfoMixin()`
This mixin overwrites `makeBatchInfo()` to suit cocktails better.
### `cryoMixin()`
The interface for soaking and applying cryoprotectant are very similar. This mixin overwrites a  few methods defined in `<BatchRowSoak>` to handle cryo-related data.
### `timestampMixin()`
Contains methods used to format timestamps.


