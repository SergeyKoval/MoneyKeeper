(function () {
    angular
        .module('money-keeper')
        .controller('historyController', HistoryController);

//    HistoryController.$inject = ['historyService', 'CONFIG'];

    function HistoryController(historyService) {
        var vm = this;
        vm.history = historyService.getHistory(20);
    }
})();