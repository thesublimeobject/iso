#*--------------------------------------------------------*#
	# KBD Iso
#*--------------------------------------------------------*#

Isotope = require 'isotope-layout'
_includes = require 'lodash/collection/includes'
_toArray = require 'lodash/lang/toArray'
_debounce = require 'lodash/function/debounce'
dropdown = require 'kbd-dropdown'
kbd = require './kbd'
imagesLoaded = require 'imagesloaded'

class Iso

	# Set all options
	constructor: (options = {}) ->
		@iso = null
		@isoFilters = {}
		@container = options.container ? null
		@items = options.items ? null
		@filters = if options.filterType is 'sidebarFilters' then document.querySelectorAll('.' + options.filters + ' input') else document.getElementsByClassName(options.filters)
		@gutter = options.gutter ? 0
		@lazy = options.lazy ? false
		@filterType = options.filterType ? 'simple'
		@sidebarButton = document.getElementsByClassName(options.sidebarTrigger)[0] ? document.getElementsByClassName('sidebar-button')[0]
		@sidebar = document.getElementsByClassName(options.sidebar)[0] ? document.getElementsByClassName('iso__sidebar')[0]
		@menus = document.getElementsByClassName(options.menus) ? document.getElementsByClassName('dropdown')
		@notify = options.notify ? false
		@clearFiltersButton = document.getElementsByClassName(options.clearFiltersButton)[0] ? null
		@sort = options.sort ? null
		@setHeightToWidth = options.setHeightToWidth ? false

	# Initialize Isotope instance
	isoInit: ->
		if @sort?
			@iso = new Isotope '#' + @container,
				itemSelector: '.' + @items
				masonry:
					columnWidth: '.' + @items
					gutter: @gutter
				getSortData:
					order: @sort.order
				sortBy: @sort.sortBy
				sortAscending: @sort.sortAscending
			return

		else
			@iso = new Isotope '#' + @container,
				itemSelector: '.' + @items
				masonry:
					columnWidth: '.' + @items
					gutter: @gutter
			return

	# Clears active filter on @filters
	clearFilters: ->
		for filter in @filters
			do (filter) ->
				if classie.has(filter, 'iso__filter--active')
					classie.remove(filter, 'iso__filter--active')
					return

	# Sets simple (one-layer) Isotope filters
	simpleFilters: ->
		_this = @
		for el in @filters
			el.addEventListener 'click', ->

				# Add active filter class
				_this.clearFilters()
				classie.add(@, 'iso__filter--active')

				# Get the filter
				filter = @.getAttribute 'data-filter'

				# Run the filter
				_this.iso.arrange
					filter: filter
				_this.iso.layout()

				# If necessary, notify user
				_this.notifyOnEmpty()
				return

	# Sets sidebar Isotope filters
	sidebarFilters: ->
		_this = @

		# Filters for Portfolio Nav
		for filter in @filters
			do (filter) ->
				filter.addEventListener 'click', ->

					# Get value
					value = @.value

					# Fetch the group filter accordingly
					group = kbd.closest(@, 'sidebar__filter-group').getAttribute 'data-filter-group'

					if @.checked

						# If the object already has a value for that group, add it to the existing array
						if _includes( Object.keys(_this.isoFilters), group )
							_this.isoFilters[ group ].push( value )

						# If the group does not yet exist, init an empty array and add it to the array
						else 
							_this.isoFilters[ group ] = []
							_this.isoFilters[ group ].push( value )

					else

						# If the group has multiple values, find the value and remove it from the array
						if _this.isoFilters[ group ].length > 1
							i = _this.isoFilters[ group ].indexOf( value )
							_this.isoFilters[ group ].splice(i, 1)

						# If the group only has one value, just delete the group altogether
						else
							delete _this.isoFilters[ group ]


					# Set an empty filter string
					filters = ''

					# Concat all values of filters to string
					permute = (arrays) ->
						result = []
						max = arrays.length - 1

						# Iterate through arrays until last array is reached
						iterate = ( arr, i ) ->
							for el, j in arrays[i]

								# Clone the incoming array
								clone = arr.slice(0)

								# Push each element onto the clone
								clone.push( arrays[i][j] )

								# Recusively call the iteration until all arrays have been iterated
								if i is max then result.push( clone ) else iterate( clone, i + 1 )

						iterate( [], 0 )
						return result

					# Check if filters object is empty
					if JSON.stringify( _this.isoFilters ) isnt '{}'

						# Run permutation on the object converted to an array
						results = permute( _toArray( _this.isoFilters ) )

						# For each array in results, join into a selector string
						for r, i in results
							do (r, i) ->
								if (i + 1) is results.length
									filters += r.join('')
								else
									# Add a comma after each selector string unless it's the last string
									filters += r.join('') + ', '

					# If it is empty, set the filters to all
					else
						filters = '*'

					# Run the filter
					_this.iso.arrange
						filter: filters
					_this.iso.layout()

					# If necessary, notify user
					_this.notifyOnEmpty()
					return

	# Sets dropdown Isotope Filters
	dropdownFilters: ->
		_this = @
		for filter in @filters
			filter.addEventListener 'click', ->

				# Fetch the group filter accordingly
				group = kbd.closest(@, 'iso__menu').getAttribute 'data-filter-group'

				# Get the filter and add it to the object
				_this.isoFilters[ group ] = @.getAttribute 'data-filter'
				filters = ''
				for key, value of _this.isoFilters
					filters += _this.isoFilters[ key ]

				# Run the filter
				_this.iso.arrange
					filter: filters
				_this.iso.layout()

				# If necessary, notify user
				_this.notifyOnEmpty()
				return

	# Add dropdowns
	dropdownInit: ->
		for menu in @menus
			do (menu) ->
				d = new dropdown(menu).init()

	# Option to lazy load images
	lazyLoad: ->
		items = document.getElementsByClassName(@items)
		for item in items
			do (item) ->
				dataSrc = item.getAttribute 'data-src'
				if dataSrc?
					image = new Image()
					image.onload = ->
						classie.add(image, 'loaded')
				
					image.src = dataSrc
					item.appendChild(image)
					return

	# Trigger Sidebar
	sidebarToggle: ->
		_this = @
		@sidebarButton.addEventListener 'click', ->
			if !classie.has(_this.sidebar, 'nav-visible')
				classie.add(_this.sidebar, 'nav-visible')
				return

	# Optionally notify user if no results are returned
	notifyOnEmpty: ->
		if @notify is true

			# Define container as DOM Node
			container = document.getElementById(@container)
			notification = container.getElementsByClassName('iso--empty')[0]

			# If no elements are returned, notify user
			if @iso.filteredItems.length > 0

				# Remove notification if present
				if notification?
					container.removeChild(notification)

				return

			else

				# Only add notification if not already present
				if not notification?

					# Create notification node
					notification = document.createElement 'p'
					classie.add(notification, 'iso--empty')
					notification.textContent = 'Sorry, this filter set has returned no results. Try clearing the filters and sorting again.'

					# Append notification
					container.appendChild(notification)

					return

	# Clear filters on click
	clearFiltersTrigger: ->
		_this = @
		@clearFiltersButton.addEventListener 'click', (event) ->
			event.preventDefault()
			_this.clearFilters()
			return

	# Init
	init: ->
		_this = @

		# Init Main
		@isoInit()

		# Init filters based on sort-type
		if @filterType is 'simple'
			@simpleFilters()
		
		if @filterType is 'sidebarFilters'
			@sidebarFilters()
			@sidebarToggle()

		if @filterType is 'dropdownFilters'
			@dropdownInit()
			@dropdownFilters()

		# Lazy
		if @lazy is true
			@lazyLoad()

		# Re-layout
		isoLoad = imagesLoaded( '#' + @container )
		isoLoad.on 'progress', ->
			if _this.setHeightToWidth?
				kbd.setHeightToWidth( document.getElementsByClassName(_this.items), true )

			_this.iso.layout()

		# Clear Filters Button
		if @clearFiltersButton?
			@clearFiltersTrigger()

		# Resize, obvi
		window.addEventListener 'resize', _debounce ->
			kbd.setHeightToWidth( document.getElementsByClassName(_this.items), true )
		, 150

module.exports = Iso