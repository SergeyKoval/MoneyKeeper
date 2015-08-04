(function () {
    angular
        .module('money-keeper')
        .controller('historyController', HistoryController);

//    HistoryController.$inject = ['historyService', 'CONFIG'];

    function HistoryController(historyService) {
        var vm = this;
        vm.historyItemsCount = 20;
        vm.history = historyService.getHistory(vm.historyItemsCount);
    }
})();