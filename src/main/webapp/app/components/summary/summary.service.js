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
                subAccountCurrencies : {EUR:25.38, BR:12365000, USD:5325.8}
            },
            {
                subAccountName : 'Резерв',
                subAccountCurrencies : {USD:11.25, EUR:18.8}
            }]
        },
        {
            accountName : 'Сбережения',
            accountExpand : true,
            subAccounts : [{
                subAccountName : 'Наличные',
                subAccountCurrencies : {USD:11, EUR: 12, BR:125968000}
            }]
        }];

        return {
            getSummary: function() {
                var summary = this.formatSubAccountCurrencyDetails(summaryJson);
                return this.calculateAccountSums(summary);
            },

            formatSubAccountCurrencyDetails: function(summaries) {
                angular.forEach(summaries, function(summary) {
                    angular.forEach(summary.subAccounts, function(subAccount) {
                        var subAccountCurrencyDetails = [];
                        angular.forEach(subAccount.subAccountCurrencies, function(subAccountCurrencyValue, subAccountCurrency) {
                            subAccountCurrencyDetails.push({currency:subAccountCurrency, currencyValue:subAccountCurrencyValue})
                        });
                        subAccount.subAccountCurrencyDetails = subAccountCurrencyDetails;
                    });
                });

                return summaries;
            },

            calculateAccountSums: function (summaries) {
                angular.forEach(summaries, function(summary) {
                    var accountSums = {};
                    angular.forEach(summary.subAccounts, function(subAccount) {
                        angular.forEach(subAccount.subAccountCurrencies, function(subAccountCurrencyValue, subAccountCurrency) {
                            if (accountSums[subAccountCurrency]) {
                                accountSums[subAccountCurrency] += subAccountCurrencyValue;
                            } else {
                                accountSums[subAccountCurrency] = subAccountCurrencyValue;
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