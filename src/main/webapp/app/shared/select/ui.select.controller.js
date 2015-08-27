(function () {
    angular.module('ui.select')
        /**
         * Contains ui-select "intelligence".
         *
         * The goal is to limit dependency on the DOM whenever possible and
         * put as much logic in the controller (instead of the link functions) as possible so it can be easily tested.
         */
        .controller('uiSelectCtrl', ['$scope', '$element', '$timeout', 'RepeatParser', 'uiSelectMinErr',
            function($scope, $element, $timeout, RepeatParser, uiSelectMinErr) {

                var ctrl = this;

                var EMPTY_SEARCH = '';

                ctrl.breadCrumbs = [{
                    "id": 0,
                    "title": "All"
                }];

                ctrl.placeholder = undefined;
                ctrl.search = EMPTY_SEARCH;
                ctrl.activeIndex = 0;
                ctrl.items = [];
                ctrl.levelId = undefined;
                ctrl.selected = undefined;
                ctrl.open = false;
                ctrl.focus = false;
                ctrl.focusser = undefined; //Reference to input element used to handle focus events
                ctrl.disabled = undefined; // Initialized inside uiSelect directive link function
                ctrl.resetSearchInput = undefined; // Initialized inside uiSelect directive link function
                ctrl.refreshDelay = undefined; // Initialized inside uiSelectChoices directive link function
                ctrl.itemProperty = 'item';
                ctrl.parserResult = RepeatParser.parse('item in $select.items | filter: $select.search');

                ctrl.isEmpty = function() {
                    return angular.isUndefined(ctrl.selected) || ctrl.selected === null || ctrl.selected === '';
                };

                var _searchInput = $element.querySelectorAll('input.ui-select-search');
                if (_searchInput.length !== 1) {
                    throw uiSelectMinErr('searchInput', "Expected 1 input.ui-select-search but got '{0}'.", _searchInput.length);
                }

                // Most of the time the user does not want to empty the search input when in typeahead mode
                function _resetSearchInput() {
                    if (ctrl.resetSearchInput) {
                        ctrl.search = EMPTY_SEARCH;
                        //reset activeIndex
                        if (ctrl.selected && ctrl.items.length) {
                            ctrl.activeIndex = ctrl.items.indexOf(ctrl.selected);
                        }
                    }
                }

                ctrl.initItemsForLevel = function(item, e) {
                    if (e !== undefined) {
                        e.stopPropagation();
                    }
                    if (item.id) {
                        ctrl.items = ctrl.tree[item.id];
                        ctrl.breadCrumbs.push(item);
                        ctrl.levelId = item.id;
                    } else {
                        ctrl.items = ctrl.tree[item];
                        ctrl.levelId = item;
                    }
                };

                ctrl.breadCrumbBackTo = function(crumb, e) {
                    for (var index = 0;index < ctrl.breadCrumbs.length; index++) {
                        if (ctrl.breadCrumbs[index].id == crumb.id) {
                            break;
                        }
                    }

                    ctrl.breadCrumbs.splice(index + 1, ctrl.breadCrumbs.length);
                    ctrl.initItemsForLevel(ctrl.breadCrumbs[ctrl.breadCrumbs.length -1].id, e);
                };

                // When the user clicks on ui-select, displays the dropdown list
                ctrl.activate = function(initSearchValue) {
                    if (!ctrl.disabled) {
                        _resetSearchInput();
                        ctrl.open = true;

                        // Give it time to appear before focus
                        $timeout(function() {
                            ctrl.search = initSearchValue || ctrl.search;
                            _searchInput[0].focus();
                        });
                    }
                };

                ctrl.parseRepeatAttr = function(groupByExp) {
                    function updateGroups(items) {
                        ctrl.groups = {};
                        angular.forEach(items, function(item) {
                            var groupFn = $scope.$eval(groupByExp);
                            var groupValue = angular.isFunction(groupFn) ? groupFn(item) : item[groupFn];
                            if (!ctrl.groups[groupValue]) {
                                ctrl.groups[groupValue] = [item];
                            } else {
                                ctrl.groups[groupValue].push(item);
                            }
                        });
                        ctrl.items = [];
                        angular.forEach(Object.keys(ctrl.groups).sort(), function(group) {
                            ctrl.items = ctrl.items.concat(ctrl.groups[group]);
                        });
                    }

                    function setPlainItems(items) {
                        ctrl.items = items;
                    }

                    var setItemsFn = groupByExp ? updateGroups : setPlainItems;
                    ctrl.isGrouped = !!groupByExp;

                     //See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L259
                    $scope.$watchCollection(ctrl.parserResult.source, function(items) {

                        if (items === undefined || items === null) {
                            // If the user specifies undefined or null => reset the collection
                            // Special case: items can be undefined if the user did not initialized the collection on the scope
                            // i.e $scope.addresses = [] is missing
                            ctrl.items = [];
                        } else {
                            if (!angular.isArray(items)) {
                                throw uiSelectMinErr('items', "Expected an array but got '{0}'.", items);
                            } else {
                                // Regular case
                                setItemsFn(items);
                                ctrl.ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters

                            }
                        }

                    });

                };

                var _refreshDelayPromise;

                /**
                 * Typeahead mode: lets the user refresh the collection using his own function.
                 *
                 * See Expose $select.search for external / remote filtering https://github.com/angular-ui/ui-select/pull/31
                 */
                ctrl.refresh = function(refreshAttr) {
                    if (refreshAttr !== undefined) {

                        // Debounce
                        // See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L155
                        // FYI AngularStrap typeahead does not have debouncing: https://github.com/mgcrea/angular-strap/blob/v2.0.0-rc.4/src/typeahead/typeahead.js#L177
                        if (_refreshDelayPromise) {
                            $timeout.cancel(_refreshDelayPromise);
                        }
                        _refreshDelayPromise = $timeout(function() {
                            $scope.$eval(refreshAttr);
                        }, ctrl.refreshDelay);
                    }
                };

                ctrl.setActiveItem = function(item) {
                    ctrl.activeIndex = ctrl.items.indexOf(item);
                };

                ctrl.isActive = function(itemScope) {
                    return ctrl.items.indexOf(itemScope[ctrl.itemProperty]) === ctrl.activeIndex;
                };

                // When the user clicks on an item inside the dropdown
                ctrl.select = function(item, event) {
                    if (item.parent) {
                        ctrl.initItemsForLevel(item, event);
                    } else {
                        var locals = {};
                        locals[ctrl.parserResult.itemName] = item;

                        ctrl.onSelectCallback($scope, {
                            $item: item,
                            $model: ctrl.parserResult.modelMapper($scope, locals)
                        });

                        ctrl.selected = item;
                        ctrl.close();
                        // Using a watch instead of $scope.ngModel.$setViewValue(item)
                    }
                };

                // Closes the dropdown
                ctrl.close = function() {
                    if (ctrl.open) {
                        _resetSearchInput();
                        ctrl.open = false;
                        $timeout(function() {
                            ctrl.focusser[0].focus();
                        }, 0, false);
                    }
                };

                var Key = {
                    Enter: 13,
                    Tab: 9,
                    Up: 38,
                    Down: 40,
                    Escape: 27
                };

                function _onKeydown(key) {
                    var processed = true;
                    switch (key) {
                        case Key.Down:
                            if (ctrl.activeIndex < ctrl.items.length - 1) {
                                ctrl.activeIndex++;
                            }
                            break;
                        case Key.Up:
                            if (ctrl.activeIndex > 0) {
                                ctrl.activeIndex--;
                            }
                            break;
                        case Key.Tab:
                        case Key.Enter:
                            ctrl.select(ctrl.items[ctrl.activeIndex]);
                            break;
                        case Key.Escape:
                            ctrl.close();
                            break;
                        default:
                            processed = false;
                    }
                    return processed;
                }

                // Bind to keyboard shortcuts
                _searchInput.on('keydown', function(e) {
                    // Keyboard shortcuts are all about the items,
                    // does not make sense (and will crash) if ctrl.items is empty
                    if (ctrl.items && ctrl.items.length >= 0) {
                        var key = e.which;

                        $scope.$apply(function() {
                            var processed = _onKeydown(key);
                            if (processed && key != Key.Tab) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        });

                        switch (key) {
                            case Key.Down:
                            case Key.Up:
                                _ensureHighlightVisible();
                                break;
                        }
                    }
                });

                // See https://github.com/ivaynberg/select2/blob/3.4.6/select2.js#L1431
                function _ensureHighlightVisible() {
                    var container = $element.querySelectorAll('.ui-select-choices-content');
                    var choices = container.querySelectorAll('.ui-select-choices-row');
                    if (choices.length < 1) {
                        throw uiSelectMinErr('choices', "Expected multiple .ui-select-choices-row but got '{0}'.", choices.length);
                    }

                    var highlighted = choices[ctrl.activeIndex];
                    var posY = highlighted.offsetTop + highlighted.clientHeight - container[0].scrollTop;
                    var height = container[0].offsetHeight;

                    if (posY > height) {
                        container[0].scrollTop += posY - height;
                    } else if (posY < highlighted.clientHeight) {
                        if (ctrl.isGrouped && ctrl.activeIndex === 0)
                            container[0].scrollTop = 0; //To make group header visible when going all the way up
                        else
                            container[0].scrollTop -= highlighted.clientHeight - posY;
                    }
                }

                $scope.$on('$destroy', function() {
                    _searchInput.off('keydown');
                });
            }
        ]);
})();