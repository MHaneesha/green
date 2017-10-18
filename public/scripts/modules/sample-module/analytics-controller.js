define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('AnalyticsCtrl', ['$scope','VehicleService', function ($scope, VehicleService) {
       $scope.destInput = '';
       $scope.origInput = '';
       $scope.directionsRequest = false;

       var mapOptions = {
          zoom: 5,
          mapTypeControl: false,
          center: new google.maps.LatLng(41.85, -87.65),
          mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        $scope.directionsService = new google.maps.DirectionsService;
        $scope.directionsDisplay = new google.maps.DirectionsRenderer;
        $scope.directionsDisplay.setMap($scope.map);

        $scope.getDirections = function () {
          $scope.directionsRequest = true;
          setTimeout(function() {google.maps.event.trigger(map, 'resize')}, 100);
          $scope.getMapDirections($scope.directionsService, $scope.directionsDisplay);
        }
        $scope.closeMap = function () {
          $scope.directionsRequest = false;
        }

        $scope.initAutoComplete = function () {
          new AutocompleteDirectionsHandler($scope.map);
        }

        function AutocompleteDirectionsHandler(map) {
          this.map = map;
          var originInput = document.getElementById('origin-input');
          var destinationInput = document.getElementById('destination-input');

          var originAutocomplete = new google.maps.places.Autocomplete(
              originInput, {placeIdOnly: true});
          var destinationAutocomplete = new google.maps.places.Autocomplete(
              destinationInput, {placeIdOnly: true});

          this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
          this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

        }

        AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
          var me = this;
          // autocomplete.bindTo('bounds', this.map);
          autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            if (!place.place_id) {
              window.alert("Please select an option from the dropdown list.");
              return;
            }
            console.log(place);
            if (mode === 'ORIG') {
              $scope.originPlace = place.name;
            } else {
              $scope.destinationPlace = place.name;
            }
            // me.route();
          });


        };

        $scope.getMapDirections = function(directionsService, directionsDisplay) {
          debugger

          directionsService.route({
            origin: $scope.analyticsData.distanceMatrix.origin,
            destination: $scope.analyticsData.distanceMatrix.destination,
            travelMode: 'DRIVING'
          }, function(response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
        };

        $scope.showAnalytics = false;
        VehicleService.getCarsList().success(function (response) {
          $scope.carsList = response;
          console.log($scope.carsList);
        });

        VehicleService.getDriversList().success(function (response) {
          $scope.driversList = response;
        });

        $(".driver-dropdown").on('click', 'li a', function(){
          $(".d-dropdown:first-child").text($(this).text());
          $(".d-dropdown:first-child").val($(this).text());
       });
       $(".car-dropdown").on('click', 'li a', function(){
         $(".v-dropdown:first-child").text($(this).text());
         $(".v-dropdown:first-child").val($(this).text());
      });

      $('.collapse').on('show.bs.collapse', function () {
          $('.collapse.in').collapse('hide');
      });

       $scope.getCarsDetails = function(car_id) {
         $scope.selectedCarId = car_id;
         $scope.carSelected = true;
         VehicleService.getCarInfo(car_id).success(function (response) {
           $scope.carDetails = response[0];
         });
       }

       $scope.getDriverDetails = function(driver_id) {
         $scope.selectedDriverId = driver_id;
         VehicleService.getDriverInfo(driver_id).success(function (response) {
           $scope.driverDetails = response[0];
         });
       }

       $scope.getAnalytics = function () {
         VehicleService.getAnalyticsData($scope.originPlace, $scope.destinationPlace, $scope.selectedCarId, $scope.selectedDriverId, $scope.zipCode).success(function (response) {
           $scope.analyticsData = response[0];
           var data = [];
           data = response[0].evStation;
           $scope.stationData = data;
           console.log($scope.stationData);
           $scope.showAnalytics = true;
         });
       }
    }]);
});
