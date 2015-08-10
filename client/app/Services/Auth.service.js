/**
 * Created by josec on 7/5/2015.
 */
angular.module('anApp')
    .factory('Auth',['$cookieStore','$rootScope','Data','$location','utils',function ($cookieStore,$rootScope,Data,$location,utils) {
        $rootScope.usuario = $cookieStore.get('user') || null;
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
            for(index in data.opciones){
                data.opciones[index] = utils.convertNumber(data.opciones[index]);
            }
            var temp = data.opciones.filter(function (item) {
                return item.idPadre === 0;
            });
            for(index in temp){
                var cont = 0;
                while(cont < data.opciones.length ){
                    if(temp[index].id === data.opciones[cont].id){
                        data.opciones.splice(cont,1);
                        cont--;
                    }else{
                        if(temp[index].id === data.opciones[cont].idPadre){
                            if(!temp[index].submenu){
                                temp[index].submenu = [];
                            }
                            temp[index].submenu.push(data.opciones.splice(cont,1)[0]);
                            cont--;
                        }
                    }
                    cont++;
                }
            }

            //console.log(temp,data.opciones);
            $rootScope.opciones = temp;//data.opciones;
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
                Data.get('logout')
                    .then(function (results) {
                        Data.toast(results);
                        $rootScope.usuario = null;
                        $rootScope.opciones = null;
                        return cb();
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