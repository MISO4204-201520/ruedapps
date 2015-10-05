/**
 * Created by Lina8a on 30/09/2015.
 */

app.directive('login', function(){
    return{
        restrict:'E',
        templateUrl:'views/authentication/login.html',
        controller: ['$scope', '$http', function($scope, $http){
            $scope.login.login = function () {
                if($scope.form.$valid) {
                    var post = {
                        method: 'POST',
                        url: 'http://localhost:8080/crud-web/authentication/login',
                        headers: { 'Content-Type': 'application/json' },
                        data: { email: $scope.user.email, password: $scope.user.password }
                    }

                    $http(post).success(function (data) {
                        sessionStorage.setItem("Auth-JWT", data);
                        $scope.auth.isAuthenticated = true;
                        console.log($scope.auth.isAuthenticated)
                        $scope.getPeople();
                    }).error(function (err) {
                        console.log("Error: " + $scope.view + err);
                    });
                }
            }

        }],
        controllerAs:'login'
    };
});

app.directive('register', function(){
    return{
        restrict:'E',
        templateUrl:'views/authentication/register.html',
        controller: ['$scope', '$http', function($scope, $http){
            $scope.register.register = function () {
                if($scope.form.$valid) {
                    var post = {
                        method: 'POST',
                        url: 'http://localhost:8080/crud-web/authentication/register',
                        headers: { 'Content-Type': 'application/json' },
                        data: { firstName: $scope.user.firstName, lastName: $scope.user.lastName, gender: $scope.user.gender, email: $scope.user.email, password: $scope.user.password }
                    }

                    $http(post).success(function (data) {
                        $scope.login();
                    }).error(function (data) {
                        console.log("Error: " + $scope.view);
                    });
                }
            }

        }],
        controllerAs:'register'
    };
});

app.directive('logout', function(){
    return{
        restrict:'E',
        templateUrl:'views/authentication/logout.html',
        controller: ['$scope', '$http', function($scope, $http){
            $scope.logout = function () {
                sessionStorage.removeItem("Auth-JWT");
                $scope.auth.isAuthenticated = false;
                console.log($scope.auth.isAuthenticated);
                $scope.login();
            }
        }],
        controllerAs:'logout'
    };
});