(function () {
    angular
        .module('money-keeper')
        .config(function($routeProvider) {
            $routeProvider
                .when('/budget', {
                    templateUrl: 'app/components/budget/budget.html',
                    controller: 'summaryController'
                })
                .when('/history', {
                    templateUrl: 'app/components/history/history.html',
                    controller: 'historyController',
                    controllerAs: 'historyContr'
                })
                .when('/profile', {
                    templateUrl: 'app/components/profile/profile.html',
                    controller: 'summaryController'
                })
                .otherwise({
                    redirectTo: '/budget'
                });

//            $locationProvider.html5Mode(true);
        });
})();