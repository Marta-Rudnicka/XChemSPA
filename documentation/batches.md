# Batches

*The author of this documentation waives all responsibility for the psychological damage resulting from reading and trying to follow this section. It is advised to consume a large amount of caffeine before attempting to approach it.*

This page provides an interface used in creating batches and associating a crystal to a compound or compound combination.
- [Architecture, page layout and directories ](#arch)
- [What the page does](#spec)
- [Non-react classes intro](#classes)
- [Plate class](#plate)
- [Match](#match)
- [Batch](#batch)
- [Matching process (data model PoV)](#matching)
- 
## Architecture, page layout and directories <a name="arch"></a>
This page is meant to let user try out different option and combinations before making a final decision, therefore   most of the data processing is done on the the front end.
User creates and manipulates various items organised into plates and batches (explained below). Apart from the usual React methods used to control how the page interacts with the user, this application requires multiple methods handling the internal logic of what happens to the manipulated items. 

To make everything more clear, the interface and the data processing have been separated:
- rendering page elements and direct interaction with the user are handled as usual by the React components
- the data manipulated on this page, together with all the processes triggered by changes in the data are handled by separate non-React classes and their own methods . While it is technically possible to change attributes in those object directly from the React part it is not advised to do so - **if you modify this part of the application, only used those objects' own methods!** These methods ensure that the change in one attribute is followed by all the other attribute changes that result from that (for example, if you remove a library plate from a Match, it will make sure to remove all its compounds as well).
- the main parent component of this page, `<Batch>`,  stores the item data in its state, inside the data class instances. React component methods don't interact with that data directly, but by calling those objects' methods. It's a bit like React running another little object-oriented application on top.

It should become clearer as I get to more concrete examples

The page itself has three main sections: the collapsible sidebar listing all the library and crystallisation plates in the experiment, a table listing all the batches that have already been created, and a table for creating the new batches (with an options bar). The old batches and the sidebar are all handled by React only, as they mainly just display information. Also, they are collapsed by default. The creation of the new batches is the part that requires all the extra processing.

Since the "Batches" page uses a lot of different components, the `/src/batches` is divided into subdirectories, with only the main `Batches.js` being directly in  `/src/batches`.
- `src/batches/data-classes` contains all the non-React classes 
- `src/batches/new-batches` contains React components used in creating new batches
 - `src/batches/old-batches` contains React components used list already created batches
 - `src/batches/sidebar` contains React components used in the sidebar
 
## The purpose of the "Batches" page <a name="spec"></a>
### What is a batch?
A batch is a group of crystals and compounds that go into the dispenser together. For technical reasons, a batch must fullfill the following criteria:
- all the crystals in a batch must come from the same plate
- all the individual compounds in a batch must come from the same plate
(Probably it would be possible to use multiple library plates in cocktails as long as all the compounds in **one soak ADD LINK** come from the same plate)
For example, if you have two crystallization plates with 150 crystals each, and a library plate with 350 compounds, it will make at least two batches. Sometimes batches are as large as possible covering a whole plate ("one batch per plate"), and sometimes batches have fixed size (a multiple of 16). For each batch, a separate Echo file is produced.
### How is a batch created
The user interface for creating batches is a table with two drop-down lists: one with all the library plates, and one with all the crystallisation plates (that still have some items not tested yet). User matches plates together and gets immediate feedback: how many batches will be created from such a match, how many crystals or compounds will be left in one of the plates etc. With every change in the selection, items are moved from one batch to another, reserved for a batch, freed, a match is divided to smaller and larger batches etc. In the example above, in the "one batch per plate" system after matching the first crystal plate with the (only) library plate, there would be one batch of 150 crystals, the first crystal plate would be all used up, and there would be 200 crystals left in the library plate. After switching to 32 crystals per batch, the plates would have the same number of items used and unused, but there would be 4 batches of 32 crystals, and one batch of 22 crystals (you can't add more crystals from the second plate to make 32, because one batch can't have crystals from different plates). 
User can fiddle around with the plates to find the optimal configuration.
While the batches are reconfigured, only plates are matched together, and the numbers of used and unused items are updated - individual crystals are not matched to individual compounds or cocktails yet. However once the user decides to save the created batches, such individual matches are created. At this stage, both `Batch` and `Lab` instances are created, recording which compound (or combination) goes with which crystal, in which batch.

## Plain JavaScript (non-React ) classes used in creating batches<a name="classes"></a>
Before understanding how exactly batch creation works, it is necessary to understand what the classes represent and how they work. Before describing each class, I will discuss common features:
### self-copying behaviour <a name="cloning"></a>
The instances of the classes discussed here are stored in arrays in the state of the `<Batches>` React component. Normally, when something changes in the state, React elements re-render themselves. However here, when something inside a Match or Plate element changes, React does not "see" it.

To force React to re-render the page, every method in the component that manipulates those object does the following:
1. Creates a copy of the array of the objects stores in the state
2. Modifies the objects in the copy
3. Sets the relevant state variable to the copy
Once the state variable is overwritten by something new, React "notices" a change in state and re-renders the component. Since the "Batches" page relies on users getting immediate feedback, this functionality is essential.

To facilitate this behaviour, the Plate and Match classes have the following features:
- `selfCopy()` method that takes an instance of the class and creates an identical instance of it. Some component methods in the application copy the whole JSON objects, but instances of `Plate` and `Match` cannot be copied in the same way, because their methods would not be preserved
- complicated constructors that take different input - either JSON objects with a slightly different data structure, or another instance of the class (for cloning)
### `checkIntegrity()` method
Written for the purpose of debugging. A method called after every operation on the data stored in the class, that checks if the data still makes sense after the operation. If something absurd shows up (such as a negative number of samples), it throws errors to 1) notify the dev about a bug; 2) prevent continuing the experiment with nonsense data (I assume it's better to make have the app break and have to redo the matching than let an unnoticed error go through).  After proper testing, the method calls could be removed from other methods. 
### The Plate class<a name="plate"></a>
An instance of Plate can represents either a library plate, or a crystallisation plate. Apart from being used in creating batches, it is also used for displaying plate data in the sidebar, which is why it also stores information that is not relevant in creating batches (e.g. information about used crystals).

The `<Batches>` component downloads the SpaCompound and Crystal data from the API and processes it before passing it to the Plate constructor: SpaCompounds are grouped into library plates and, and both compounds and crystals are assigned "used" and "unused" status based on whether they are related to any Lab objects (the same function is used in the "Sources" page).
Compound combinations are also grouped into one fictional "plate", which treats the whole combination as one item.

**Attributes**
Some of the `Plate` attributes that need explanation are:
- `items` - an array of crystals, compounds, or compound combinations - depending on what the input data is - which have not been used yet and can be assigned to new batches
- `selected` - (library plate only) - the number of all the compounds from the plate, which were selected for the experiment (when testing the whole library, it will be all available compounds, and with a cherry-picking list only some of them)
- `excluded` - (crystallisation plate only) - the number of crystals that are not supposed to be used in the batches that are about to be created. Sometimes users want to use only a part of a crystallisation plate, and save the other part for later. The Batches interface lets them "exclude" some of the crystals, which means that the batches creation mechanism will not take them into account at all.
- `used` - the number of items that are already used (already present in the input data)
-`usedItems` - an array of items that are already used (i.e. they are already assigned to saved Batch and Lab objects, and possibly experimented on) - these do not take part in the batch creation process
-`size` - the number of all items available for assigning to new batches. Usually it is just the number of unused items, but in case of crystallisation plate the size can be changed by excluding crystals.
-`originalSize` - the initial size of the plate when it is first created - this one is not supposed to be modified
- `unmatchedItems` and `matchedItems` - before `Batch`es and `Labs` are created in the database, crystallisation and library plates are temporary matched to one another to see what the resulting batches would be like. `matchedItems` is the number of items that are **temporarily** matched to corresponding items in another plate, and  `unmatchedItems` are still available for new matched. For example, if you match an 80-crystal crystallisation plate to 60-compound library plate (both completely unused). After making this match, the crystal plate will have 60 matched crystals and 20 unmatched crystals, and the library plate will have 60 matched compounds, and no unmatched compounds left. If you take another library plate and try to match it to the crystal plate, the application will only use the remaining 20 crystals in the new match. Crystals that are permanently matched (i.e. saved in database) are treated as "used" and not included in the process.
- `isLibPlate` - a boolean saying whether the instance of Plate represents a library plate or not
**Methods**
- constructor and `copySelf()` - [explained above](#cloning)
- `sortItems()` - called by the constructor: divides `this.items` into arrays of used and unused items based on status (status is added before the data is passed to the constructor)
- `useItems()` and `unmatchItems()` - assign a specific number of items to the temporary batches, or remove them from batches and make them available again; these function as setter methods that update the numbers of `matchedItems` and `unmatchedItems`.
- `excludeItems()` and `includeItems()` - used to exclude a part of a crystallisation plate from the nearest batched; setter methods updating `excluded` and `unmatchedItems`
- `resize()` - changes `this.size`. This is a separate method from `exclude/includeItems()` because its aim is to undo any temporary batches that include crystals from the plate being resized. If the user is trying to exclude crystals from a plate that is already in a batch, the results would be hard to predict: naturally, XChemSPA could be programmed for a specific behaviour, but whatever it would be, it would not be obvious to the user what exactly would happen (more below).

### The Match class<a name="match"></a>
This class does not represent any physical object in the lab, but an abstract object recording the fact that the user decided to use compounds from a particular library plate, on crystals from a particular crystallisation plate. When you created a match, it takes up all available items from plates involved, for which it can find corresponding items in the other plate (as explained in the section `matchedItems` / `unmatchedItems` attributes in Plate).
If the "one batch per plate" option is chosen, the new Batch created will have exactly the same items as the whole Match. With a fixed batch size, the items in Match will be divided into more Batches.
**Attributes**
- `size` - the number of crystals in the match (this needs clarification, because in case of cocktails, it would not clear whether this would refer to the number of crystals, or the compounds)
- `batches` - an array of Batch objects resulting from making such a match
- `batchSize`- the desired number of crystals in a batch; if it is set to 0, it means the whole match will be made into one batch
**Methods**
- `resetLibraryPlate()` and `resetCrystalPlate()` - sets `libraryPlate` or `crystalPlate` to null when user decides to un-select them; this also results in removing all the batches, crystals and compounds from the match  (using the `empty()` helper method)
- `getItemsList()` a function called by the constructor to fill in  `crystals` and `compounds` - it takes up unmatched crystals and compounds from the included plates and assigns them to the Match
- reset() - resets all the attributes to nulls, empty lists and 0
- `addItems()` - takes in more crystal and compounds - may be needed used when one of the plates included in the batch is removed from another batch and suddenly has unmatchedItems not included in this match  (it will be explained in more details below)
- `makeBatches()` - creates new Batches and saves them in `this.batches`
- `resetBatchSize()` - user might change the batch size after the mach is created; this method ensures that after doing so, the Match will remake all its batches according to the new demands

### The Batch class<a name="batch"></a>
This class only stores the data that will be later used to create a Batch object in the database. It only has a constructor and `checkBatchIntegrity()`.

### Matching plate process (in reference to the plain JS data model) <a name="matching"></a>
(Reminder: crystals or compounds that have already been assigned to batch before are not included in the process - all the items I am referring to are "unused").
In the beginning of the matching process, all plates have 0 matched items, and all of their items are unmatched. Throughout the whole process, for every plate it is true that:
For library plates:
`unmatchedItems` + `matchedItems` = `size`
For crystallisation plates:
`unmatchedItems` + `matchedItems` = `size` - `excluded`
**Making a new Match**

To create a functional Match, the user need to select one library plate, and one crystallisation plate.
After selecting the first plate for the new match nothing happens, but when the user selects the other one, a new Match object is created. The selected plates are assigned to  `libraryPlate` and `crystalPlate`. The method that calls the constructor for the new Match checks how many unmatched items are in each of the two plates plate - the smaller number is set as the `size` of the new Match. The selected `batchSize ` is stored in the application's state and gets passed to the constructor too.
If `Match.size` == *n*, then *n* compounds from the library plate, and *n* crystals from the crystallisation plate are assigned to `Match.compounds` and `Match.crystals` respectively.
The Match is then divided into Batches, which are stored in `batches` (more on this later).
After creating the new Match, it is time to update the plates: *n* items are "used" in each of them. (This means that after this operation, for the plate with the smaller number of items, all items become unmatched, and `matchedItems`==0).
Usually, the plates don't have exactly the same number of items available, so one of the plates has some unused items left. These items can be used in another Match.
**Modifying an undoing a Match - simple scenario**
Let's suppose there is only one Match already created. If user removes one plate from the Match, the following happens:
- depending on what kind of plate is removed, `libraryPlate` or `crystalPlate` in Match is set to `null`
- all the items that belonged to the Match in the "unselected" plate become "unmatched" again - they can go to another Match now
- since the other plate (the one left in the Match) does not have any corresponding items to match its own  items too (e.g. the crystallisation plate does not have any compounds to match its crystals to any more), its items that used to be in the Match also become "unselected". For the same reason, all the batches disappear.
- as a result, every value in the Match becomes 0 or an empty array apart from the one plate that is left
Now, the user can select a different plate in place of the one that was removed. If, instead, the user removes the other plate, the Match is completely empty - such a Match is immediately dropped from the array in which it is stores (`Batches.state.matches`).
**Modyfing a Match while it affects a different Match** <a name="recalculate"></a>
Let's suppose a plate is involved in two Matches, which, together, cover all its items. It this situation, it has 0 unmatched items, but if the user unselects it from one of the Matches, it suddenly gains some.
Now, there is a possibility, that the other Plate in the other Match still has some unmatched items. Once the first Plate is removed from the first Match, it turns out there are two plates that belong to the same Match (the second, unmodified Match), and at the same time, both have unmatched items.
In this situation, the items from the first plate that were "freed" from the first match, will be automatically assigned to the other Match and associated with the items of the other plate in that Match.
#### <ins>Example use case</ins>
This may be confusing without concrete numbers, so here is an example scenario which follows what happens step-by-step (apart from what happens to batches - that will be covered elsewhere)
There are the following plates in the project:
| ||
|--|--|
|Library Plate 1 (100 compounds) |Crystal Plate 1 (150 crystals)|
|Library Plate 2 (80 compounds) |Crystal Plate 2 (50 crystals)|
|Library Plate 3 (60 compounds)|Crysta Plate 3 (70 crystals)|
||Crystal Plate 4 (105 crystals)|

In the beginning, in each plate `matchedItems` = 0 , and `unmatchedItems` has whatever the number of items is in the plates.
1. User selects Library Plate 1 and Crystal Plate 1 for the first Match. After this operation  the values are as following:

| attr.|Match 1|attr. | Library Plate 1 | Crystal Plate 1 |
| --- | --- | --- | --- | --- |
|||*size*|*100*|*150*|
|size | 100 | matchedItems |100 (all here) |100 (all here)|
| ||unmatchedItems|0|50|
|libraryPlate| Library Plate 1|
|crystalPlate| Crystal Plate 1|

2. After this operation, Libary Plate 1 is no longer available for selection. For the second Match, the user selects Library Plate 2 and Crystal Plate 1 (to use the rest of it). After this operation:

| attr.|Match 2|attr. | Library Plate 2 | Crystal Plate 1 |
| --- | --- | --- | --- | --- |
|||*size*|*80*|*150*|
|size | 50 | matchedItems |50 (all here)|150 (50 here, 100 in Match 1)|
| ||unmatchedItems|30|0|

The Match could not be larger than 50 samples, because there were only 50 crystals left in Crystal Plate 1.
3. Now, Library Plate 1 and Crystal Plate 1 are all used up and unavailable for further selection. For the next Match, user finishes off Library Plate 2 and matches it with Crystal Plate 2. After this operation

| attr.|Match 3|attr. | Library Plate 2 | Crystal Plate 2 |
| --- | --- | --- | --- | --- |
|||*size*|*80*|*50*|
|size | 30 | matchedItems |80 (30 here, 50 in Match 2) |30 (all here)|
| ||unmatchedItems|0|20|
Now, the Match is small, because there were only 30 compounds left in Library Plate 2.
4. Now Crystal Plate 2 has only 20 crystals left to match, (which also means this is the max. size of a batch that can be made out of it). User would prefer to have larger batches, and decides to change something. User unselects Crystal Plate 2 from the match. After this:
| attr.|Match 3|attr. | Library Plate 2 | Crystal Plate 2 |
| --- | --- | --- | --- | --- |
|||*size*|*80*|*50*|
|size | 0 | matchedItems |50 (all in Match 2) |0|
| ||unmatchedItems|30|50|
|libraryPlate| Library Plate 2|
|crystalPlate| `null`|
5. Now user tries out Crystal Plate 3 instead:

| attr.|Match 3|attr. | Library Plate 2 | Crystal Plate 3 |
| --- | --- | --- | --- | --- |
|||*size*|*80*|*70*|
|size | 30 | matchedItems |80 (30 here, 50 in Match 2)|30|
| ||unmatchedItems|0|40|
6. User decides it is all wrong anyway, and needs changing. She goes back to Match 1 and removes Library Plate 1 from it. This means Crystal Plate 1 now has 100 more crystals to go. After this:

| attr.|Match 1|attr. | Library Plate 1 | Crystal Plate 1 |
| --- | --- | --- | --- | --- |
|||*size*|*100*|*150*|
|size | 0 | matchedItems |0|50 (all in Match 2) |
| ||unmatchedItems|100|100|
7. Now the user decides to remove Library Plate 2 from Match 3:  <a name="recalculate-ex"></a>

| attr.|Match 3|attr. | Library Plate 2 | Crystal Plate 3 |
| --- | --- | --- | --- | --- |
|||*size*|*80*|*70*|
|size | 0 | matchedItems |50  (all in Match 2)|0|
| ||unmatchedItems|30|70|
 This causes a "chain reaction":
- Library Plate 2 now has 30 unmatches items
- Library Plate 2 is also matched to  Crystal Plate 1 (in Match 2) The situation in Match 2 is:

| attr.|Match 2|attr. | Library Plate 2 | Crystal Plate 1 |
| --- | --- | --- | --- | --- |
|||*size*|*80*|*150*|
|size | 50 | matchedItems |50 (all here) |50 (all here)|
| ||unmatchedItems|30|100|
- Sice both plates have unmatched items despite being assigned to one another, the extra compounds from Library Plate 2 are matched to the extra crystals from Crystal Plate 1. The situation is corrected to:

| attr.|Match 2|attr. | Library Plate 2 | Crystal Plate 1 |
| --- | --- | --- | --- | --- |
|||*size*|*80*|*150*|
|size | 80 | matchedItems |80 (all here)|80 (all here)|
| ||unmatchedItems|0|70|
8. Library Plate 1 still has no crystallization plate assigned. The user decides to match it to Crystal Plate 4:


| attr.|Match 1|attr. | Library Plate 1 | Crystal Plate 4 |
| --- | --- | --- | --- | --- |
|||*size*|*100*|*105*|
|size | 100 | matchedItems |100 (all here)|100(all here)|
| ||unmatchedItems|0|5|
9. Now user decides to use the rest of Crystal Plate 1 on Library Plate 3:
 
| attr.|Match 4|attr. | Library Plate 3 | Crystal Plate 1 |
| --- | --- | --- | --- | --- |
|||*size*|*60*|*150*|
|size | 60 | matchedItems |60 (all here)|140 (80 in Match 2, 60 here)|
| ||unmatchedItems|0|10| 

After it all we get the following matches:

| Match |Size|Library Plate|Crystallisation Plate|
|--|----|--|--|
|1|100|Library Plate 1 | Crystal Plate 4 |
|2|80|Library Plate 2 | Crystal Plate 1 |
|3|0|`null`|Crystal Plate 3|
|4|60|Library Plate 3|Crystal Plate 1|
User umatches Crystal Plate 3 from Match 3 to get rid of the useless Match. The final situation is:
| Match |Size|Library Plate|Crystallisation Plate|
|--|----|--|--|
|1|100|Library Plate 1 | Crystal Plate 4 |
|2|80|Library Plate 2 | Crystal Plate 1 |
|4|60|Library Plate 3|Crystal Plate 1|
- all the compounds in all library plates are matched
- all the crystals in Crystal Plate 2 and 3 are unmatched - they can be used later
- Crystal Plate 1 has 10 crystals left, and and Crystal Plate 4 have 5 crystals left

Because all of it is already complicated, some restrictions were instrocuded to avoid potential confusion:
- it is impossible to directly switch a plate in a match - user has first to "unselect" a plate (which can cause some additional effect), and then select another one
- If user decides to resize a crystallisation plate that already belongs to a match, all the matches are undone - there is no obvious way to re-allocate everything after such a change, and re-doing matches is not difficult or time-consuming
### <ins>What happens to the (JS) Batch objects</ins>
(This description applies to Batch objects stored inside Match objects in the front-end, not the Batch model instances in Django.)

While plates, compounds and crystals are assigned and removed from a Match, with every change all batches are removed from `Match.batches`, and automatically re-created to fit the new content of the Match. If the option for batch size is "One batch per plate" (which means `batchSize` is 0), Match just creates one batch that has all the compounds and all the crystals in the match, and stores this batch as the only element in the `Match.batches` array. If the user specifies the desired size of a batch, the `compounds` and `crystal` arrays are divided into chunks of that size and matched together in batches. If after this there are some items left, they all go together to the last batch. For example, if the `size` of the Match is 44, and `batchSize` is 16):
-  `compounds[0]` to `compounds[15]` and  `crystals[0]` to `crystals[15]`   go to the first batch
-  `compounds[16]` to `compounds[31]` and  `crystals[16]` to `crystals[31]`   go to the second batch
 -  `compounds[32]` to `compounds[43]` and  `crystals[32]` to `crystals[43]`   go to the last batch
 
 Each time the user changes the batch size, the batches are removed and recreated according to the new specification.
React re-assigns batch numbers each time the batch configuration changes - batch numbers rely on information that Plate or Match objects do not have, so it cannot be handled by the objects themselves.

# React components on the page
### `<Batch>`
This is the top-level component on the page, which contains everything else.
** State** 
- `asideClass` - decided whether the Sidebar should be shown or collapsed
- `existingBatches` - all the batches that are already saved in the database
- `libraryPlates`, `crystalPlates` - library and crystallisation plates in the project **represented by Plate objects**
- `combinations` - CompoundCombination included in the project
- `matches` - Match objects
- `batchSize` - the desired size for the new batches about to be created
- `batchStart` - the number from which the number of new batches should start; if there are no batches in the project yet, it should be "1", but if, there are, for example, 3 batches already, the new batches' numbers should start from "4"
**Methods**
- `componentDidMount()` - downloads and processed all the needed data from the database, using the following helpers:
	- `loadCompounds()` - 1) downloads the data of all the SpaCompounds in the project from the API; 2) divides the compounds into library plates and adds "used"/"unused" status to the them (which creates JSON objects, one for each plate); 3) creates Plate objects based on those JSON objects and saves them in `this.state.libraryPlates`. Uses `createLibraryPlateObjects()` helper method
	- `loadCrystals()` - 1) downloads the data of all the crystallisation plates in the project from the API; 2) adds "used"/"unused" status to each crystal; 3) creates Plate objects based on the data  and saves them in `this.stat.crystalPlates`. Uses `createCrystalPlateObjects()` helper method
	- `loadExistingBatches()` - downloads all the already saved batches from the API and saved the data in the state; also counts the batches and sets `batchStart` accordingly
	- `loadCombinations()` - 1) downloads all the CompoundCombinations from the API and saves them in the state; then launches `processCombinations()` on the data
	-  `processCombinations()` first creates a JSON object which is structured like a library plate representation, but it has the saved compound combinations instead of compounds in it. Then, it goes through every combination and  adds "used"/"unused" status to it. Each of those compounds already belongs to one of the library plates in the state (otherwise it could not have been added to a combination). To prevent using it twice, the method scans the contents of `this.state.libraryPlates` and to locate each compound, and changes its status to "combined". A compound with such a status will not be added to a batch as a single compound. Then, the method creates a fictional Plate object based on the JSON fictional plate, and adds it to `this.state.libraryPlates`. For this plate, each item will be a compound combination (but it is processed in the same way as a regular library plate in the batch creation process)
- `componentDidUpdate()` - ensures that the combination data is processed after it is downloaded 
- `createPlateObjects()` - takes in a JSON object representing a library or crystallisation plate, and passes it to a Plate constructor; called two different wrappers depending on what type of plate it is 
- `setBatchSize()` - changes the `batchSize()` in the state, and also updates this value in all the matches
- `deleteEmptyMatch()` - makes sure matches that have both plates removed from them are deleted
- `recalculateMatch()` - the method responsible handling "freed up" items after a plate is removed (see: [explanation](#recalculate) and [example](#recalculate-ex)
- `reNumberBatches()` - assigns new `number`s to batches when something changes; sometimes called via `reNumberBatchesWrapper()`, depending on whether it is convenient to pass it the matches array or not
- `resizeAndRefresh()` - ensures React notices resizing a crystallisation plate (so it can re-render the component)
- `resetAll()` - undoes all the matching
- `saveBatches()` - uses  `prepareBatchData()` to format the data of the Batches stored in the state, and  sends it in a POST request to the `create_batches()`view. Thus, new Batch and Lab objects are created in the database
- `checkDataIntegrity()` - for debugging - checks if all the data in the state makes sense and throws error if something is wrong
 ## Sidebar
 An `<aside>` element whose usual function is letting the user quickly look up what kind of plates are available in the project. It is collapsed by default. It has a table with the library plates, (**TODO table with information about compound combinations**), and a table with crystallisation plates.  It can also launch the interface to resize a crystallisation plate.
### `< LibraryPlates>`
Renders a table listing basic information about the library plates.
### `<Combinations>` 
Extra table that should only show up if there are any combinations in the project. It processes the combinations to find out how many compounds from all combinations come from which library plate, and how many of them are used or unused. Then, it displays that information in a table.
### `<CrystalPlates>`
Displays all the crystallisation plate data in a table. For every plate, there is a button that opens  `<CrystalPlateModel>` for this plate.
### `<CrystalPlateModel>`
This component provides a visual interface that allows the user to exclude some crystals from the experiment.
**Usage**
Sometimes the user does not want to use the whole crystallisation plate in one go, but only a part of it (and use the rest another time). To ensure correct batch creation, the crystals that the user does not want to use in the current experiment have to be "excluded" in the Plate object and not taken into account at all.
Which crystals exactly should be excluded is dictated strictly by how the physical plate used. Crystallisation wells are arranged it groups or two or three, and those groups are arranged in rows and columns. ( [Plate product description with photos for reference](https://swissci.com/product/3-lens-crystallisation-plate/)) The crystals are used up column after column (which is related to how the sticker covering the plate during storage is applied and removed). Therefore, when the user decides to exclude some crystals, the few whole last columns in the plate should be excluded.
**Interface**
The general idea is that the user sees a simplified visual representation of the plate (an simple HTML table with some styling and images) and excludes a part of the plate by clicking on the last column to be used in the current experiment (i.e. in the batches about to be created).
<ins>Features:</ins>
- The included part of the plate is highlighted, and the excluded one is darkened.
- The header of the table contains markings with column numbers (the physical plates have similar markings near the top edge). When user hovers the mouse over this header, the highlighted area follows the cursor - the columnd under the mouse and everything left from it is light, and everything to the right is dark. When the user clicks on a particular column,  vertical line appears on its right edge. When the user keeps moving the mouse, the highlight still follows the cursor, but the vertical line stays in place. If the user moves the cursor away from the plate representation, the line still stays: columns on the left to the line are light, and on the right are dark. 
- Above the plate model, there is a box showing three values: "Available", "Selected" and "Highlighted". "Available" is the number of all unused crystals in the plate. "Selected" is the number of the crystals in the selected area, i.e. on the right from the vertical line. "Highlighted" is the number of all available crystals in the highlighted area of the plate. The latter two numbers are instantaneously updated as the user moves the mouse around or clicks on a column. Thus, user can immediately know how many crystals will be available for the current experiment if a specific part of the plate is excluded.
- When the user clicks on "save", the number of the crystals on the right (from the vertical line) with be excluded from the Plate object
**State**
-`lastColumn`
-`lastClicked`
-`lastUsed`
- `usedColumns`
- `columns`
- `selected`
- `highlighted`
**Methods**
- `componentDidMount()`
- `componentDidUpdate()`
- `divideCrystalsIntoColumns()`
- `setToLast()`
- `reset()`
- `choose()`
- `countCrystals()`
- `saveAllotment()`
### ``
## New batches section
### `<BatchForm>`
-`pickBatchSize()`
### `<Match>`
**State**
- `selectedLibPlateId` -
- `selectedCrystalPlateId`
- `selectedLibPlate`
- `selectedCrystalPlate`
**Methods**
- `resetMatch()`
- `changeLibraryPlate()`
- `changeCrystalPlate()`
- `reMatchItems()`
### `<NewBatches>`
### `<SelectCrystalPlate>` and `<SelectLibraryPlate>`
### `<UnmatchedPlates>`
**State**
- `selectedLibPlateId` -
- `selectedCrystalPlateId`
- `selectedLibPlate`
- `selectedCrystalPlate`
**Methods**
- `componentDidUpdate()`
- `reset()`
- `createMatch()`
- `selectLibPlate()`
- `selectCrystalPlate()`
- `getDropsLeft()`


## Old batches

