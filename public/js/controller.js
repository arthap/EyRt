/**
 * Created by Hayarpi on 6/1/2016.
 */
'use strict';

/* Controllers */
var easyrateApp = angular.module('easyrateApp', ['ngRoute', 'ngResource','ngCookies']);

/* Config */
easyrateApp.config([
	'$routeProvider', '$locationProvider',
	function($routeProvide, $locationProvider){
		$routeProvide
			.when('/',{
				templateUrl:'template/home.html',
				controller:'easyRateListCtrl',
				controllerAs: 'vm'
			})
			.when('/about',{
				templateUrl:'template/about.html',
				controller:'AboutCtrl'
			})
			.when('/contact',{
				templateUrl:'template/contact.html',
				controller:'ContactCtrl'
			})
			.when('/signIn',{
				templateUrl:'template/singIn.html',
				controller:'SingInCtrl',
				controllerAs: 'vm'
			})
			.when('/register',{
				templateUrl:'template/register.html',
				controller:'RegisterCtrl',
				controllerAs: 'vm'
			})
			.when('/forgot',{
				templateUrl:'template/forgot.html',
				controller:'ForgotCtrl',
				controllerAs: 'vm'
			})
			.when('/userPage',{
				templateUrl:'template/userPage.html',
				controller:'UserPageCtrl',
				controllerAs: 'vm'
			})
			.when('/reset/:tokenId', {
				templateUrl:'template/reset.html',
				controller:'ResetCtrl',
				controllerAs: 'vm'
			})
			.when('/phones/:phoneId', {
				templateUrl:'template/phone-detail.html',
				controller:'PhoneDetailCtrl',
				controllerAs: 'vm'
			})
			.otherwise({
				redirectTo: '/'
			});
	}
]);

run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
function run($rootScope, $location, $cookieStore, $http) {
	// keep user logged in after page refresh
	$rootScope.globals = $cookieStore.get('globals') || {};
	if ($rootScope.globals.currentUser) {
		$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
	}

	$rootScope.$on('$locationChangeStart', function (event, next, current) {
		// redirect to login page if not logged in and trying to access a restricted page
		var restrictedPage = $.inArray($location.path(), ['/signIn', '/register','/forgot','/reset/:tokenId','/','/userPage','/phones/:phoneId]']) === -1;
		var loggedIn = $rootScope.globals.currentUser;
		if (restrictedPage && !loggedIn) {
			$location.path('/');
		}
	});
}

/* Factory */
easyrateApp.factory('Phone', [
	'$resource', function($resource) {
		return $resource('phones/:phoneId.:format', {
			phoneId: 'phones',
			format: 'json',
			apiKey: 'someKeyThis'
			/* http://localhost:8888/phones/phones.json?apiKey=someKeyThis */
		}, {
			// action: {method: <?>, params: <?>, isArray: <?>, ...}
			update: {method: 'PUT', params: {phoneId: '@phone'}, isArray: true}
		});
		//Phone.update(params, successcb, errorcb);
	}
]);

/* Filter */
easyrateApp.filter('checkmark', function() {
	return function(input) {
		return input ? '\u2713' : '\u2718';
	}
});

easyrateApp.controller('easyRateListCtrl',[
	'$scope','$http', '$location', 'Phone','$cookieStore','UserService',
	function($scope, $http, $location, Phone,$cookieStore,UserService) {

		Phone.query({phoneId: 'phones'}, function (data) {
			$scope.phones = data;
		});
		$scope.searchingText = ""
		$scope.searching = function(searchingText){

			UserService.GetProductList($scope.searchingText)
				.then(function (user) {
					if (user !== null) {
						$scope.getProductList = user;

					} else {

					}
				});

		}

		// $scope.userData={};
		//
		// if($cookieStore.get('globals')===undefined){
		//     UserModelService.setUser($cookieStore.get('globals').currentUser);
		//     $scope.userData= $cookieStore.get('globals').currentUser;
		// $scope.user =$scope.userData.username;}
		//Phone.query(params, successcb, errorcb)

		//Phone.get(params, successcb, errorcb)

		//Phone.save(params, payloadData, successcb, errorcb)

		//Phone.delete(params, successcb, errorcb)

	}
]);

/* About Controller */
easyrateApp.controller('AboutCtrl',[
	'$scope','$http', '$location',
	function($scope, $http, $location) {

	}
]);


/* Contact in Controller */
easyrateApp.controller('ContactCtrl',[
	'$scope','$http', '$location',
	function($scope, $http, $location) {

	}
]);

/* Sing in Controller */
easyrateApp.controller('SingInCtrl',[
	'$scope','$http', '$location', 'AuthenticationService','FlashService',
	function($scope, $http, $location, AuthenticationService, FlashService) {
		var vm = this;

		vm.login = login;

		(function initController() {
			// reset login status
			AuthenticationService.ClearCredentials();
		})();

		function login() {
			vm.dataLoading = true;
			AuthenticationService.Login(vm.email, vm.password, function (response) {
				if (response.success) {
					AuthenticationService.SetCredentials( vm.password,vm.email);
					$location.path('/');
				} else {
					FlashService.Error(response.message);
					vm.dataLoading = false;
				}
			});
		};
	}
]);
/* Registration Controller */
easyrateApp.controller('RegisterCtrl',[
	'$scope','$http', '$location', 'AuthenticationService','FlashService','UserService',
	function($scope, $http, $location, AuthenticationService, FlashService,UserService) {
		var vm = this;

		vm.register = register;
 
		function register() {
			vm.dataLoading = true;
			UserService.Create(vm.user)
				.then(function (response) {
					if (response.success) {
						FlashService.Success('Registration successful', true);
						$location.path('/login');
					} else {
						FlashService.Error(response.message);
						vm.dataLoading = false;
					}
				});
		}
	}

]);
/* Forgot Password Controller */
easyrateApp.controller('ForgotCtrl',[
	'$scope','$http', '$location', 'AuthenticationService','FlashService','UserService',
	function($scope, $http, $location, AuthenticationService, FlashService,UserService) {
		var vm = this;
        $scope.message=false;
		$scope.errorMsg=false;
		vm.forgot = forgot;

		function forgot() {
			$scope.message=false;
			$scope.errorMsg=false;
			vm.dataLoading = true;
			UserService.Forgot(vm.email)
				.then(function (response) {
					if (response.success) {
						// FlashService.Success('Forgot successful', true);
						// $location.path('/login');
						 $scope.message=true;
						$scope.notification=response.message;
						vm.dataLoading = false;
					} else {
						FlashService.Error(response.message);

						$scope.errorMsg=true;
						$scope.notification=response.message;
						vm.dataLoading = false;
					}
				});
		}
	}

]);
/* Reset Password Controller */
easyrateApp.controller('ResetCtrl',[
	'$scope','$http', '$location', 'AuthenticationService','FlashService','UserService','$routeParams',
	function($scope, $http, $location, AuthenticationService, FlashService,UserService,$routeParams) {
		var vm = this;
		var tokenId = $routeParams.tokenId;
		$scope.inputType = 'password';
		$scope.hideShowPassword = function(){
			if ($scope.inputType == 'password')
				$scope.inputType = 'text';
			else
				$scope.inputType = 'password';
		};
	


		$scope.message=false;
		$scope.errorMsg=false;
		vm.reset = reset;

		function reset() {
			
			
			$scope.err=false;
			$scope.resp=false;
			
			vm.dataLoading = true;
			UserService.Reset(vm.password,vm.password_confirm,tokenId)
				.then(function (response) {
					if (response.success) {
						// FlashService.Success('Forgot successful', true);
						// $location.path('/login');
					
						$scope.resp=true;
						$scope.message=response.message;
						 
						vm.dataLoading = false;
					} else {
						// FlashService.Error(response.message);
						$scope.err=true;
					
						$scope.message=response.message;
						vm.dataLoading = false;
					}
				});
		}
	}

]);
/* User Page in Controller */
easyrateApp.controller('UserPageCtrl',[
	'$scope','$rootScope', '$cookieStore','$http', '$location', 'AuthenticationService','FlashService','UserService',
	function($scope,$rootScope,$cookieStore, $http, $location, AuthenticationService, FlashService,UserService) {
		var vm = this;
		vm.userdata = $cookieStore.get('globals').currentUser;
		vm.user=vm.userdata.username
		// =$rootScope.globals.currentUser.username;
		// console.log($rootScope.globals);
		console.log(vm.user);
		vm.login = login;



		function login() {
			UserService.GetByUserEmail(vm.userdata.email)
				.then(function (user) {
					if (user !== null ) {
						vm.userData=user[0];

					} else {

					}

				});
		};
	}
]);
/* Phone Detail Controller */
easyrateApp.controller('PhoneDetailCtrl',[
	'$scope','$http', '$location', '$routeParams', 'Phone','UserService',
	function($scope, $http, $location, $routeParams, Phone,UserService) {
		$scope.phoneId = $routeParams.phoneId;

		Phone.get({phoneId: $routeParams.phoneId}, function(data) {
			$scope.phone = data;
			$scope.mainImageUrl = data.images[0];
			//data.$save();
		});

		$scope.setImage = function(imageUrl) {
			$scope.mainImageUrl = imageUrl;
		}
		$scope.rating;
		$scope.active='active'
		$scope.active1='';
		$scope.active2='';
		$scope.active3='';
		$scope.hidden =false;
		$scope.hidden1 =true;
		$scope.hidden2 =true;
		$scope.hidden3 =true;


		UserService.GetProductDetailById($routeParams.phoneId)
			.then(function (productDetailById) {
				if (productDetailById.length >0) {
					$scope.getProductDetailList = productDetailById;

				} else {

				}
			});
		UserService.GetProductDetailImageById($routeParams.phoneId)
			.then(function (productImageById) {
				if (productImageById.length >0) {
					$scope.getProductDetaiImagelList = productImageById;
					$scope.mainImageUrl =  $scope.getProductDetaiImagelList[0].RESOURCE;
				} else {

				}
			});


	}
]);


