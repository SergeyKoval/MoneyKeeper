(function () {
    angular
        .module('money-keeper')
        .factory('summaryService', summaryService);

    summaryService.$inject = ['$http'];

    function summaryService($http) {
        var summaryJson = [{
            accountName : 'Деньги',
            accountExpand : false,
            subAccounts : [{
                subAccountName : 'Наличные',
                subAccountCurrencies : [
                {
                    currency: 'EUR',
                    currencyValue: 25.38
                },
                {
                    currency: 'BR',
                    currencyValue: 12365000
                },
                {
                    currency: 'USD',
                    currencyValue: 5325.8
                }]
            },
            {
                subAccountName : 'Резерв',
                subAccountCurrencies : [
                {
                    currency : 'USD',
                    currencyValue : 11.25
                },
                {
                    currency : 'EUR',
                    currencyValue : 18.8
                }]
            }]
        },
        {
            accountName : 'Сбережения',
            accountExpand : true,
            subAccounts : [{
                subAccountName : 'Наличные',
                subAccountCurrencies : [{
                    currency : 'BR',
                    currencyValue : 125968000
                }]
            }]
        }];

        return {
            getSummary: function() {
                return this.calculateAccountSums(summaryJson);
            },

            calculateAccountSums: function (summaries) {
                angular.forEach(summaries, function(summary) {
                    var accountSums = {};
                    angular.forEach(summary.subAccounts, function(subAccount) {
                        angular.forEach(subAccount.subAccountCurrencies, function(subAccountCurrency) {
                            if (accountSums[subAccountCurrency.currency]) {
                                accountSums[subAccountCurrency.currency] += subAccountCurrency.currencyValue;
                            } else {
                                accountSums[subAccountCurrency.currency] = subAccountCurrency.currencyValue;
                            }
                        });
                    });
                    summary.accountSums = [];
                    for(var accountSum in accountSums){
                        summary.accountSums.push({currency:accountSum, currencyValue:accountSums[accountSum]});
                    }
                });

                return summaries;
            },

            calculateUserSums: function (summaries) {
                var userSums = {};
                angular.forEach(summaries, function(summary) {
                    angular.forEach(summary.accountSums, function(accountSum) {
                        if (userSums[accountSum.currency]) {
                            userSums[accountSum.currency] += accountSum.currencyValue;
                        } else {
                            userSums[accountSum.currency] = accountSum.currencyValue;
                        }
                    });
                });

                var sums = [];
                for(var userSum in userSums){
                    sums.push({currency:userSum, currencyValue:userSums[userSum]});
                }

                return sums;
            }
        };
    }
})();