(function(){
'use strict';

var asApp = angular.module('asApp');
asApp.controller('tableCtrl', ['$scope', 
	'$location', 
	'$routeParams', 
	'$rootScope', 
	'socketService', 
	'loaderModalAPI',
	'toaster',
	'AvatarBuilder',
	'RondaSrv',
	'_',
	tableCtrl]);
function tableCtrl($scope, $location, $routeParams, $rootScope, socketService, loaderModalAPI, toaster, AvatarBuilder, RondaSrv, _){
	// Handle socket connexion

	var gameName = $routeParams.gameName;
	var roomNbr = $routeParams.roomNbr;
	var routeTable = $routeParams.routeTable;
	var base = $rootScope.base;
	var	channel = '/' + gameName + '/' + roomNbr + '/' + routeTable;
	var url = base + channel;

	var mySocket = new socketService($scope, base, channel, url);
	mySocket.connectSocket();

	$scope.$on('$destroy', function(){
		mySocket.disconnectSocket();
	});

	$scope.gameName = gameName;
	$scope.roomNbr = roomNbr;
	$scope.routeTable = routeTable;

	/*
	* Events
	*/

	loaderModalAPI.show();
	mySocket.on('table:initialized', function(data){
		$scope.user 					= data.user;
		$scope.user.myIndexPlayer 		= -1;
		$scope.game 					= new RondaSrv(data.table, data.stateGame, data.specs, data.players, data.packLength, data.tapis, data.scores, data.winner);
		$scope.messages = data.messages;
		$scope.user.monDecalage = 0;//Initialiser le decalage

		loaderModalAPI.hide();
	});

	$scope.getAvatarUrl = function(user){
		return AvatarBuilder.getProfilePic(user, 60);
	}



	/*
	* handle specs
	*/

	mySocket.on('spec:new', function(spec){
		$scope.game.newSpec(spec);
	});

	mySocket.on('user:left', function(id){
		$scope.game.userLeft(id);
	});

	mySocket.on('spec:placeTaked', function(data){
		$scope.game.specTakePlace(data.id, data.indexPlace, function(err, enoughPlayers){
			if(!err){
				if(enoughPlayers){
					if($scope.game.gameAlreadyStarted())
						$scope.game.resumeGame();
					else
						$scope.game.startGame();
				}
			}
		});
	});

	$scope.takePlace = function(index){
		mySocket.emit('spec:takePlace', {index: index}, function(err, gameAlreadyStarted, hand){
			if(!err){
				$scope.game.specTakePlace($scope.user.id, index, function(err, enoughPlayers){
					if(!err){
						//changer la valeur du decalage
						$scope.user.monDecalage = index;
						$scope.user.myIndexPlayer = index;

						if(gameAlreadyStarted)
							$scope.game.players.players[index].setHand(hand);


						if (enoughPlayers){
							if($scope.game.gameAlreadyStarted())
								$scope.game.resumeGame();
							else
								$scope.game.startGame();
						}
					}
				});
			}
			else
				alert("Une erreur a été survenue");
		});
	};

	/*
	* handle game
	*/
	$scope.mesRondas = [];
	$scope.$watch('game.players.players', function(){
		if($scope.user && $scope.game && $scope.game.players.players && $scope.user.myIndexPlayer >= 0){
			$scope.game.players.players[$scope.user.myIndexPlayer].getRondas(function(rondas){
				if(rondas && rondas.length >= 1){
					if(rondas.length == 1){
						$scope.mesRondas = _.filter(rondas, function(ronda){ return $scope.game.ronda.hasRonda([ronda.val, ronda.val], ronda.type, $scope.user.myIndexPlayer, $scope.game.players.players[$scope.user.myIndexPlayer].hand); });
					}
					else if(rondas.length == 2){
						$scope.mesRondas = _.filter(rondas, function(ronda){ return $scope.game.ronda.hasRonda([ronda.val], 'RONDA', $scope.user.myIndexPlayer, $scope.game.players.players[$scope.user.myIndexPlayer].hand); });
					}
				}
			});
		}
	}, true);
	$scope.packLength = 0;
	$scope.$watch('game.pack.pack', function(){
		if($scope.game && $scope.game.pack){
			$scope.packLength = $scope.game.pack.pack.length;
		}
		else
			$scope.packLength = 0;
	}, true);

	$scope.deal = function(indexPlayer){
		if($scope.game.stateGame.waiting || $scope.game.pack.pack.length <= 0 || !$scope.game.finTour() || $scope.game.stateGame.indexDealer != indexPlayer)
			return;

		mySocket.emit('dealer:deal', {}, function(err){
			if(err) return alert("erreur");
		});
	}

	mySocket.on('dealer:deal', function(){
		mySocket.emit('player:cards:ask', {}, function(spec, data){
			$scope.game.players.playerExist($scope.user.id, function(yes, indexPlayer){
				if(yes && !spec){
					for (var i = 0; i < $scope.game.nbrPlayers; i++) {
						if(i != indexPlayer){
							$scope.game.players.players[i].addFakeCardsToHand(data.hand.length);
						}
					};
					$scope.game.players.players[indexPlayer].hand = data.hand;
					$scope.game.dealCards();
				}
				else if(!yes && spec){
					for (var i = 0; i < $scope.game.nbrPlayers; i++) {
							$scope.game.players.players[i].addFakeCardsToHand(data.handLength);
					};
					$scope.game.dealCards();
				}
				else alert("Une erreur a été survenue, veuillez réessayer ou actualiser la page.");

			});
		});
	});

	$scope.ImPlaying = function(){
		return $scope.game.players.playerExist($scope.user.id, function(exist){
			return exist;
		});
	}

	$scope.play = function(indexPlayer, indexCardPlayed){
		$scope.game.play(indexPlayer, indexCardPlayed, null, function(err){
			if(err) return;
			mySocket.emit('player:play', indexCardPlayed, function(err){
				if(err) return alert("Une erreur a été survenue, veuillez réessayer ou actualiser la page.");
			});	
		});
	}

	mySocket.on('player:play', function(data){
		$scope.game.play(data.indexPlayer, data.indexCardPlayed, data.cardPlayed, function(err){
			if(err) return alert("Une erreur a été survenue, veuillez réessayer ou actualiser la page.");
		});
	});

	mySocket.on('tour:fin', function(data){
		if($scope.game.finTour()){
			$scope.game.ronda.initialize($scope.game.nbrPlayers, data.rondas);
        	$scope.game.finaliserTour();
		}
		else
			alert("Une erreur a été survenue, veuillez réessayer ou actualiser la page.");
	});

	$scope.haveRonda = function(){
		return ($scope.mesRondas.length >= 1) && ($scope.mesRondas[0].type == 'RONDA' || $scope.mesRondas[0].type == 'RONDA_2');
	}

	$scope.haveTringa = function(){
		return ($scope.mesRondas.length == 1) && ($scope.mesRondas[0].type == 'TRINGA' || $scope.mesRondas[0].type == 'RONDA_2');
	}

	$scope.haveRonda2 = function(){
		return ($scope.mesRondas.length == 1 && $scope.mesRondas[0].indice.length == 4) || ($scope.mesRondas.length == 2);
	}

	$scope.declareRonda = function(type){
		var cardValue = [];
		switch(type){
			case "RONDA":
				if($scope.mesRondas.length == 1){
					cardValue.push($scope.mesRondas[0].val);
					$scope.mesRondas = [];
				}
				//declarer la ronda la plus grande
				else if($scope.mesRondas.length == 2){
					if($scope.mesRondas[0].val > $scope.mesRondas[1].val){
						cardValue.push($scope.mesRondas[0].val);
						$scope.mesRondas.shift();
						$scope.mesRondas[0].type = 'RONDA';
					}
					else{
						cardValue.push($scope.mesRondas[1].val);
						$scope.mesRondas.pop();
						$scope.mesRondas[0].type = 'RONDA';
					}
				}
			break;
			case "TRINGA":
				cardValue.push($scope.mesRondas[0].val);
				$scope.mesRondas = [];
			break;
			case "RONDA_2":
				if($scope.mesRondas.length == 1){
					cardValue.push($scope.mesRondas[0].val);
					cardValue.push($scope.mesRondas[0].val);
				}
				//2 val diff
				else if($scope.mesRondas.length == 2){
					cardValue.push($scope.mesRondas[0].val);
					cardValue.push($scope.mesRondas[1].val);
				}
				$scope.mesRondas = [];
			break;
		}
		if(!$scope.game.ronda.existInHand(cardValue, type, $scope.user.myIndexPlayer, $scope.game.players.players[$scope.user.myIndexPlayer].hand))
			return;

		else{
			mySocket.emit('player:rondas:declare', {
				cardValue: cardValue,
				type: type
			}, function(err){
				if(err) return alert("Une erreur a été survenue, veuillez réessayer ou actualiser la page.");
			});	
			if(type == "RONDA_2") toaster.pop("info", "Vous avez déclaré RONDA*2 de (" + cardValue[0] + ", " + cardValue[1] + ")");
			else toaster.pop("info", "Vous avez déclaré " + type + " de " + cardValue[0]);
		}
	}

	mySocket.on('player:rondas:declare', function(data){
		if(data.type == "RONDA_2")
			toaster.pop("info", $scope.game.players.players[data.indexPlayer].name + " a déclaré RONDA*2");
		else
			toaster.pop("info", $scope.game.players.players[data.indexPlayer].name + " a déclaré " + data.type);

		$scope.game.ronda.setRonda(data.indexPlayer, [], data.type);
	});

	$scope.highlightRonda1 = function(indexPlayer, indexCard){
		if(indexPlayer == $scope.user.myIndexPlayer){
			if($scope.mesRondas.length > 0){
				if(_.indexOf($scope.mesRondas[0].indice, indexCard, true) >= 0)
					return true;
			}
		}
	}

	$scope.highlightRonda2 = function(indexPlayer, indexCard){
		if(indexPlayer == $scope.user.myIndexPlayer){
			if($scope.mesRondas.length > 1){
				if(_.indexOf($scope.mesRondas[1].indice, indexCard, true) >= 0)
					return true;
			}
		}
	}

	$scope.declareBluff = function(type){
	}


	

	/*
	* handle Chat
	*/
	$scope.chatIsCollapsed = true;
	mySocket.on('msg:new', function(msg){
		msg.date = new Date();
		$scope.messages.push(msg);
	});

	$scope.sendMsg = function(msgAenvoyer){
		if(!msgAenvoyer || msgAenvoyer == "")
			return;		
		mySocket.emit('msg:new', msgAenvoyer);
		$scope.messages.push({
			senderUsername: $scope.user.name,
			msg: msgAenvoyer,
			date: new Date()
		});
		$scope.msg = "";
	};

}
})();

