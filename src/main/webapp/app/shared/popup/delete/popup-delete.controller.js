(function () {
    angular
        .module('money-keeper')
        .controller('deletePopupController', DeletePopupController);

    DeletePopupController.$inject = ['$modalInstance', 'okFunction', 'cancelFunction'];

    function DeletePopupController(modalInstance, okFunction, cancelFunction) {
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