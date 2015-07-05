/**
 * Created by josec on 7/5/2015.
 */
angular.module('anApp')
    .factory('Auth',['$cookieStore','$rootScope','Data','$location',function ($cookieStore,$rootScope,Data,$location) {
        $rootScope.currentUser = $cookieStore.get('user') || null;
        $cookieStore.remove('user');
        function informacionUsuario (data) {
            $rootScope.usuario = {
                nombre : data.name,
                nombres : data.nombres,
                apellidos : data.apellidos,
                idRol : Number(data.idrol),
                rol : data.rol,
                idOrganizacion : data.idorganizacion,
                organizacion : data.organizacion,
                email : data.email
            };
            $rootScope.opciones = data.opciones;
        }
        return {
            login: function( user, callback) {
                console.log(user);
                var cb = callback || angular.noop;
                Data.post('login',{'user':{
                    username: user.username,
                    password: user.password
                }}).then(function (results) {
                    Data.toast(results);
                    if(results.status === "success"){
                        $location.path("/");
                        informacionUsuario(results);
                        return cb();
                    }else{
                        return cb(results);
                    }
                });
            },

            logout: function(callback) {
                var cb = callback || angular.noop;
                Session.delete(function(res) {
                        $rootScope.currentUser = null;
                        return cb();
                    },
                    function(err) {
                        return cb(err.data);
                    });
            },
            currentUser: function() {
                Data.get('session')
                    .then(function(results) {
                        informacionUsuario(results);
                    });
            }
        }
    }]);