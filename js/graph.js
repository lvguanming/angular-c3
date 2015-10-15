var graphApp = angular.module('graphApp', ['graphApp.services']);
var services = angular.module('graphApp.services', []);
services.factory('dataService', [function() {
    function DataService() {
        var data = [];
        var numDataPoints = 60;
        var maxNumber = 200;
 
        this.loadData = function(callback) {
            if (data.length > numDataPoints) {
                data.shift();
            }
            data.push({"x":new Date(),"data1":randomNumber(),"data2":randomNumber()});
            callback(data);
        };
 
        function randomNumber() {
            return Math.floor((Math.random() * maxNumber) + 1);
        }
    }
    return new DataService();
}]);

graphApp.controller('GraphCtrl1', function ($scope) {
    $scope.chart = null;
     
    $scope.showGraph = function() {
        $scope.chart = c3.generate({
                bindto: '#chart2',
                data: {
                  columns: [
                    ['data1', 330, 200, 200, 400, 150, 250],
                    ['data2', 509, 220, 110, 140, 415, 225]
                  ]
                }
            });     
    }
});

graphApp.controller('GraphCtrl2', function ($scope) {
    $scope.chart = null;
    $scope.config={};
    $scope.config.data1="30, 200, 100, 200, 150, 250";
    $scope.config.data2="70, 30, 10, 240, 150, 125";
 
    $scope.typeOptions=["line","bar","spline","step","area","area-step","area-spline"];
 
    $scope.config.type1=$scope.typeOptions[0];
    $scope.config.type2=$scope.typeOptions[1];
 
 
    $scope.showGraph = function() {
        var config = {};
        config.bindto = '#chart3';
        config.data = {};
        config.data.json = {};
        config.data.json.data1 = $scope.config.data1.split(",");
        config.data.json.data2 = $scope.config.data2.split(",");
        config.axis = {"y":{"label":{"text":"Number of items","position":"outer-middle"}}};
        config.data.types={"data1":$scope.config.type1,"data2":$scope.config.type2};
        $scope.chart = c3.generate(config);     
    }
});


graphApp.controller('GraphCtrl3', ['$scope','$timeout','dataService',function ($scope,$timeout,dataService) {
    $scope.chart = null;
    $scope.config={};
 
    $scope.config.data=[];
 
    $scope.config.type1="spline";
    $scope.config.type2="spline";
    $scope.config.keys={"x":"x","value":["data1","data2"]};
 
    $scope.keepLoading = true;
 
    $scope.showGraph = function() {
        var config = {};
        config.bindto = '#chart4';
        config.data = {};
        config.data.keys = $scope.config.keys;
        config.data.json = $scope.config.data;
        config.axis = {};
        config.axis.x = {"type":"timeseries","tick":{"format":"%S"}};
        config.axis.label = "Time Series" ;
        config.axis.position = "outer-center" ;
        config.axis.y = {"label":{"text":"Number of items","position":"outer-middle"}};
        config.data.types={"data1":$scope.config.type1,"data2":$scope.config.type2};
        $scope.chart = c3.generate(config);     
    };

    $scope.startLoading = function() {
        $scope.keepLoading = true;
        $scope.loadNewData();
    };
     
    $scope.stopLoading = function() {
        $scope.keepLoading = false;
    };
     
    $scope.loadNewData = function() {
        dataService.loadData(function(newData) {
            var data = {};
            data.keys = $scope.config.keys;
            data.json = newData;
            $scope.chart.load(data);
            $timeout(function(){
                if ($scope.keepLoading) {
                    $scope.loadNewData()                
                }
            },500);            
        });
    }
}]);
