(function () {
    angular.module('ui.select')
        .directive('uiSelect', ['$document', 'uiSelectConfig', 'uiSelectMinErr', '$compile', '$parse',
            function($document, uiSelectConfig, uiSelectMinErr, $compile, $parse) {

                return {
                    restrict: 'EA',
                    templateUrl: function(tElement, tAttrs) {
                        var theme = tAttrs.theme || uiSelectConfig.theme;
                        return 'select.html';
                    },
                    replace: true,
                    transclude: true,
                    require: ['uiSelect', 'ngModel'],
                    scope: true,

                    controller: 'uiSelectCtrl',
                    controllerAs: '$select',

                    link: function(scope, element, attrs, ctrls, transcludeFn) {
                        var $select = ctrls[0];
                        var ngModel = ctrls[1];

                        $select.tree = $parse(attrs.items)(scope);
                        $select.initItemsForLevel(0);
                        $select.onSelectCallback = $parse(attrs.onSelect);

                        //From view --> model
                        ngModel.$parsers.unshift(function(inputValue) {
                            var locals = {};
                            locals[$select.parserResult.itemName] = inputValue;
                            var result = $select.parserResult.modelMapper(scope, locals);
                            return result;
                        });

                        //From model --> view
                        ngModel.$formatters.unshift(function(inputValue) {
                            var data = $select.parserResult.source(scope);
                            if (data) {
                                for (var i = data.length - 1; i >= 0; i--) {
                                    var locals = {};
                                    locals[$select.parserResult.itemName] = data[i];
                                    var result = $select.parserResult.modelMapper(scope, locals);
                                    if (result == inputValue) {
                                        return data[i];
                                    }
                                }
                            }
                            return inputValue;
                        });

                        //Set reference to ngModel from uiSelectCtrl
                        $select.ngModel = ngModel;

                        //Idea from: https://github.com/ivaynberg/select2/blob/79b5bf6db918d7560bdd959109b7bcfb47edaf43/select2.js#L1954
                        var focusser = angular.element("<input ng-disabled='$select.disabled' class='ui-select-focusser ui-select-offscreen' type='text' aria-haspopup='true' role='button' />");
                        $compile(focusser)(scope);
                        $select.focusser = focusser;

                        element.append(focusser);
                        focusser.bind("focus", function() {
                            scope.$evalAsync(function() {
                                $select.focus = true;
                            });
                        });
                        focusser.bind("blur", function() {
                            scope.$evalAsync(function() {
                                $select.focus = false;
                            });
                        });
                        focusser.bind("keydown", function(e) {

                            if (e.which === KEY.BACKSPACE) {
                                e.preventDefault();
                                e.stopPropagation();
                                $select.select(undefined);
                                scope.$digest();
                                return;
                            }

                            if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                                return;
                            }

                            if (e.which == KEY.DOWN || e.which == KEY.UP || e.which == KEY.ENTER || e.which == KEY.SPACE) {
                                e.preventDefault();
                                e.stopPropagation();
                                $select.activate();
                            }

                            scope.$digest();
                        });

                        focusser.bind("keyup input", function(e) {

                            if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || e.which == KEY.ENTER || e.which === KEY.BACKSPACE) {
                                return;
                            }

                            $select.activate(focusser.val()); //User pressed some regualar key, so we pass it to the search input
                            focusser.val('');
                            scope.$digest();

                        });

                        //TODO Refactor to reuse the KEY object from uiSelectCtrl
                        var KEY = {
                            TAB: 9,
                            ENTER: 13,
                            ESC: 27,
                            SPACE: 32,
                            LEFT: 37,
                            UP: 38,
                            RIGHT: 39,
                            DOWN: 40,
                            SHIFT: 16,
                            CTRL: 17,
                            ALT: 18,
                            PAGE_UP: 33,
                            PAGE_DOWN: 34,
                            HOME: 36,
                            END: 35,
                            BACKSPACE: 8,
                            DELETE: 46,
                            isArrow: function(k) {
                                k = k.which ? k.which : k;
                                switch (k) {
                                    case KEY.LEFT:
                                    case KEY.RIGHT:
                                    case KEY.UP:
                                    case KEY.DOWN:
                                        return true;
                                }
                                return false;
                            },
                            isControl: function(e) {
                                var k = e.which;
                                switch (k) {
                                    case KEY.SHIFT:
                                    case KEY.CTRL:
                                    case KEY.ALT:
                                        return true;
                                }

                                if (e.metaKey) return true;

                                return false;
                            },
                            isFunctionKey: function(k) {
                                k = k.which ? k.which : k;
                                return k >= 112 && k <= 123;
                            }
                        };

                        attrs.$observe('disabled', function() {
                            // No need to use $eval() (thanks to ng-disabled) since we already get a boolean instead of a string
                            $select.disabled = attrs.disabled !== undefined ? attrs.disabled : false;
                        });

                        attrs.$observe('resetSearchInput', function() {
                            // $eval() is needed otherwise we get a string instead of a boolean
                            var resetSearchInput = scope.$eval(attrs.resetSearchInput);
                            $select.resetSearchInput = resetSearchInput !== undefined ? resetSearchInput : true;
                        });

                        scope.$watch('$select.selected', function(newValue) {
                            if (ngModel.$viewValue !== newValue) {
                                ngModel.$setViewValue(newValue);
                            }
                        });

                        ngModel.$render = function() {
                            $select.selected = ngModel.$viewValue;
                        };

                        function onDocumentClick(e) {
                            var contains = false;

                            if (window.jQuery) {
                                // Firefox 3.6 does not support element.contains()
                                // See Node.contains https://developer.mozilla.org/en-US/docs/Web/API/Node.contains
                                contains = window.jQuery.contains(element[0], e.target);
                            } else {
                                contains = element[0].contains(e.target);
                            }

                            if (!contains) {
                                $select.close();
                                scope.$digest();
                            }
                        }

                        // See Click everywhere but here event http://stackoverflow.com/questions/12931369
                        $document.on('click', onDocumentClick);

                        scope.$on('$destroy', function() {
                            $document.off('click', onDocumentClick);
                        });

                        // Move transcluded elements to their correct position in main template
                        transcludeFn(scope, function(clone) {
                            // See Transclude in AngularJS http://blog.omkarpatil.com/2012/11/transclude-in-angularjs.html

                            // One day jqLite will be replaced by jQuery and we will be able to write:
                            // var transcludedElement = clone.filter('.my-class')
                            // instead of creating a hackish DOM element:
                            var transcluded = angular.element('<div>').append(clone);

                            var transcludedMatch = transcluded.querySelectorAll('.ui-select-match');
                            transcludedMatch.removeAttr('ui-select-match'); //To avoid loop in case directive as attr
                            if (transcludedMatch.length !== 1) {
                                throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-match but got '{0}'.", transcludedMatch.length);
                            }
                            element.querySelectorAll('.ui-select-match').replaceWith(transcludedMatch);

                            var transcludedChoices = transcluded.querySelectorAll('.ui-select-choices');
                            transcludedChoices.removeAttr('ui-select-choices'); //To avoid loop in case directive as attr
                            if (transcludedChoices.length !== 1) {
                                throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-choices but got '{0}'.", transcludedChoices.length);
                            }
                            element.querySelectorAll('.ui-select-choices').replaceWith(transcludedChoices);
                        });
                    }
                };
            }
        ])

        .directive('uiSelectChoices', ['uiSelectConfig', 'RepeatParser', 'uiSelectMinErr', '$compile',
            function(uiSelectConfig, RepeatParser, uiSelectMinErr, $compile) {

                return {
                    restrict: 'EA',
                    require: '^uiSelect',
                    replace: true,
                    transclude: true,
                    templateUrl: function(tElement) {
                        // Gets theme attribute from parent (ui-select)
                        var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
                        return 'choices.html';
                    },

                    link: function (scope, element, attrs, $select, transcludeFn) {
                        attrs.$observe('breadcrumbs', function(val) {
                            scope.breadcrumbs = scope.$eval(val);
                        });
                        scope.goBack = scope.$eval(attrs.onClick);

                        // var repeat = RepeatParser.parse(attrs.repeat);
                        var groupByExp = attrs.groupBy;

                        //$select.parseRepeatAttr(groupByExp); //Result ready at $select.parserResult

                        if (groupByExp) {
                            var groups = element.querySelectorAll('.ui-select-choices-group');
                            if (groups.length !== 1) throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-group but got '{0}'.", groups.length);
                            groups.attr('ng-repeat', RepeatParser.getGroupNgRepeatExpression());
                        }

                        var choices = element.querySelectorAll('.ui-select-choices-row');
                        if (choices.length !== 1) {
                            throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-row but got '{0}'.", choices.length);
                        }

                        choices.attr('ng-repeat', RepeatParser.getNgRepeatExpression($select.parserResult.itemName, '$select.items', $select.parserResult.trackByExp, groupByExp))
                            .attr('ng-mouseenter', '$select.setActiveItem(' + $select.parserResult.itemName + ')')
                            .attr('ng-click', '$select.select(' + $select.parserResult.itemName + ')');

                        transcludeFn(function(clone) {

                            var rowsInner = element.querySelectorAll('.ui-select-choices-row-inner');
                            if (rowsInner.length !== 1)
                                throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-row-inner but got '{0}'.", rowsInner.length);
                            rowsInner.append(clone);
                            $compile(element)(scope);
                        });

                        scope.$watch('$select.search', function() {
                            $select.filterItems();
                            $select.activeIndex = 0;
                            $select.refresh(attrs.refresh);
                        });

                        attrs.$observe('refreshDelay', function() {
                            // $eval() is needed otherwise we get a string instead of a number
                            var refreshDelay = scope.$eval(attrs.refreshDelay);
                            $select.refreshDelay = refreshDelay !== undefined ? refreshDelay : uiSelectConfig.refreshDelay;
                        });
                    }
                };
            }
        ])

        .directive('uiSelectMatch', ['uiSelectConfig', function(uiSelectConfig) {
            return {
                restrict: 'EA',
                require: '^uiSelect',
                replace: true,
                transclude: true,
                templateUrl: function(tElement) {
                    // Gets theme attribute from parent (ui-select)
                    var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
                    return 'match.html';
                },
                link: function(scope, element, attrs, $select) {
                    attrs.$observe('placeholder', function(placeholder) {
                        $select.placeholder = placeholder !== undefined ? placeholder : uiSelectConfig.placeholder;
                    });
                }
            };
        }]);
})();