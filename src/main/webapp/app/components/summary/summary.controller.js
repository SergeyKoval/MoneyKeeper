(function () {
    angular
        .module('money-keeper')
        .controller('summaryController', SummaryController);

//    SummaryController.$inject = ['summaryService', 'CONFIG'];

    function SummaryController(summaryService) {
        var vm = this;
        vm.summary = summaryService.getSummary();
        vm.userSums = summaryService.calculateUserSums(vm.summary);

    }
})();