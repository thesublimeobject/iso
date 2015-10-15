var _parseInt;

_parseInt = require('lodash/string/parseInt');

module.exports = {
  closest: function(el, parent) {
    while (el.nodeName !== 'HTML') {
      if (classie.has(el, parent)) {
        return el;
      }
      el = el.parentNode;
    }
  },
  splitWidows: function(els) {
    var el, i, len, results;
    results = [];
    for (i = 0, len = els.length; i < len; i++) {
      el = els[i];
      results.push((function(el) {
        var html, slice, text, title, words;
        if (el.innerHTML.indexOf('<br>') === -1) {
          text = el.textContent;
          words = _.words(text);
          slice = words.splice(Math.ceil(words.length / 2), words.length);
          words.push('<br>');
          title = words.concat(slice);
          html = title.join(' ');
          return el.innerHTML = html;
        }
      })(el));
    }
    return results;
  },
  trailingWidows: function(els) {
    var el, i, len, results;
    results = [];
    for (i = 0, len = els.length; i < len; i++) {
      el = els[i];
      results.push((function(el) {
        var html, words;
        if (el.innerHTML.indexOf('<br>') === -1 && el.innerHTML.indexOf('&nbsp') === -1) {
          html = el.innerHTML;
          words = html.split(' ');
          if (words.length > 4) {
            words[words.length - 3] += '&nbsp;' + words[words.length - 2] + '&nbsp;' + words[words.length - 1];
            words.splice(words.length - 2, 2);
            return el.innerHTML = words.join(' ');
          }
        }
      })(el));
    }
    return results;
  },
  placeholder: function(labels) {
    return [].forEach.call(labels, function(el) {
      var input, label, labelStrip, textarea;
      label = el.textContent;
      labelStrip = label.replace(/:/g, '');
      el.style.display = 'none';
      input = el.parentNode.querySelector('input');
      textarea = el.parentNode.querySelector('textarea');
      if (input != null) {
        input.setAttribute('placeholder', labelStrip);
        return true;
      } else if (textarea != null) {
        textarea.setAttribute('placeholder', labelStrip);
        return true;
      }
    });
  },
  setHeightToWidth: function(els, uniform, debug) {
    var containerWidth, el, i, len, results;
    if (uniform == null) {
      uniform = false;
    }
    if (debug == null) {
      debug = false;
    }
    if (debug === true) {
      console.log(els);
    }
    containerWidth = uniform ? els[0].offsetWidth : 0;
    results = [];
    for (i = 0, len = els.length; i < len; i++) {
      el = els[i];
      results.push((function(el) {
        if (containerWidth !== 0) {
          el.style.height = containerWidth + 'px';
          return true;
        } else {
          containerWidth = el.offsetwidth;
          el.style.height = containerWidth + 'px';
          return true;
        }
      })(el));
    }
    return results;
  },
  balanceHeight: function(els, addHeight, max) {
    var el, fn, i, j, len, len1, maxHeight, results, upperLimit;
    if (addHeight == null) {
      addHeight = 0;
    }
    if (max == null) {
      max = false;
    }
    upperLimit = max !== false ? max : 9999;
    maxHeight = 0;
    fn = function(el) {
      var child, children, childrenHeight, elHeight, fn1, j, len1, padding;
      elHeight = 0;
      padding = _parseInt(window.getComputedStyle(el).paddingTop, 10) + _parseInt(window.getComputedStyle(el).paddingBottom, 10);
      elHeight += padding;
      children = el.children;
      if (children != null) {
        childrenHeight = 0;
        fn1 = function(child) {
          var childHeight, childMargin;
          if (child.tagName.toLowerCase() === 'svg') {
            childHeight = child.clientHeight;
          } else {
            childHeight = child.offsetHeight;
          }
          childMargin = _parseInt(window.getComputedStyle(child).marginTop, 10) + _parseInt(window.getComputedStyle(child).marginBottom, 10);
          childrenHeight += childHeight + childMargin;
        };
        for (j = 0, len1 = children.length; j < len1; j++) {
          child = children[j];
          fn1(child);
        }
        elHeight += childrenHeight;
      }
      if (elHeight > maxHeight) {
        maxHeight = elHeight;
      } else {
        return false;
      }
    };
    for (i = 0, len = els.length; i < len; i++) {
      el = els[i];
      fn(el);
    }
    results = [];
    for (j = 0, len1 = els.length; j < len1; j++) {
      el = els[j];
      results.push((function(el) {
        if (maxHeight > upperLimit) {
          maxHeight = upperLimit;
        }
        el.style.height = maxHeight + addHeight + 'px';
      })(el));
    }
    return results;
  }
};
