(function () {
    angular
        .module('money-keeper')
        .factory('historyService', historyService);

    historyService.$inject = ['$http', '$filter'];

    function historyService(http, filter) {
        var historyJson = [{
            date: 1288323624006,
            amount: -5600,
            currency: "USD",
            category: "Питание",
            subCategory: "Продукты питания",
            categoryIcon: "home.gif",
            account: "Деньги",
            subAccount: "Наличные",
            comment: "Детское питание с очень длинным названием"
        },
        {
            date: 1288323623006,
            amount: 5600,
            currency: "USD",
            category: "Питание",
            subCategory: "Продукты питания",
            categoryIcon: "home.gif",
            account: "Деньги",
            subAccount: "Наличные",
            comment: "Детское питание"
        },
        {
            date: 1288214623006,
            amount: -5600,
            currency: "USD",
            category: "Питание",
            subCategory: "Продукты питания",
            categoryIcon: "home.gif",
            account: "Деньги",
            subAccount: "Наличные",
            comment: "Детское питание"
        }];

        return {
            getHistory: function(limit) {
                return this.groupByDay(historyJson);
            },

            groupByDay: function(historyItems) {
                var groupedHistory = {};
                angular.forEach(historyItems, function(historyItem) {
                    var date = filter('date')(historyItem.date, 'dd.MM.yyyy');
                    if (groupedHistory[date]) {
                        groupedHistory[date].push(historyItem);
                    } else {
                        groupedHistory[date] = [historyItem];
                    }
                });

                return groupedHistory;
            }
        };
    }
})();