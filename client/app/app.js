/**
 * Created by josec on 6/26/2015.
 */

var anApp = angular.module("anApp",[
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    //'ngAnimate',
    'ngTable',
    'http-auth-interceptor',
    'toaster',
    'angularFileUpload'
])
    .constant('tipoMenu',{
        1 : false,
        2 : 1
    })
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider
            .otherwise('/');

        $locationProvider.html5Mode(false);
    })
    .run(['$rootScope', '$location', 'Auth','utils','$modal',function ($rootScope, $location, Auth,utils,$modal) {
        $rootScope.$watch('usuario', function(currentUser) {
            if (!currentUser && (['/', '/login', '/logout', '/signup'].indexOf($location.path()) == -1 )) {
                Auth.currentUser();
            }
        });
        window.hasVal = function (val) {
            return typeof val !== 'undefined' && val !== null;
        };
        $rootScope.today = {
            day : moment().date(),
            month : moment().month(),
            year : moment().year()
        };

        $rootScope.dias = utils.dias;
        $rootScope.meses = utils.meses;
        $rootScope.anios = utils.anios;
        $rootScope.$on('$stateChangeSuccess', function (event, next, current) {

        });
        $rootScope.$on('$stateChangeStart', function (event,next,current) {
            if(['contacto', 'login' ].indexOf(next.name) == -1){
                Auth.currentUser();
            }
        });
        $rootScope.$on('event:auth-loginRequired', function() {
            $location.path('/login');
            return false;
        });
        $rootScope.confirm = function (msg,cb) {
            if(!hasVal(msg)) return console.error('msg undefined');
            var modal = $modal.open({
                templateUrl : 'confirm.modal',
                controller : 'ModalConfirmCtrl',
                backdrop : 'static',
                size : 'sm',
                resolve : {
                    msg : function () {
                        return msg;
                    }
                }
            });
            modal.result.then(function (result) {
                if(cb) cb(result);
            });
        };
        moment.locale('es', {
            relativeTime : {
                future: "en %s",
                past:   "hace %s",
                s:  "segundos",
                m:  "un minudo",
                mm: "%d minutos",
                h:  "una hora",
                hh: "%d horas",
                d:  "un dia",
                dd: "%d dias",
                M:  "un mes",
                MM: "%d meses",
                y:  "un año",
                yy: "%d años"
            }
        });
        $rootScope.timeFromNow = function (date) {
            return moment(date).fromNow();
        };
        $rootScope.getUnixDate = function (date) {
            return moment(date).unix();
        };
        $rootScope.openVisor = function (name) {
            var modalVisor = $modal.open({
                templateUrl : 'modalVisor',
                controller : 'ModalVisorCtrl',
                windowClass : 'visor',
                size : 'lg',
                resolve: {
                    url: function () {
                        return name;
                    }
                }
            });
        };
    }]).filter('capitalize', function() {
        return function(input, scope) {
            if (input!=null)
                input = input.toLowerCase();
            return input.substring(0,1).toUpperCase()+input.substring(1);
        }
    }).filter('moment', function () {
        return function (input,format) {
            return moment(input).format(format);
        }
    }).controller('ModalConfirmCtrl', ['$scope','$modalInstance','msg',function ($scope,$modalInstance,msg) {
        $scope.msg = msg;
        $scope.ok = function (result) {
            $modalInstance.close(result);
        };
    }]).directive('anBack', ['$window',function ($window) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.on('click', function() {
                    $window.history.back();
                });
            }
        }
    }]);
