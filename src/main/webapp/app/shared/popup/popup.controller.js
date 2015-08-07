(function () {
    angular
        .module('money-keeper')
        .controller('popupController', PopupController);

    PopupController.$inject = ['$modalInstance', 'okFunction', 'cancelFunction'];

    function PopupController(modalInstance, okFunction, cancelFunction) {
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