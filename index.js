var Iso, Isotope, _debounce, _includes, _toArray, dropdown, imagesLoaded, kbd;

Isotope = require('isotope-layout');

_includes = require('lodash/collection/includes');

_toArray = require('lodash/lang/toArray');

_debounce = require('lodash/function/debounce');

dropdown = require('kbd-dropdown');

kbd = require('./kbd');

imagesLoaded = require('imagesloaded');

Iso = (function() {
  function Iso(options) {
    var ref, ref1, ref10, ref11, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
    if (options == null) {
      options = {};
    }
    this.iso = null;
    this.isoFilters = {};
    this.container = (ref = options.container) != null ? ref : null;
    this.items = (ref1 = options.items) != null ? ref1 : null;
    this.filters = options.filterType === 'sidebarFilters' ? document.querySelectorAll('.' + options.filters + ' input') : document.getElementsByClassName(options.filters);
    this.gutter = (ref2 = options.gutter) != null ? ref2 : 0;
    this.lazy = (ref3 = options.lazy) != null ? ref3 : false;
    this.filterType = (ref4 = options.filterType) != null ? ref4 : 'simple';
    this.sidebarButton = (ref5 = document.getElementsByClassName(options.sidebarTrigger)[0]) != null ? ref5 : document.getElementsByClassName('sidebar-button')[0];
    this.sidebar = (ref6 = document.getElementsByClassName(options.sidebar)[0]) != null ? ref6 : document.getElementsByClassName('iso__sidebar')[0];
    this.menus = (ref7 = document.getElementsByClassName(options.menus)) != null ? ref7 : document.getElementsByClassName('dropdown');
    this.notify = (ref8 = options.notify) != null ? ref8 : false;
    this.clearFiltersButton = (ref9 = document.getElementsByClassName(options.clearFiltersButton)[0]) != null ? ref9 : null;
    this.sort = (ref10 = options.sort) != null ? ref10 : null;
    this.setHeightToWidth = (ref11 = options.setHeightToWidth) != null ? ref11 : false;
  }

  Iso.prototype.isoInit = function() {
    if (this.sort != null) {
      this.iso = new Isotope('#' + this.container, {
        itemSelector: '.' + this.items,
        masonry: {
          columnWidth: '.' + this.items,
          gutter: this.gutter
        },
        getSortData: {
          order: this.sort.order
        },
        sortBy: this.sort.sortBy,
        sortAscending: this.sort.sortAscending
      });
    } else {
      this.iso = new Isotope('#' + this.container, {
        itemSelector: '.' + this.items,
        masonry: {
          columnWidth: '.' + this.items,
          gutter: this.gutter
        }
      });
    }
  };

  Iso.prototype.clearFilters = function() {
    var filter, k, len, ref, results1;
    ref = this.filters;
    results1 = [];
    for (k = 0, len = ref.length; k < len; k++) {
      filter = ref[k];
      results1.push((function(filter) {
        if (classie.has(filter, 'iso__filter--active')) {
          classie.remove(filter, 'iso__filter--active');
        }
      })(filter));
    }
    return results1;
  };

  Iso.prototype.simpleFilters = function() {
    var _this, el, k, len, ref, results1;
    _this = this;
    ref = this.filters;
    results1 = [];
    for (k = 0, len = ref.length; k < len; k++) {
      el = ref[k];
      results1.push(el.addEventListener('click', function() {
        var filter;
        _this.clearFilters();
        classie.add(this, 'iso__filter--active');
        filter = this.getAttribute('data-filter');
        _this.iso.arrange({
          filter: filter
        });
        _this.iso.layout();
        _this.notifyOnEmpty();
      }));
    }
    return results1;
  };

  Iso.prototype.sidebarFilters = function() {
    var _this, filter, k, len, ref, results1;
    _this = this;
    ref = this.filters;
    results1 = [];
    for (k = 0, len = ref.length; k < len; k++) {
      filter = ref[k];
      results1.push((function(filter) {
        return filter.addEventListener('click', function() {
          var filters, fn, group, i, l, len1, permute, r, results, value;
          value = this.value;
          group = kbd.closest(this, 'sidebar__filter-group').getAttribute('data-filter-group');
          if (this.checked) {
            if (_includes(Object.keys(_this.isoFilters), group)) {
              _this.isoFilters[group].push(value);
            } else {
              _this.isoFilters[group] = [];
              _this.isoFilters[group].push(value);
            }
          } else {
            if (_this.isoFilters[group].length > 1) {
              i = _this.isoFilters[group].indexOf(value);
              _this.isoFilters[group].splice(i, 1);
            } else {
              delete _this.isoFilters[group];
            }
          }
          filters = '';
          permute = function(arrays) {
            var iterate, max, result;
            result = [];
            max = arrays.length - 1;
            iterate = function(arr, i) {
              var clone, el, j, l, len1, ref1, results2;
              ref1 = arrays[i];
              results2 = [];
              for (j = l = 0, len1 = ref1.length; l < len1; j = ++l) {
                el = ref1[j];
                clone = arr.slice(0);
                clone.push(arrays[i][j]);
                if (i === max) {
                  results2.push(result.push(clone));
                } else {
                  results2.push(iterate(clone, i + 1));
                }
              }
              return results2;
            };
            iterate([], 0);
            return result;
          };
          if (JSON.stringify(_this.isoFilters) !== '{}') {
            results = permute(_toArray(_this.isoFilters));
            fn = function(r, i) {
              if ((i + 1) === results.length) {
                return filters += r.join('');
              } else {
                return filters += r.join('') + ', ';
              }
            };
            for (i = l = 0, len1 = results.length; l < len1; i = ++l) {
              r = results[i];
              fn(r, i);
            }
          } else {
            filters = '*';
          }
          _this.iso.arrange({
            filter: filters
          });
          _this.iso.layout();
          _this.notifyOnEmpty();
        });
      })(filter));
    }
    return results1;
  };

  Iso.prototype.dropdownFilters = function() {
    var _this, filter, k, len, ref, results1;
    _this = this;
    ref = this.filters;
    results1 = [];
    for (k = 0, len = ref.length; k < len; k++) {
      filter = ref[k];
      results1.push(filter.addEventListener('click', function() {
        var filters, group, key, ref1, value;
        group = kbd.closest(this, 'iso__menu').getAttribute('data-filter-group');
        _this.isoFilters[group] = this.getAttribute('data-filter');
        filters = '';
        ref1 = _this.isoFilters;
        for (key in ref1) {
          value = ref1[key];
          filters += _this.isoFilters[key];
        }
        _this.iso.arrange({
          filter: filters
        });
        _this.iso.layout();
        _this.notifyOnEmpty();
      }));
    }
    return results1;
  };

  Iso.prototype.dropdownInit = function() {
    var k, len, menu, ref, results1;
    ref = this.menus;
    results1 = [];
    for (k = 0, len = ref.length; k < len; k++) {
      menu = ref[k];
      results1.push((function(menu) {
        var d;
        return d = new dropdown(menu).init();
      })(menu));
    }
    return results1;
  };

  Iso.prototype.lazyLoad = function() {
    var item, items, k, len, results1;
    items = document.getElementsByClassName(this.items);
    results1 = [];
    for (k = 0, len = items.length; k < len; k++) {
      item = items[k];
      results1.push((function(item) {
        var dataSrc, image;
        dataSrc = item.getAttribute('data-src');
        if (dataSrc != null) {
          image = new Image();
          image.onload = function() {
            return classie.add(image, 'loaded');
          };
          image.src = dataSrc;
          item.appendChild(image);
        }
      })(item));
    }
    return results1;
  };

  Iso.prototype.sidebarToggle = function() {
    var _this;
    _this = this;
    return this.sidebarButton.addEventListener('click', function() {
      if (!classie.has(_this.sidebar, 'nav-visible')) {
        classie.add(_this.sidebar, 'nav-visible');
      }
    });
  };

  Iso.prototype.notifyOnEmpty = function() {
    var container, notification;
    if (this.notify === true) {
      container = document.getElementById(this.container);
      notification = container.getElementsByClassName('iso--empty')[0];
      if (this.iso.filteredItems.length > 0) {
        if (notification != null) {
          container.removeChild(notification);
        }
      } else {
        if (notification == null) {
          notification = document.createElement('p');
          classie.add(notification, 'iso--empty');
          notification.textContent = 'Sorry, this filter set has returned no results. Try clearing the filters and sorting again.';
          container.appendChild(notification);
        }
      }
    }
  };

  Iso.prototype.clearFiltersTrigger = function() {
    var _this;
    _this = this;
    return this.clearFiltersButton.addEventListener('click', function(event) {
      event.preventDefault();
      _this.clearFilters();
    });
  };

  Iso.prototype.init = function() {
    var _this, isoLoad;
    _this = this;
    this.isoInit();
    if (this.filterType === 'simple') {
      this.simpleFilters();
    }
    if (this.filterType === 'sidebarFilters') {
      this.sidebarFilters();
      this.sidebarToggle();
    }
    if (this.filterType === 'dropdownFilters') {
      this.dropdownInit();
      this.dropdownFilters();
    }
    if (this.lazy === true) {
      this.lazyLoad();
    }
    isoLoad = imagesLoaded('#' + this.container);
    isoLoad.on('progress', function() {
      if (_this.setHeightToWidth != null) {
        kbd.setHeightToWidth(document.getElementsByClassName(_this.items), true);
      }
      return _this.iso.layout();
    });
    if (this.clearFiltersButton != null) {
      this.clearFiltersTrigger();
    }
    return window.addEventListener('resize', _debounce(function() {
      return kbd.setHeightToWidth(document.getElementsByClassName(_this.items), true);
    }, 150));
  };

  return Iso;

})();

module.exports = Iso;
