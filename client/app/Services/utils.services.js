/**
 * Created by josec on 7/10/2015.
 */

angular.module('anApp').factory("utils", function () {
    return {
        convertNumber : function(obj){
            for(var index in obj){
                if(obj[index] !== null && obj[index] !== undefined && !isNaN(Number(obj[index]))){
                    obj[index] = Number(obj[index]);
                }
            }
            return obj;
        }
    }

});