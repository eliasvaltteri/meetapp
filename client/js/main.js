// route config for front-end
var app = angular.module("meetApp", ["ngRoute"]);
app.config(function($routeProvider) {
  // routes
  $routeProvider
  .when('/home', {
    templateUrl: 'views/home.html'
  })
  .when('/create', {
    templateUrl: 'views/create.html',
    controller: 'CreateCtrl'
  })
  .when('/event', {
    templateUrl: 'views/event.html',
    controller : 'EventCtrl',
    resolve: {
      logincheck: checkLoggedin
    }
  })
  .otherwise({
    redirectTo: '/home'
  })
});

// function to check if user is logged in
var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {

  // new instance of deferred
  var deferred = $q.defer();

  $http.get('/loggedin').success(function(user) {
    $rootScope.errorMessage = null;
    if (user !== '0') { // if user is logged in
      $rootScope.currentUser = user;
      deferred.resolve();
    } else { // if user is not logged in
      $rootScope.errorMessage = 'You need to log in.';
      deferred.reject();
      $location.url('/home');
    }
  });
  return deferred.promise;
}
