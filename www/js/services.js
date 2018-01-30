angular.module('sportsApp.services', ['ngResource'])
.constant('baseURL', 'http://gd2.mlb.com/components/game/mlb/')

.factory('matchFactory', ['$resource', 'baseURL', function($resource, baseURL){
    return $resource(baseURL+'year_:year/month_:month/day_:day/master_scoreboard.json');
}]);