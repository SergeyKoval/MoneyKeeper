(function () {
    angular
        .module('money-keeper')
        .controller('historyPopupController', HistoryPopupController);

    HistoryPopupController.$inject = ['$modalInstance', 'okFunction', 'cancelFunction'];

    function HistoryPopupController(modalInstance, okFunction, cancelFunction) {
        var vm = this;

        vm.ok = function() {
            okFunction();
            modalInstance.close();
        };

        vm.cancel = function() {
            cancelFunction();
            modalInstance.dismiss('cancel');
        };
    }
})();