(function () {
    'use strict';

    angular
        .module('easyrateApp')
        .factory('UserService', UserService);

    UserService.$inject = ['$http',  '$q'];
    function UserService($http, $q) {
        var service = {};

        service.GetProductList = GetProductList;
        service.GetProductDetailById=GetProductDetailById;
        service.GetProductDetailImageById=GetProductDetailImageById;
        service.PostProductReviewById=PostProductReviewById;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUserEmail = GetByUserEmail;
        service.Create = Create;
        service.Reset = Reset;
        service.Forgot=Forgot;
        service.Update = Update;
        service.Delete = Delete;


        return service;
        function GetProductList(searchingText) {
            return $http.post('/getProductList/' + searchingText).then(handleSuccess, handleError('Error getting product by searchingText'));
        }
        function GetProductDetailImageById(id) {
            return $http.post('/GetProductDetailImageById/' + id).then(handleSuccess, handleError('Error getting product image by id'));
        }
        function GetProductDetailById(id) {
            return $http.post('/GetProductDetailById/' + id).then(handleSuccess, handleError('Error getting product by id'));
        }
       
        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
        }
        function GetById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUserEmail(email) {
            return $http.get('/getDataByEmail/' + email).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
            var deferred = $q.defer();
            $http({

                method: 'POST',
                url: '/api/usersCreate',
                data: 'PASSWORD=' + user.PASSWORD + '&USERNAME=' + user.USERNAME + '&E_MAIL=' + user.eMail,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (respond) {
                deferred.resolve({success: true});
                // if success
                console.log(respond);
            }, function (error) {
                // if an error
                deferred.resolve({success: false, message: error.data});
                console.error(error);
            });
            return deferred.promise;
        }
            function PostProductReviewById(addReview) {
                

                var deferred = $q.defer();
                $http({

                    method: 'POST',
                    url: '/PostProductReviewById/',
                    data:'review=' + addReview.review+'&userId='+addReview.userId+'&productId='+addReview.productId+'&like='+addReview.like+'&disLike='+addReview.disLike+'&curRate='+addReview.rating+'&status='+addReview.status,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function(respond){
                    deferred.resolve({ success: true });
                    // if success
                    console.log(respond);
                }, function(error){
                    // if an error
                    deferred.resolve({ success: false ,message:error.data });
                    console.error(error);
                });
                return deferred.promise;
            }

        function Reset(password,confirm,token) {
            var deferred = $q.defer();
            $http({

                method: 'POST',
                url: '/reset/'+token,
                data:
                'PASSWORD=' + password +'&CONFIRM_PASSWORD='+confirm,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function(respond){
                deferred.resolve({ success: true,message:respond.data });
                // if success
                console.log(respond);
            }, function(error){
                // if an error
                deferred.resolve({ success: false,message:error.data  });
                // console.error(error);
            });
            return deferred.promise;
         }
        function Forgot(email) {
            var deferred = $q.defer();
            $http({

                method: 'POST',
                url: '/api/sendemail/',
                data:
                'email=' + email ,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function(respond){
                deferred.resolve({ success: true ,message:respond.data});
                // if success
                console.log(respond);
            }, function(error){
                // if an error
                deferred.resolve({ success: false,message:error.data });
                console.error(error);
            });
            return deferred.promise;
        }
        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
