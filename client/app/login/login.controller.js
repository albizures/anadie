/**
 * Created by josec on 6/26/2015.
 */
angular.module('anApp')
    .controller('LoginCtrl',['$location','$scope','Data','toaster',function ($location,$scope,Data) {
        $scope.login = function(customer){
            console.log(customer);
            Data.post('login',{customer : customer})
                .then(function (results) {
                    console.log(results);
                    Data.toast(results);
                    if(results.status === "success"){
                        $location.path("main");
                    }
                });
        }
    }]);