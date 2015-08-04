(function () {
    angular
        .module('mk-config')
        .controller('configController', ConfigController);

    ConfigController.$inject = ['CONFIG', '$location'];

    function ConfigController(CONFIG, $location) {
        var vm = this;

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
        }
    }
})();