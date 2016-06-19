(function () {
    'use strict';

    angular
        .module('easyrateApp')
        .factory('UserDataService', UserDataService);

    UserDataService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout', 'UserService'];
    function UserDataService($http, $cookieStore, $rootScope, $timeout, UserService) {

        var service = {};
        var myData = [];

        service.setUserData = setUserData;
        service.getUserData = getUserData;
        service.ClearData=ClearData;
        return service;


        function setUserData (){
            $rootScope.globals = $cookieStore.get('globals') || {};
            if ($rootScope.globals.currentUser) {
                myData.push($cookieStore.get('userData').currentUser);}
        };

        function getUserData(){
            return  myData[0];
        };
        function ClearData() {
            myData=[];
        }

    }
})();