(function () {
    angular.module('ui.select')
        // See Rename minErr and make it accessible from outside https://github.com/angular/angular.js/issues/6913
        .service('uiSelectMinErr', function() {
            var minErr = angular.$$minErr('ui.select');
            return function() {
                var error = minErr.apply(this, arguments);
                var message = error.message.replace(new RegExp('\nhttp://errors.angularjs.org/.*'), '');
                return new Error(message);
            };
        })

        /**
         * Parses "repeat" attribute.
         *
         * Taken from AngularJS ngRepeat source code
         * See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L211
         *
         * Original discussion about parsing "repeat" attribute instead of fully relying on ng-repeat:
         * https://github.com/angular-ui/ui-select/commit/5dd63ad#commitcomment-5504697
         */
        .service('RepeatParser', ['uiSelectMinErr', '$parse', function(uiSelectMinErr, $parse) {
            var self = this;

            /**
             * Example:
             * expression = "address in addresses | filter: {street: $select.search} track by $index"
             * itemName = "address",
             * source = "addresses | filter: {street: $select.search}",
             * trackByExp = "$index",
             */
            self.parse = function(expression) {

                var match = expression.match(/^\s*(?:([\s\S]+?)\s+as\s+)?([\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

                if (!match) {
                    throw uiSelectMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
                        expression);
                }

                return {
                    itemName: match[2], // (lhs) Left-hand side,
                    source: $parse(match[3]),
                    trackByExp: match[4],
                    modelMapper: $parse(match[1] || match[2])
                };

            };

            self.getGroupNgRepeatExpression = function() {
                return '($group, $items) in $select.groups';
            };

            self.getNgRepeatExpression = function(itemName, source, trackByExp, grouped) {
                var expression = itemName + ' in ' + (grouped ? '$items' : source);
                if (trackByExp) {
                    expression += ' track by ' + trackByExp;
                }

                return expression;
            };
        }]);
})();