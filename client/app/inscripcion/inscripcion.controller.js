/**
 * Created by josec on 8/30/2015.
 */

angular.module('anApp').controller('InscripcionCtrl',
    ['$scope','Data','$rootScope','ngTableParams','$filter','$modal','utils',
    function ($scope,Data, $rootScope, ngTableParams, $filter , $modal, utils) {
        $scope.filtro = false;
        $scope.$watch('filtro', function (newValue, oldValue) {
            if(newValue !== undefined && newValue !== oldValue){
                if($scope.tableProyectos){
                    $scope.tableProyectos.reload();
                }
            }
        });
        Data.get('proyectoSel')
            .then(function (results) {
                if(results.message){
                    Data.toast(results);
                    return;
                }
                for(index in results){
                    results[index] = utils.convertNumber(results[index]);
                }
                $scope.proyectos = results;
                for(index in $scope.proyectos){

                    $scope.proyectos[index].tipo = {
                        codTipo : $scope.proyectos[index].codTipo,
                        id  : $scope.proyectos[index].idTipo,
                        nombreTipo : $scope.proyectos[index].nombreTipo
                    }
                }
                $scope.tableProyectos = new ngTableParams({
                        page : 1,
                        count : 10,
                        sorting : {
                            nombre : 'asc'
                        }
                    },{
                        total : $scope.proyectos.length,
                        filterDelay: 350,
                        getData : function ($defer, params) {
                            var orderedData = params.sorting() ? $filter('orderBy')($scope.proyectos, params.orderBy()) : $scope.proyectos;
                            if($scope.filtro){
                                orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
                            }
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );
            });

        $scope.agregar = function () {
            var modalProyectos = $modal.open({
                templateUrl : 'modalProyectos',
                controller : 'ModalProyectosCtrl',
                size : 'lg',
                backdrop : 'static',
                resolve :{
                    proyecto: function () {
                        return undefined;
                    }
                }
            });
            modalProyectos.result.then(function (proyecto) {
                Data.post('proyectoIn',{'proyecto':proyecto})
                    .then(function (results) {
                        if(results.status === "success"){
                            //debugger;
                            console.log(Number(results.data.id),results.data.id,results.data);
                            proyecto.id = Number(results.data.id);
                            $scope.proyectos.push(proyecto);
                            $scope.tableProyectos.reload();
                        }
                        Data.toast(results);
                    });
            });
        };
        $scope.documentos = function (proyecto) {
            var modalDocumentos = $modal.open({
                templateUrl : 'modalDocumentos',
                controller : 'ModalDocumentosCtrl',
                size : 'lg',
                backdrop : 'static',
                resolve: {
                    proyecto: function () {
                        return angular.copy(proyecto);
                    }
                }
            });
            modalDocumentos.result.then(function (newProyecto) {
                if(newProyecto.dictamen_tec_doc){
                    proyecto.dictamen_tec_doc = newProyecto.dictamen_tec_doc;
                    proyecto.dictamen_tec_ref = newProyecto.dictamen_tec_ref;
                    proyecto.dictamen_tec_fec = newProyecto.dictamen_tec_fec;
                }
                if(newProyecto.dictamen_leg_doc){
                    proyecto.dictamen_leg_doc = newProyecto.dictamen_leg_doc;
                    proyecto.dictamen_leg_ref = newProyecto.dictamen_leg_ref;
                    proyecto.dictamen_leg_fec = newProyecto.dictamen_leg_fec;
                }
                if(newProyecto.res_dir_eje_doc){
                    proyecto.res_dir_eje_doc = newProyecto.res_dir_eje_doc;
                    proyecto.res_dir_eje_ref = newProyecto.res_dir_eje_ref;
                    proyecto.res_dir_eje_fec = newProyecto.res_dir_eje_fec;
                }
                if(newProyecto.res_conadie_doc){
                    proyecto.res_conadie_doc = newProyecto.res_conadie_doc;
                    proyecto.res_conadie_ref = newProyecto.res_conadie_ref;
                    proyecto.res_conadie_fec = newProyecto.res_conadie_fec;
                }
            });
        };
        $scope.ver = function (item) {
            var modalProyectos = $modal.open({
                templateUrl : 'modalProyectos',
                controller : 'ModalProyectosCtrl',
                size : 'lg',
                resolve: {
                    proyecto: function () {
                        return item;
                    }
                }
            });
        };
        $scope.limpiar = function () {
            $scope.tableProyectos.sorting({});
            $scope.tableProyectos.filter({});
            $scope.filtro = false;
        };
        /*var currentName = '';
        var currentId;
        var currentDoc;
        $scope.agregarPDF = function (id,doc) {
            currentId = id;
            currentDoc = doc;
            currentName = id+doc;
        };
        $scope.uploader = new FileUploader({
            url: 'server/api/uploadFile'
        });
        $scope.uploader.filters.push({
            name: 'pdf',
            fn: function(item *//*{File|FileLikeObject}*//*, options) {
                return item.type.indexOf('pdf') != -1;
            }
        });
        $scope.uploader.onAfterAddingFile = function(fileItem) {
            fileItem.alias =  currentName;
            //console.info('onAfterAddingFile', fileItem);
            var data = {
                id : currentId,
                nombre : currentDoc
            };
            fileItem.formData.push(data);
            //console.log($scope.seledPDf(currentName));
        };
        $scope.uploader.onBeforeUploadItem(function (item) {
            //console.log('onBefore',item);
        });
        $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
            fileItem.proyecto[fileItem.documento] = response.target_file;
        };
        $scope.subir = function (id,name,proyecto) {
            var result = $scope.uploader.queue.filter(function (item) {
                return item.alias == id + name;
            })[0];
            result.documento = name;
            result.proyecto = proyecto;
            result.upload();
        };
        $scope.seledPDf = function (name) {
            var result = $scope.uploader.queue.filter(function (item) {
                return item.alias == name;
            });
            return result.length != 0;
        };
        $scope.verPDF = function (proyecto,name) {
            var modalVisor = $modal.open({
                templateUrl : 'modalVisor',
                controller : 'ModalVisorCtrl',
                windowClass : 'visor',
                size : 'lg',
                resolve: {
                    url: function () {
                        return proyecto[name];
                    }
                }
            });
        };*/
}]);