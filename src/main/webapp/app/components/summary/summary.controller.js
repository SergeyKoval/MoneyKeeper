(function () {
    angular
        .module('money-keeper')
        .controller('summaryController', SummaryController);

    SummaryController.$inject = ['summaryService', '$rootScope'];

    function SummaryController(summaryService, rootScope) {
        var vm = this;

        vm.loadSummary = function () {
            vm.summary = summaryService.getSummary();
            vm.userSums = summaryService.calculateUserSums(vm.summary);
        };

        vm.loadSummary();

        rootScope.$on('history:update', function(event, data) {
            vm.loadSummary();
        });
    }
})();