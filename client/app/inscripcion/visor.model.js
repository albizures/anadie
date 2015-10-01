/**
 * Created by josec on 9/10/2015.
 */


angular.module("anApp")
    .controller('ModalVisorCtrl', ['$scope','$modalInstance','url',function ($scope,$modalIntance,url) {
        $scope.url = url;
    }]);