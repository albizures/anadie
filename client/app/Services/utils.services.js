/**
 * Created by josec on 7/10/2015.
 */

angular.module('anApp').factory("utils", function () {
    return {
        convertNumber : function(obj){
            for(index2 in obj){
                if(!isNaN(Number(obj[index]))){
                    obj[index] = Number(obj[index]);
                }
            }
            return obj;
        }
    }

});