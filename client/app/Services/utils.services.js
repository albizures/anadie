/**
 * Created by josec on 7/10/2015.
 */

angular.module('anApp').factory("utils", function () {

    var dias = [];
    for (var i = 1; i < 32; i++) {
        dias.push(i)
    }
    var nombreMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var meses = [];
    for (var b = 0; b < nombreMeses.length; b++) {
        meses.push({nombre : nombreMeses[b], id : Number(b)});
    }
    var anios =  [];
    for (var a = 1950; a <= moment().year(); a++) {
        anios.push(a)
    }

    return {
        convertNumber : function(obj){
            for(var index in obj){
                if(obj[index] !== null && obj[index] !== undefined && !isNaN(Number(obj[index]))){
                    obj[index] = Number(obj[index]);
                }
            }
            return obj;
        },
        dias : dias,
        meses : meses,
        anios : anios,
        convertDate : function (dia,mes,anio) {
            return moment([2015, 10,2]);
        }
    }

});