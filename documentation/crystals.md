
# The crystals page
This page provides tools for importing crystal data and the secondary crystal selection. Its main component is `<Crystals>`. The application can import the crystal from TexRank already, but the interface for the secondary crystal selection is unfinished. The application can function without it, though -  SoakDB never provided the possibility of secondary selection. XChemSPA could be deployed without this feature, and it can be added later on. In that case, for the time XChemSPA works without secondary selection, I would suggest placing the TeXRank file upload form on the "Sources" page, and removing the "Crystal" page from the application altogether.
- [Explanation of the purpose of the page](#purpose)
- [Uploading crystal data](#upload)
- [The interface overview](#interface)
- [Components](#components)
- [TODO](#todo)
## The purpose of the page <a name="purpose"></a>
The most important function of this page is importing the crystal data from a CSV file produced by TeXRank. This creates the Crystal objects in the database, which are used in the experiment.

The new extra featured planned is secondary selection. The primary selection of crystals is done in TexRank - the images of crystallisation wells are inspected and accepted or rejected based on the presence and quality of the crystal (it may happen that no crystal has formed, or that is unsuitable for an experiment). While making the decision to accept or reject a crystal, the user does not know how many he or she will end up with.
The purpose of the secondary selection would be to have a chance to change one's mind: for example if it turns out there are a few more crystals that are needed to cover the desired library, user could look at the images again and reject the poorest quality crystals of those that passed the primary selection.

## Uploading crystals (essential feature)<a name="upload"></a>
The `<Sidebar>` component placed in `<Crystals>` contains, among other elements, a form where the user enters some information about the crystallisation plate and adds a CSV file produced by TeXRank.
The form data is then processed on the back end by the `import_new_crystals()` view, which creates a `CrystalPlate` in the database based on the user input, and creates new `Crystal`s related to this plate based on the file (running the file through `import_crystal_data_from_textrank()`).
## Crystal gallery and secondary selection (extra feature)
### The interface overview<a name="interface"></a>
Each crystal from the file is represented by a "tile" with the crystal image, along with some information about it. The crystals can have one of three statuses: "accepted", "rejected" and "used".
-  A "used" crystal is one whose "lab_data" in not null. User can take a look at it, but cannot change anything about it in this interface
- All crystals are by default "accepted" after upload (the TeXRank file only includes those crystals that passed the primary selection). 
- "rejected" crystal has been excluded from the experiment during in the secondary selection but is not yet removed from the database
A tile with an "accepted" crystal has a rubbish bin icon, which the user can click to reject the crystal. A "rejected" crystal has a recycling symbol icon, which is used to undo the rejecting. Once the user is happy with the selection, he or she should click on the "Delete rejected crystals", which will remove them from the database.
On the sidebar, there is also a form that can be used for accepting or rejecting crystals in bulk based on score (a value assigned in TeXRank, which is imported with the crystal data)

Crystals in the gallery are grouped by crystallisation plate. Within each plate, the crystals with the same status are grouped together into sections. When user rejects a crystal, the tile disappears from the "accepted" part and shows up in the "rejected" part. Tiles with accepted crystals are larger than the other tiles. Each section and plate is collapsible. Crystallisation plates in which all crystals are already used are collapsed by default (or at least they should).
### Components <a name="components"></a>
#### `<Crystals>`
The main component containing the whole page
**State**
- `crystal_plates` stores all the plate and crystal data
- `accepted`, `rejected`, `used`: store the number of crystals that currently have each status

**Methods**
- `loadData()` downloads all the crystal data from the API, and adds the `status` attribute to each crystal and saves the data in the state
- `changeScore()` allows the user to edit the crystal's score; **Note** these changes will not be saved in the database
- `filterByScore()` the top-level method that manages accepting and rejecting crystals in bulk. It runs `setStatusByScore()` with appropriate argument based on the type of input. `setStatusByScore()`  iterates over all crystals and runs `updateStatus()` on each unused one. `updateStatus()` checks if it is necessary to update each crystal's status, changes it where needed, and returns true if a change is made, or `false` if not. `setStatusByScore()` counts how many times it got `true`, and updates stats based on that number.
### `<Sidebar>`
Contains the sidebar with the "Summary" box, a form for uploading crystal data, and a "Tools" form used for accepting and rejecting crystals in bulk.
- `rejectLimit`, `acceptLimit`, `rejectScore`, `acceptScore` state variables - used to control "Tools" inputs ( [React controlled components documentation](https://reactjs.org/docs/forms.html#controlled-components))
	- `rejectLimit` - numerical score value below which all unused crystals will be rejected
	- `acceptLimit` - numerical score value above which all unused crystals will be accepted (recycled)
	- `rejectScore` - letter score value with which all crystals will be rejected
	- `acceptScore `- letter score value with which all crystals will be accepted (recycled)
- `handleRejectLimitChange()`,  `handleAcceptLimitChange()`,  `handleRejectScoreChange()`,  `handleAcceptScoreChange()` methods - also used in controlling the 'Tools' input. Note: setting `rejectLimit` resets `acceptLimit` and vice versa (to avoid conflicting values)
- `handleApply()` passes the form values to `<Crystals>`'s `filterByScore` to reject or accept crystals in bulk
The input in the 'Tools' form only accepts values that are valid TeXRank scores **(numbers from 0 to 9, or letters: c, l, h, d, g, e, s)**


### `<Plate>`
This component represents one crystallisation plate. It stores the list of rejected crystals in the `selectedToRemove` state variable, and contains methods that handle the process of "accepting" and "rejecting" crystals.
- `handleReject()` and `handleAccept()` - add or removes a crystals from  `selectedToRemove` and updates the count of accepted and rejected crystals
- `deleteRejectedCrystals()` - sends id of each crystal from `selectedToRemove()` to the `CrystalDelete`API view to remove it from the database
- `render()` - inside this method, all the crystals in the plate are divided  into up to three groups by status, each group displayed using a `<CrystalGroup>`. The props passed to each group determine how it is displayed, what icons show up on tiles, and what actions the icons perform. (Accepted crystals get the bin icon and can be rejected, rejected crystals get the recycling icon and can be accepted, and used crystals don't get any action icon)

### `<CrystalGroup>`
This component displays a series of `<CrystalTiles>`, each representing one plate. Its state variables and methods handle showing and hiding the tiles and icons.

### `<CrystalTile>`
An element representing one crystal. It contains a crystal photo (TODO - atm it's a placeholder picture), crystal well name on top, some icons, and a collapsible `<InfoBox>` component containing all the crystal data imported from TexRank. 
What icon is shown, and what action it triggers is determined by the props.

### `<InfoBox>`
**Note**:  `<InfoBox>` is declared in the same file as `<CrystalTile>`
An element that displays all the information about the crystal available just after uploading the TexRank file. The is a controlled component (governed by the `score` state variable and `handleChange()` method) and can be edited - however changes are not at the moment saved in the database, Tweaking scores could be useful in tweaking secondary selection, but it is unsure if there is any need to save them.
### `<PlateButtons>`
Produces buttons that trigger various actions on the whole plate according to what is appropriate (buttons to show and hide the whole plate, delete it(not implemented yet), delete rejected crystals). **Note**: plates from which some crystals have already been used cannot be deleted.

## **TODO**<a name="todo"></a>
- add crystal images (from Formulatrix?)  to the crystal tiles: change the `settings.py` file to allow using images from `/dls/` and find out the path patterns needed to locate the right image. The photos can be associated with the crystal based on the file name (IIRC there if the well name contain in the file name). At the moment a placeholder cartoon crystal image is used there the images should be.
- once the crystal images are available, modify the CSS to make the crystal tiles larger
- In the 'Summary` box, list how many compounds or combinations there are so the user knows how many crystals are needed; also display messages how many crystals are missing, or if there are more than needed for the experiment
	- needed crystals = all unused single compounds (i.e. ones that will not be used in cocktails) + all unused combinations (they are unused if their `lab_data` is None/NULL)
	- if the number of needed crystals is smaller than the number of accepted crystals, write a message such as "you need 3 more crystals to test all selected compounds"
	- if the number of needed crystals is greater than the number of accepted crystals, write a message such as "you have 5 more crystals than you need to test all selected compounds"
- ask users if there is any need to save changes in the crystal score made during secondary selection
- animate crystal tiles when they disappear and appear - it is hard to follow what's going on right now
- implement a method that triggers removing the whole crystallisation plate from the experiment
- make sure plates where all crystals have been used are collapsed by default
