angular.module('sportsApp.controllers', [])

.controller('homeController',['$scope', 'matchFactory', function($scope, matchFactory) {

	$scope.games = [];
	$scope.current_date = '2014-04-06';
	$scope.next_day = '';
	$scope.previos_day = '';
	$scope.loading = true;
	$scope.setDay = new Date($scope.current_date);
	var currentMatch,
		favorite_team = "Toronto Blue Jays";

	$scope.goNextDay = function(){
		$scope.matches = $scope.setMatches(moment($scope.current_date).add(1, 'days'));
	}

	$scope.goPreviousDay = function(){
		$scope.matches = $scope.setMatches(moment($scope.current_date).subtract(1, 'days'));
	}

	$scope.goToDay = function(date){
		$scope.matches = $scope.setMatches(moment(date.setDay));
	} 

	$scope.formatCurrentDate = function(){
		return new Date($scope.current_date).toString().substring(0, 15);
	}

	$scope.setMatches = function(date){

		var day = date,
			date = moment(day, 'YYYY-MM-DD');

		$scope.games = [];
		$scope.current_date = date;
		$scope.loading = true;

		matchFactory.get({day: addZerotoDate(date.date()), 
						month: addZerotoDate(date.month() +	1), 
						year: date.year()})
		.$promise.then(function(data){
			if(data.data.games.game !== undefined ){
				$scope.message = '';
				if(data.data.games.game.length !== undefined){
					for (var i = data.data.games.game.length - 1; i >= 0; i--) {
						currentMatch = data.data.games.game[i];
						if(currentMatch.home_team_name == favorite_team || currentMatch.away_team_name == favorite_team ){
							$scope.unshift(processItem(data.data.games.game[i]));
						}else{
							$scope.games.push(processItem(data.data.games.game[i]));	
						}					
					}
				}else{
					$scope.games.push(processItem(data.data.games.game));
				}	
			}else{
				$scope.message = "No games today";
			}

			$scope.loading = false;
		}, function(err){
			$scope.message = "An error has ocurred with the server, please try again later ";
		});

	}

	var addZerotoDate = function(value){
		return (value < 10)?'0'+value:value;
	}

	var processItem = function(item){

		var temp = {
			home_team_name: item.home_team_name,
			away_team_name: item.away_team_name,
			status: item.status.status
		}

		if(item.linescore !== undefined){
			temp.home_score = item.linescore.r.home;	
			temp.away_score = item.linescore.r.away;
			temp.winner = (temp.home_score !== temp.away_score)?((temp.home_score > temp.away_score)?'winner_home':'winner_away'):'';
		}

		return temp;

	}

	$scope.setMatches($scope.current_date);
}]);