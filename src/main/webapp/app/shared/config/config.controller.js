(function () {
    angular
        .module('mk-config')
        .controller('configController', ConfigController);

    ConfigController.$inject = ['CONFIG', '$location', '$rootScope', 'alertService'];

    function ConfigController(CONFIG, $location, rootScope, alertService) {
        var vm = this;

        rootScope.closeAlert = alertService.closeAlert;

        vm.getCurrencySymbol = function (currencyIdentifier) {
            return CONFIG.CURRENCIES[currencyIdentifier];
        };

        vm.currencySorting = function (accountSum) {
            var index = 0;
            for (var currency in CONFIG.CURRENCIES) {
                if (currency === accountSum.currency) {
                    break;
                }
                index++;
            }
            return index;
        };

        vm.formatCurrencyValue = function (currencyValue) {
            return currencyValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
        };

        vm.formatPositiveCurrencyValue = function (currencyValue) {
            if (!this.isAmountPositive(currencyValue)) {
                currencyValue = currencyValue * -1;
            }
            return this.formatCurrencyValue(currencyValue);
        };
        
        vm.isMenuItemActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        vm.isAmountPositive = function (amount) {
            return amount > 0;
        };
    }
})();