#*--------------------------------------------------------#
	# KBD DOM Utility
#*--------------------------------------------------------#

_parseInt = require 'lodash/string/parseInt'

module.exports = 

	# Find the closest parent element with class 'parent'
	closest: (el, parent) ->
		while el.nodeName isnt 'HTML'

			# Check if element has designated class
			if classie.has(el, parent)
				return el

			# Set element equal to parent element
			el = el.parentNode

	splitWidows: (els) ->
		for el in els
			do (el) ->
				if el.innerHTML.indexOf('<br>') is -1
					text = el.textContent
					words = _.words( text )
					slice = words.splice(
						Math.ceil( words.length / 2 ),
						words.length 
					)
					words.push('<br>')
					title = words.concat(slice)
					html = title.join(' ')
					el.innerHTML = html

	trailingWidows: (els) ->
		for el in els
			do (el) ->
				if el.innerHTML.indexOf('<br>') is -1 and el.innerHTML.indexOf('&nbsp') is -1
					html = el.innerHTML
					words = html.split ' '
					if words.length > 4
						words[words.length - 3] += '&nbsp;' + words[words.length - 2] + '&nbsp;' + words[words.length - 1]
						words.splice(words.length - 2, 2)
						el.innerHTML = words.join ' '

	# Find all labels and make them placeholders in input fields
	placeholder: (labels) ->
		[].forEach.call labels, (el) ->
			label = el.textContent
			labelStrip = label.replace(/:/g, '')
			el.style.display = 'none'
			input = el.parentNode.querySelector 'input'
			textarea = el.parentNode.querySelector 'textarea'
			if input?
				input.setAttribute 'placeholder', labelStrip
				return true
			else if textarea?
				textarea.setAttribute 'placeholder', labelStrip
				return true

	# Set all heights equal to width
	setHeightToWidth: (els, uniform = false, debug = false) ->
		
		# Debug?
		if debug is true
			console.log els

		# If uniform is selected then set container width to the first element's width
		containerWidth = if uniform then els[0].offsetWidth else 0

		# Loop through elements and set height
		for el in els
			do (el) ->
				if containerWidth isnt 0
					el.style.height = containerWidth + 'px'
					return true

				else
					containerWidth = el.offsetwidth
					el.style.height = containerWidth + 'px'
					return true

	# Set all elements to mirror the tallest element. Loops through children to mitigate compunding resizing height issues.
	balanceHeight: (els, addHeight = 0, max = false) ->

		upperLimit = if max isnt false then max else 9999
		maxHeight = 0

		for el in els
			do (el) ->

				# Set element height to 0
				elHeight = 0

				# Add padding from the main element
				padding = _parseInt( window.getComputedStyle(el).paddingTop, 10 ) + _parseInt( window.getComputedStyle(el).paddingBottom, 10 )
				elHeight += padding

				# Add height of children
				children = el.children
				if children?
					childrenHeight = 0
					for child in children
						do (child) ->
							if child.tagName.toLowerCase() is 'svg'
								childHeight = child.clientHeight
							else
								childHeight = child.offsetHeight
							childMargin = _parseInt( window.getComputedStyle(child).marginTop, 10 ) + _parseInt( window.getComputedStyle(child).marginBottom, 10 )
							childrenHeight += childHeight + childMargin
							return

					elHeight += childrenHeight

				# Check if elHeight is greater than the current maxHeight
				if elHeight > maxHeight
					maxHeight = elHeight
					return

				else
					return false

		# Set Height for all elements according to maxHeight
		for el in els
			do (el) ->
				if maxHeight > upperLimit
					maxHeight = upperLimit

				el.style.height = maxHeight + addHeight + 'px'
				return