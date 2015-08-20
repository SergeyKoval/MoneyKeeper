(function () {
    angular
        .module('money-keeper')
        .controller('historyController', HistoryController);

    HistoryController.$inject = ['historyService', '$modal', '$rootScope', 'alertService'];

    function HistoryController(historyService, modal, rootScope, alertService) {
        var vm = this;

        rootScope.$on('history:update', function(event, data) {
            vm.history = historyService.getHistory(vm.historyItemsCount);
        });

        vm.selectedHistoryItem = null;
        vm.historyItemsCount = 20;
        vm.historyItemsIncreaseCount = 10;
        vm.history = historyService.getHistory(vm.historyItemsCount);

        vm.deleteHistoryItem = function (historyItem) {
            vm.selectedHistoryItem = historyItem;
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'app/shared/popup/delete/popup-delete.html',
                controller: 'deletePopupController',
                controllerAs: 'deletePopupContr',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    okFunction: function () {
                        return function () {
                            if (historyService.removeHistoryItem(vm.selectedHistoryItem)) {
                                alertService.addAlert('success' , 'Элемент удален', true);
                            } else {
                                alertService.addAlert('danger' , 'Ошибка при удалении элемента', false);
                            }
                            rootScope.$emit('history:update');
                        };
                    }, 
                    cancelFunction: function () {
                        return function () {
                            vm.selectedHistoryItem = null;
                        }
                    }
                }
            });
        };

        vm.showMore = function () {
            vm.historyItemsCount += vm.historyItemsIncreaseCount;
            vm.history = historyService.getHistory(vm.historyItemsCount);
        };

        vm.openEditPopup = function (historyItem) {
            vm.selectedHistoryItem = historyItem;
            var modalInstance = modal.open({
                animation: true,
                templateUrl: 'app/components/history/popup-edit.html',
                controller: 'popupController',
                controllerAs: 'popupContr',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    okFunction: function () {
                        return function () {
                            if (historyService.removeHistoryItem(vm.selectedHistoryItem)) {
                                alertService.addAlert('success' , 'Элемент удален', true);
                            } else {
                                alertService.addAlert('danger' , 'Ошибка при удалении элемента', false);
                            }
                            rootScope.$emit('history:update');
                        };
                    },
                    cancelFunction: function () {
                        return function () {
                            vm.selectedHistoryItem = null;
                        }
                    }
                }
            });
        };
    }
})();