/*!
 * ui-select
 * http://github.com/angular-ui/ui-select
 * Version: 0.5.4 - 2014-08-04T19:03:12.158Z
 * License: MIT
 */
(function () {
    if (angular.element.prototype.querySelectorAll === undefined) {
        angular.element.prototype.querySelectorAll = function(selector) {
            return angular.element(this[0].querySelectorAll(selector));
        };
    }

    angular.module('ui.select', [])
        .constant('uiSelectConfig', {
            theme: 'bootstrap',
            placeholder: '', // Empty by default, like HTML tag <select>
            refreshDelay: 1000 // In milliseconds
        });
})();