# Navigation within the React application and directory structure
Navigation in the fronted single-page React app is similar to the one in the [compound selection app](https://github.com/Marta-Rudnicka/webSoakDB/blob/main/documentation/soakDB_frontend.md), with react-router used to produce the urls. It is simpler, though, without anything like page lookup pages that take url argument. Until user selects a valid visit, every link redirects to the "Visit" page.
`App.js`, the main component, contains the `switchActive()` method, which is fired each time user navigates to a new page - all it does is change which link is highlighted in the navigation bar.

## Directory structure
All the React app code is in the `XchemSPA_frontend/src/components/` directory. `App.js` contains all the other components in the app. Each sub-page has its own directory (`crystals`, `home`,  ` source`, `batches` , `cryo`, `soak`, `visit`), where the main component is in the file whose name starts with a capital letter. All the other files contain components used inside the main one.
- `layout` directory: contains `<Header>`, which produces the navigation bar visible on every sub-page.
- `reusable_components`: this directory contains code re-used by different components:
	- mixins used for table rows
	- `crsf.js` - elements providing the CSRF tokens in different context
	- `functions.js` - various low-level JavaScript functions for processing the data
	- `icons.js` - components based on [Bootstrap Icons](https://icons.getbootstrap.com/) (like the ones in the [inventory app](https://github.com/Marta-Rudnicka/webSoakDB/blob/main/documentation/soakDB_frontend.md#icons). **TODO: make sure all the icons are moved from `src/components/Icons.js` to `src/components/reusable_components/icons.js`**
	**TODO: rename directory so something more descriptive** 

## `<Header>` 
Produces a navigation bar styled as [Bootstrap nav with tabs](https://getbootstrap.com/docs/4.0/components/navs/#tabs). `<App.js>` records which page is currently active and passes it to `<Header>` in props - based on this, the `render()` method gives the relevant tab the appropriate class (`"nav-link active"`).

