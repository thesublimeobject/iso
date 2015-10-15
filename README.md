# KBD Iso
A class-based generator for differing Isotope filtering options

## Install
`npm i kbd-iso`

## Usage
```
Iso = require 'kbd-iso'
sort = new Iso
	container: 'iso'
	items: 'iso__item'
	filters: 'iso__filter'
	gutter: 16
	filterType: 'simple'

sort.init()
```

### Options
* **container**: String, ID of Isotope Container
* **items**: String, Classname of Isotope items 
* **filters**: String, Classname of Isotope filters
* **gutter**: Int, Width of desired gutter 
* **lazy**: Boolean, Lazyload Images?
* **filterType**: String; 'simple', 'dropdownFilters', 'sidebarFilters'
* **sidebarButton**: String, Classname of Sidebar Trigger
* **sidebar**: String, Classname of Sidebar for filters
* **menus**: String, Classname of dropdown menus
* **notify**: Boolean, Optional for appending "No results found" to Isotope instance when nothing is returned
* **clearFiltersButton**: String, Classname for optional button to clear all current filters