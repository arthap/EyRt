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

        function setUserData (data){
            myData.push(data);
        };

         function getUserData(){
            return  myData[0];
        };
        function ClearData() {
            myData=[];
        }

    }
})();