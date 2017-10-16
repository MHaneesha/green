define(['angular', './sample-module'], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('DashboardsCtrl', ['$scope','VehicleService', function ($scope, VehicleService) {

       var mapOptions = {
          zoom: 4,
          center: new google.maps.LatLng(40.0000, -98.0000),
          mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        //$scope.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        $scope.carSelected = false;
        VehicleService.getCarsList().success(function (response) {
          $scope.carsList = response;
        });

        $(".collapse.in").each(function(){
        	$(this).siblings(".panel-heading").find(".glyphicon").addClass("glyphicon-minus").removeClass("glyphicon-plus");
        });

        // Toggle plus minus icon on show hide of collapse element
        $(".collapse").on('show.bs.collapse', function(){
        	$(this).parent().find(".glyphicon").removeClass("glyphicon-plus").addClass("glyphicon-minus");
        }).on('hide.bs.collapse', function(){
        	$(this).parent().find(".glyphicon").removeClass("glyphicon-minus").addClass("glyphicon-plus");
        });

        $(".dropdown-menu").on('click', 'li a', function(){
          $(".v-dropdown:first-child").text($(this).text());
          $(".v-dropdown:first-child").val($(this).text());
       });

       $scope.getCarsDetails = function(car_id) {
         $scope.carSelected = true;
         VehicleService.getCarInfo(car_id).success(function (response) {
           $scope.carDetails = response[0];
         });
       }
    }]);
});
