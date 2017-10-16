/*global define */
define(['angular', './sample-module'], function (angular, module) {
    'use strict';
    /**
    * PredixViewService is a sample angular service that integrates with Predix View Service API
    */
    module.factory('VehicleService', ['$http', '$q', function ($http, $q) {

        var getCarInfo = function (car_id) {
            return $http.get('/sample-data/vehicle-details-car'+car_id+'.json', {
              'Content-Type' : 'application/json'
            });
        }

        var getCarsList = function () {
            return $http.get('/sample-data/vehicles-list.json', {
              'Content-Type' : 'application/json'
            });
        }

        return {
          getCarInfo : getCarInfo,
          getCarsList : getCarsList
        };
    }]);
});
