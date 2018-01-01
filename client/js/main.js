var app = angular.module("meetApp", ["ngRoute"]);

app.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/home.html'
  })
  .when('/create', {
    templateUrl: 'views/create.html',
    controller: 'CreateCtrl'
  })
  .when('/event', {
    templateUrl: 'views/event.html',
    controller : 'MapCtrl',
    resolve: {
      logincheck: checkLoggedin
    }
  })
  .otherwise({
    redirectTo: '/'
  })
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {

  var deferred = $q.defer();

  $http.get('/loggedin').success(function(user) {
    $rootScope.errorMessage = null;
    //User is Authenticated
    if (user !== '0') {
      $rootScope.currentUser = user;
      deferred.resolve();
    } else { //User is not Authenticated
      $rootScope.errorMessage = 'You need to log in.';
      deferred.reject();
      $location.url('/');
    }
  });
  return deferred.promise;
}
