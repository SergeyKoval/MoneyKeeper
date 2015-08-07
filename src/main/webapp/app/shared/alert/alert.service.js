(function () {
    angular
        .module('money-keeper')
        .factory('alertService', alertService);

    alertService.$inject = ['$rootScope'];

    function alertService(rootScope) {
        rootScope.alerts = [];

        return {
            addAlert: function(type, msg, autoClose) {
                rootScope.alerts.push({type: type, msg: msg, autoClose: autoClose});
            },

            closeAlert: function(index) {
                rootScope.alerts.splice(index, 1);
            }
        };
    }
})();