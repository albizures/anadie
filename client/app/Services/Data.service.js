/**
 * Created by josec on 6/27/2015.
 */
angular.module('anApp').factory("Data", ['$http', 'toaster','utils',
    function ($http, toaster,utils) { // This service connects to our REST API

        var serviceBase = '/server/api/';

        var obj = {};
        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message,undefined,undefined,undefined,undefined,true);
        };
        obj.get = function (q) {
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.file = function (q,object,options) {
            return $http.delete(serviceBase + q,options).then(function (results) {
                return results.data;
            });
        };
        obj.del = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };

        return obj;
    }]);
