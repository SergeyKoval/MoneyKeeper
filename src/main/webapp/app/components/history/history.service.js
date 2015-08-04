(function () {
    angular
        .module('money-keeper')
        .factory('historyService', historyService);

    historyService.$inject = ['$http'];

    function historyService($http) {
        var historyJson = [{
            date: 12345657,
            amount: -5000,
            currency: "USD",
            category: "Питание",
            subCategory: "Продукты питания",
            categoryIcon: "icon.png",
            account: "Деньги",
            subAccount: "Наличные",
            comment: "Детское питание с очень длинным названием"
        }];

        return {
            getHistory: function(limit) {
                return historyJson;
            }
        };
    }
})();