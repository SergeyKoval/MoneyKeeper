//angular.module("ui.select").run(["$templateCache", function($templateCache) {
//    $templateCache.put("bootstrap/choices.tpl.html", "<ul class=\"ui-select-choices ui-select-choices-content dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\" ng-show=\"$select.items.length > 0\"><li class=\"crumbs\" ng-show=\"breadcrumbs.length > 1\"><span class=\"crumb\" ng-click=\"app.breadCrumbBackTo(crumb, $event)\" ng-repeat=\"crumb in breadcrumbs\">{{ crumb.title }}</span></li><li class=\"ui-select-choices-group\"><div class=\"divider\" ng-show=\"$select.isGrouped && $index > 0\"></div><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label dropdown-header\">{{$group}}</div><div class=\"ui-select-choices-row\" ng-class=\"{active: $select.isActive(this)}\"><a href=\"javascript:void(0)\" class=\"ui-select-choices-row-inner\"></a></div>");
    //$templateCache.put("bootstrap/match.tpl.html", "<button type=\"button\" class=\"btn btn-default form-control ui-select-match\" tabindex=\"-1\" ng-hide=\"$select.open\" ng-disabled=\"$select.disabled\" ng-class=\"{\'btn-default-focus\':$select.focus}\" ;=\"\" ng-click=\"$select.activate()\"><span ng-show=\"$select.isEmpty()\" class=\"text-muted\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" ng-transclude=\"\"></span> <span class=\"caret\"></span></button>");
    //$templateCache.put("bootstrap/select.tpl.html", "<div class=\"ui-select-bootstrap dropdown\" ng-class=\"{open: $select.open}\"><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"off\" tabindex=\"-1\" class=\"form-control ui-select-search\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" ng-show=\"$select.open\"><div class=\"ui-select-choices\"></div></div>");
    //$templateCache.put("select2/choices.tpl.html", "<ul class=\"ui-select-choices ui-select-choices-content select2-results\"><li class=\"ui-select-choices-group\" ng-class=\"{\'select2-result-with-children\': $select.isGrouped}\"><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label select2-result-label\">{{$group}}</div><ul ng-class=\"{\'select2-result-sub\': $select.isGrouped, \'select2-result-single\': !$select.isGrouped}\"><li class=\"ui-select-choices-row\" ng-class=\"{\'select2-highlighted\': $select.isActive(this)}\"><div class=\"select2-result-label ui-select-choices-row-inner\"></div></li></ul></li></ul>");
    //$templateCache.put("select2/match.tpl.html", "<a class=\"select2-choice ui-select-match\" ng-class=\"{\'select2-default\': $select.isEmpty()}\" ng-click=\"$select.activate()\"><span ng-show=\"$select.isEmpty()\" class=\"select2-chosen\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" class=\"select2-chosen\" ng-transclude=\"\"></span> <span class=\"select2-arrow\"><b></b></span></a>");
    //$templateCache.put("select2/select.tpl.html", "<div class=\"select2 select2-container\" ng-class=\"{\'select2-container-active select2-dropdown-open\': $select.open,\n                \'select2-container-disabled\': $select.disabled,\n                \'select2-container-active\': $select.focus }\"><div class=\"ui-select-match\"></div><div class=\"select2-drop select2-with-searchbox select2-drop-active\" ng-class=\"{\'select2-display-none\': !$select.open}\"><div class=\"select2-search\"><input type=\"text\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"ui-select-search select2-input\" ng-model=\"$select.search\"></div><div class=\"ui-select-choices\"></div></div></div>");
    //$templateCache.put("selectize/choices.tpl.html", "<div ng-show=\"$select.open\" class=\"ui-select-choices selectize-dropdown single\"><div class=\"ui-select-choices-content selectize-dropdown-content\"><div class=\"ui-select-choices-group optgroup\"><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label optgroup-header\">{{$group}}</div><div class=\"ui-select-choices-row\" ng-class=\"{active: $select.isActive(this)}\"><div class=\"option ui-select-choices-row-inner\" data-selectable=\"\"></div></div></div></div></div>");
    //$templateCache.put("selectize/match.tpl.html", "<div ng-hide=\"$select.open || $select.isEmpty()\" class=\"ui-select-match\" ng-transclude=\"\"></div>");
    //$templateCache.put("selectize/select.tpl.html", "<div class=\"selectize-control single\"><div class=\"selectize-input\" ng-class=\"{\'focus\': $select.open, \'disabled\': $select.disabled, \'selectize-focus\' : $select.focus}\" ng-click=\"$select.activate()\"><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"off\" tabindex=\"-1\" class=\"ui-select-search\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" ng-hide=\"$select.selected && !$select.open\" ng-disabled=\"$select.disabled\"></div><div class=\"ui-select-choices\"></div></div>");
//}]);

angular.module('app', ['ui.select', 'ngSanitize'])

    .controller('AppController', function() {
        var ctrl = this;

        //this.breadCrumbs = [{
        //    "id": 0,
        //    "title": "All"
        //}];
        //
        this.group = {};

        ctrl.tree = {
            0: [{
                "id": 1,
                "title": "Tazzy",
                "size": "57",
                "parent": true
            }, {
                "id": 2,
                "title": "Skimia",
                "size": "67",
                "parent": true
            }, {
                "id": 3,
                "title": "Edgetag",
                "size": "32539",
                "parent": true
            }, {
                "id": 4,
                "title": "Topicware",
                "size": "898",
                "parent": false
            }, {
                "id": 5,
                "title": "Ailane",
                "size": "83",
                "parent": false
            }, {
                "id": 6,
                "title": "Chatterbridge",
                "size": "084",
                "parent": false
            }, {
                "id": 7,
                "title": "Wordtune",
                "size": "8647",
                "parent": false
            }, {
                "id": 8,
                "title": "Demimbu",
                "size": "2255",
                "parent": false
            }, {
                "id": 9,
                "title": "Plajo",
                "size": "9466",
                "parent": true
            }, {
                "id": 10,
                "title": "Skynoodle",
                "size": "0",
                "parent": true
            }],
            1: [{
                "id": 21,
                "title": "Plajo",
                "size": "1",
                "parent": true
            }, {
                "id": 22,
                "title": "Kwilith",
                "size": "2071",
                "parent": false
            }, {
                "id": 23,
                "title": "Mydeo",
                "size": "306",
                "parent": false
            }, {
                "id": 24,
                "title": "Jaxbean",
                "size": "5",
                "parent": false
            }, {
                "id": 25,
                "title": "Photojam",
                "size": "54",
                "parent": false
            }],
            2: [{
                "id": 31,
                "title": "Blogtag",
                "size": "97084",
                "parent": false
            }, {
                "id": 32,
                "title": "Browsetype",
                "size": "06",
                "parent": false
            }, {
                "id": 33,
                "title": "Voonte",
                "size": "9",
                "parent": false
            }, {
                "id": 34,
                "title": "Omba",
                "size": "71",
                "parent": false
            }, {
                "id": 35,
                "title": "Kwilith",
                "size": "2",
                "parent": false
            }],
            3: [{
                "id": 41,
                "title": "Yodo",
                "size": "2",
                "parent": false
            }, {
                "id": 42,
                "title": "Aibox",
                "size": "2152",
                "parent": false
            }, {
                "id": 43,
                "title": "Jetwire",
                "size": "8858",
                "parent": false
            }, {
                "id": 44,
                "title": "Eabox",
                "size": "5",
                "parent": false
            }, {
                "id": 45,
                "title": "Camimbo",
                "size": "36236",
                "parent": false
            }],
            9: [{
                "id": 51,
                "title": "Feedbug",
                "size": "28933",
                "parent": false
            }, {
                "id": 52,
                "title": "Aimbu",
                "size": "09711",
                "parent": false
            }, {
                "id": 53,
                "title": "Avavee",
                "size": "12",
                "parent": false
            }, {
                "id": 54,
                "title": "Eare",
                "size": "8",
                "parent": false
            }, {
                "id": 55,
                "title": "Wikivu",
                "size": "3",
                "parent": false
            }],
            10: [{
                "id": 61,
                "title": "Tagpad",
                "size": "46",
                "parent": false
            }, {
                "id": 62,
                "title": "Kamba",
                "size": "4",
                "parent": false
            }, {
                "id": 63,
                "title": "Eimbee",
                "size": "26669",
                "parent": false
            }, {
                "id": 64,
                "title": "Twitterlist",
                "size": "95538",
                "parent": false
            }, {
                "id": 65,
                "title": "Rhycero",
                "size": "05",
                "parent": false
            }],
            21: [{
                "id": 71,
                "title": "Cogibox",
                "size": "47",
                "parent": false
            }, {
                "id": 72,
                "title": "Dablist",
                "size": "5",
                "parent": false
            }]

        };

        this.test = function () {
           alert("test");
        };

        //this.groups = getGroupsFor(0);

        //function getGroupsFor(id) {
        //    return ctrl.tree[id];
        //}

        //this.loadNewData = function(group, e) {
        //    e.stopPropagation();
        //
        //    ctrl.breadCrumbs.push(group);
        //
        //    ctrl.groups = getGroupsFor(group.id);
        //};
        //
        //this.breadCrumbBackTo = function(crumb, e) {
        //    e.stopPropagation();
        //
        //
        //    for (var index = 0;index < ctrl.breadCrumbs.length; index++) {
        //        if (ctrl.breadCrumbs[index].id == crumb.id) {
        //            break;
        //        }
        //    }
        //
        //    ctrl.breadCrumbs.splice(index + 1, ctrl.breadCrumbs.length);
        //    ctrl.groups = getGroupsFor(ctrl.breadCrumbs[ctrl.breadCrumbs.length -1].id);
        //};
    });