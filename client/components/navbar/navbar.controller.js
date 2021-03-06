/**
 * Created by josec on 6/26/2015.
 */
angular.module('anApp')
    .controller('NavbarCtrl', ['$scope', '$location','$rootScope','Auth','$modal',function ($scope, $location,$rootScope,Auth,$modal) {

        $rootScope.$watch('opciones', function () {
            //console.log($rootScope.opciones); // alert('cambio');
        });
        $scope.usuario = $rootScope.usuario;
        $scope.logout = function () {
            Auth.logout(function () {
                $location.path('/login');
            });
        };
        $scope.cambiarPass = function () {
            $modal.open({
                templateUrl : 'modal.pass',
                controller : 'PassCtrl',
                size : 'sm',
                resolve : {
                    administrador : function () {
                        return false
                    },
                    usuario : function () {
                        return undefined
                    }
                }
            });
        };
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            //console.log(toState.name,toState.name);
			$rootScope.ImgEvento = (toState.name == 'visor' || toState.name == 'consulta') ? $rootScope.ImgEvento : '';
			//console.log($rootScope.ImgEvento,toState.name == 'visor' || toState.name == 'consulta');
			//$rootScope.$applyAsync();
            $rootScope.mostrarImg = toState.name == 'visor' || toState.name == 'consulta';
        });
        $scope.menu = [
        {
           "title": "Home",
           "href": "#"
        },
        {
           "title": "About",
           "href": "about"
        },
        {
           "title": "History",
           "href": "about/history"
        },
        {
           "title": "Contact",
           "href": "contact"
        },
        {
           "title": "Other things - in a list. (Click here)",
           "submenu": [
               {
                   "header": "Sample Header"
               },
               {
                   "title": "Some Link",
                   "href": "some/place"
               },
               {
                   "title": "Another Link",
                   "href": "some/other/place"
               },
               {
                   "divider": "true"
               },
               {
                   "header": "Header 2"
               },
               {
                   "title": "Again...a link.",
                   "href": "errrr"
               },
               {
                   "title": "Nest Parent",
                   "submenu": [
                       {
                           "title": "nested again",
                           "href": "nested/again"
                       },
                       {
                           "title": "me too",
                           "href": "sample/place"
                       }
                   ]
               }
           ]
        }
        ];
    }])
    .directive('menu', [function () {
        return {
            restrict: 'A',
            scope: {
                menu: '=menu',
                cls: '=ngClass',
                empty : '@menuEmpty'
            },
            replace: true,
            template: '<ul>' +
                        //'<li  class="inicio">' +
                        //    '<a ui-sref="main">Inicio</a>' +
                        //'</li>' +
                        '<li ng-repeat="item in menu" menu-item="item">{{item}}</li>' +
                        //'<li class="contacto pull-right">'+
                        //    '<a ui-sref="contacto">Contacto</a>'+
                        //'</li>'+
                       '</ul>',
            link: function(scope, element, attrs) {
                //if(scope.empty){
                //    $(element).children('.inicio,.contacto').remove();
                //}
                element.addClass(attrs.class);
                element.addClass(scope.cls);
            }
        }
    }])
    .directive('menuItem',['$compile',function ($compile) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                item: '=menuItem'
            },
            template: '<li ></li>',
            link: function (scope, element, attrs) {
                if(!hasVal(scope.item)) return;
                if (scope.item.titulo == "----------") {
                    element.addClass('divider');
                    element.empty();
                }
                if ( scope.item.submenu) {
                    //console.log('item',scope);
                    element.attr('dropdown','');
                    element.addClass('btn-group');
                    var text = element.children('a').text();
                    element.empty();
                    var $a = $('<button>'+scope.item.titulo +' <span class="caret"></span></button>');
                    element.append($a);

                    var $submenu = $('<div menu="item.submenu" menu-empty="true" class="dropdown-menu"></div>');
                    element.append($submenu);
                }else{
                    element.addClass('submenu');
                    element.attr('role','menuitem');
                    var link = $('<a ui-sref="'+ scope.item.nombre.toLowerCase() +'">'+scope.item.titulo+'</a>');
                    element.append(link);
                    //element.text(scope.item.titulo);
                }
                if (scope.item.click) {
                    element.find('a').attr('ng-click', 'item.click()');
                }
                $compile(element.contents())(scope);
            }
        };
    }]);