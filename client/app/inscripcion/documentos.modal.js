/**
 * Created by josec on 9/26/2015.
 */

angular.module('anApp')
    .controller('ModalDocumentosCtrl',["$scope", '$modalInstance','Data','utils','proyecto','FileUploader','$modal',
    function ($scope,$modalIntance, Data, utils,proyecto,FileUploader,$modal) {
        $scope.proyecto = proyecto;
        $scope.dictamenTecnico = false;
        $scope.dictamenLegal = false;
        $scope.resolucionEjecutiva = false;
        $scope.resolucionConadie = false;

        proyecto.dictamen_tec_fec = proyecto.dictamen_tec_fec === "0000-00-00"? undefined : proyecto.dictamen_tec_fec;
        var dateDicTec = moment(proyecto.dictamen_tec_fec);
        proyecto.diaDicTec = dateDicTec.date();
        proyecto.mesDicTec = dateDicTec.month();
        proyecto.anioDicTec = dateDicTec.year();
        if(proyecto.dictamen_tec_fec) {
            $scope.dictamenTecnico = true;
        }

        proyecto.dictamen_leg_fec = proyecto.dictamen_leg_fec === "0000-00-00"? undefined : proyecto.dictamen_leg_fec;
        var dateDicLeg = moment(proyecto.dictamen_leg_fec);
        proyecto.diaDicLeg = dateDicLeg.date();
        proyecto.mesDicLeg = dateDicLeg.month();
        proyecto.anioDicLeg = dateDicLeg.year();

        if(proyecto.dictamen_leg_fec){
            $scope.dictamenLegal = true;
        }
        proyecto.res_dir_eje_fec = proyecto.res_dir_eje_fec === "0000-00-00"? undefined : proyecto.res_dir_eje_fec;
        var dateResDir = moment(proyecto.res_dir_eje_fec);
        proyecto.diaResDir = dateResDir.date();
        proyecto.mesResDir = dateResDir.month();
        proyecto.anioResDir = dateResDir.year();
        if(proyecto.res_dir_eje_fec){
            $scope.resolucionEjecutiva = true;
        }

        proyecto.res_conadie_fec = proyecto.res_conadie_fec === "0000-00-00"? undefined : proyecto.res_conadie_fec;
        var dateResCon = moment(proyecto.res_conadie_fec);
        proyecto.diaResCon = dateResCon.date();
        proyecto.mesResCon = dateResCon.month();
        proyecto.anioResCon = dateResCon.year();
        if(proyecto.res_conadie_fec){
            $scope.resolucionConadie = true;
        }
        var currentName = '';
        var currentId;
        var currentDoc;
        $scope.agregarPDF = function (doc) {
            currentId = proyecto.id;
            currentDoc = doc;
            currentName = currentId+doc;
        };
        $scope.guardar = function (name) {
            var result = $scope.uploader.queue.filter(function (item) {
                return item.alias == proyecto.id + name + 'doc';
            })[0];
            if(!moment(proyecto[name + 'fec']).isValid()){
                Data.toast({status : 'warning',message : 'Fecha invalida'});
                return;
            }
            if(!result){
                Data.toast({status : 'warning',message : 'Seleccione un PDF'});
                return;
            }
            result.document = proyecto[name + 'doc'];
            result.formData[0].referencia = proyecto[name + 'ref'];
            result.formData[0].fecha = proyecto[name + 'fec'];
            result.upload();
        };
        $scope.uploader = new FileUploader({
            url: 'server/api/uploadFile'
        });
        $scope.uploader.filters.push({
            name: 'pdf',
            fn: function(item /*{File|FileLikeObject}*/, options) {
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
            console.log(currentDoc.replace('doc',''));
            $scope.proyecto[currentDoc.replace('doc','')] = fileItem;
            fileItem.formData.push(data);
            fileItem.tipo = currentDoc.replace('doc','');
            fileItem.documento = currentDoc;
            //console.log($scope.seledPDf(currentName));
        };
        $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
            Data.toast(response);
            if(fileItem.tipo == 'dictamen_tec_') $scope.dictamenTecnico =  true;
            if(fileItem.tipo == 'dictamen_leg_') $scope.dictamenLegal = true;
            if(fileItem.tipo == 'res_dir_eje_') $scope.resolucionEjecutiva = true;
            if(fileItem.tipo == 'res_conadie_') $scope.resolucionConadie = true;

            proyecto[fileItem.documento] = response.target_file;
        };
        $scope.ok = function () {
            $modalIntance.close($scope.proyecto);
        };
        $scope.$watchGroup(['proyecto.diaDicTec','proyecto.mesDicTec','proyecto.anioDicTec'], formatFechaDicTec);
        $scope.$watchGroup(['proyecto.diaDicLeg','proyecto.mesDicLeg','proyecto.anioDicLeg'], formatFechaDicLeg);
        $scope.$watchGroup(['proyecto.diaResDir','proyecto.mesResDir','proyecto.anioResDir'], formatFechaResDir);
        $scope.$watchGroup(['proyecto.diaResCon','proyecto.mesResCon','proyecto.anioResCon'], formatFechaResCon);

        function formatFechaDicTec (newValue, oldValue) {
            console.log('cambio');
            if($scope.proyecto && $scope.proyecto.diaDicTec !== undefined && $scope.proyecto.mesDicTec !== undefined && $scope.proyecto.anioDicTec !== undefined){
                $scope.proyecto.dictamen_tec_fec =  moment([$scope.proyecto.anioDicTec,$scope.proyecto.mesDicTec,$scope.proyecto.diaDicTec]).format();
            }
        }
        function formatFechaDicLeg (newValue, oldValue) {
            if($scope.proyecto && $scope.proyecto.diaDicLeg !== undefined && $scope.proyecto.mesDicLeg !== undefined && $scope.proyecto.anioDicLeg !== undefined){
                $scope.proyecto.dictamen_leg_fec =  moment([$scope.proyecto.anioDicLeg,$scope.proyecto.mesDicLeg,$scope.proyecto.diaDicLeg]).format();
            }
        }
        function formatFechaResDir (newValue, oldValue) {
            if($scope.proyecto && $scope.proyecto.diaResDir !== undefined && $scope.proyecto.mesResDir !== undefined && $scope.proyecto.anioResDir !== undefined){
                $scope.proyecto.res_dir_eje_fec =  moment([$scope.proyecto.anioResDir,$scope.proyecto.mesResDir,$scope.proyecto.diaResDir]).format();
            }
        }
        function formatFechaResCon (newValue, oldValue) {
            if($scope.proyecto && $scope.proyecto.diaResCon !== undefined && $scope.proyecto.mesResCon !== undefined && $scope.proyecto.anioResCon !== undefined){
                $scope.proyecto.res_conadie_fec =  moment([$scope.proyecto.anioResCon,$scope.proyecto.mesResCon,$scope.proyecto.diaResCon]).format();
            }
        }
        $scope.ver = function (name) {
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

        //validas = validas && moment($scope.proyecto.dictamen_tec_fec).isValid();
        //validas = validas && moment($scope.proyecto.dictamen_leg_fec).isValid();
        //validas = validas && moment($scope.proyecto.res_dir_eje_fec).isValid();
        //validas = validas && moment($scope.proyecto.res_conadie_fec).isValid();
}]);

