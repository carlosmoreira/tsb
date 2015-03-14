/**
 * Created by carlos on 3/11/15.
 */

var app = angular.module("bfApiApp", []);


app.controller('playerCtrl', ['players', '$scope', '$log', '$http',
    function (players, $scope, $log, $http) {
        $scope.playersLoading = true;

        players.all().then(function(data){
            $scope.players = data;
            $scope.playersLoading = false;
            $log.info(data);
        });

        $scope.player;
        $scope.playerGamertag = "xfatal9x";


        $scope.getPlayerData = function (playerGamertag) {


            $http.get("http://api.bf4stats.com/api/playerInfo?plat=ps4&name=" + playerGamertag + "&opt=stats").then(
                function (data) {
                    $scope.player = data.data;
                    $log.info(data.data);
                },
                function () {
                    $log.warn('getPlayerData API Call FAIL');
                }
            );


        };


        $scope.setImage = function (imageUrl) {
            $scope.mainImageUrl = imageUrl;
        };
    }]);


app.filter('millSecondsToTimeString', function() {
    return function(secs) {
        return Math.floor(secs / (60 * 60));
    }
});

app.filter('getKD', function($log) {
    return function(kills, deaths) {
        $log.debug(kills, deaths);
        return deaths/kills;
    }
});

app.service('players', ['$http', '$log', '$q', function ($http, $log, $q) {
    var self = this;

    var get = function (gamerTag) {
        var deferred = $q.defer();

        $http.get("http://api.bf4stats.com/api/playerInfo?plat=ps4&name=" + gamerTag + "&opt=stats")
            .success(deferred.resolve)
            .error(deferred.reject);

        return deferred.promise;
    };

    var all = function () {
        var tsbPlayers = ["xFatal9x", "dirkafish", "tripledvine", "Ert11", "jd_31481", "illusiveN7"];
        var playersPromise = [];

        tsbPlayers.forEach(function (gamerTag) {
            playersPromise.push(get(gamerTag));
        });

        return $q.all(playersPromise);
    };




    return {
        all: all,
        get: get

    }
}]);

