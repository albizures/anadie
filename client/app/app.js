/**
 * Created by josec on 6/26/2015.
 */

var anApp = angular.module("anApp",[
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'ngTable',
    'http-auth-interceptor',
    'toaster',
    'angularFileUpload'
])
    .constant('tipoMenu',{
        1 : false,
        2 : 0
    })
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider
            .otherwise('/');

        $locationProvider.html5Mode(true);
    })
    .run(['$rootScope', '$location', 'Auth','utils',function ($rootScope, $location, Auth,utils) {
        $rootScope.$watch('usuario', function(currentUser) {
            if (!currentUser && (['/', '/login', '/logout', '/signup'].indexOf($location.path()) == -1 )) {
                Auth.currentUser();
            }
        });
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
    }]);
