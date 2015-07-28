(function () {
    var CONFIG = {
        CURRENCIES : {
            BR:'Br',
            USD:'$',
            EUR:'€'
        }
    };

    angular.module('mk-config', [])
        .constant('CONFIG', CONFIG);
})();