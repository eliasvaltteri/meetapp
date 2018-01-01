// controller for navigation including login
app.controller("NavCtrl", function($rootScope, $scope, $http, $location) {

  // initial value
  $scope.loginError = null;

  // login post request and handling success/failure
  $scope.login = function(user) {
    $http.post('/login', user)
    .success(function(response) {
      $rootScope.currentUser = response;
      $location.url("/event");
    })
    .error(function (error, status){
      $scope.loginError = "Wrong event name/password!";
    });
  }
  // logout post request
  $scope.logout = function() {
    $http.post("/logout")
    .success(function() {
      $rootScope.currentUser = null;
      $location.url("/home");
    });
  }
});

// controller of creating new events
app.controller("CreateCtrl", function($scope, $http, $rootScope, $location) {

  // initial value for button state
  $scope.createBtnState = false;

  // check if cbox confirmed
  $scope.toggleSelection = function toggleSelection(event) {
    // enable create button if true
    // otwherwise disable button
    if (event.target.checked) {
      $scope.createBtnState = true;
    } else {
      $scope.createBtnState = false;
    }
  };

  // create a new event
  $scope.create = function(user) {

    // initial value for error
    $scope.createError = null;

    // check if the passwords match in validation
    // then send a post request for creation
    if (user.password == user.password2) {
      $http.post('/create', user)
      // if succressful, redirect to event page
      .success(function(user) {
        $rootScope.currentUser = user;
        $location.url("/event");
      })
      // otherwise prompt error and type
      .error(function (error, status){
        $scope.createError = `Something went wrong! ({error})`;
      });
    } else {
      $scope.createError = "Passwords don't match!"; // if passwords differ
    }
  }
});

// parse and set the address for google maps embed
// also allow location to be used in google maps API url with sce
app.controller('MapCtrl', ['$scope', '$sce', '$rootScope',
 function($scope, $sce, $rootScope) {
  $scope.googleAPIkey = "AIzaSyBHaI_RFoA7TLy7pXW2HbQMKSyOQ9WdLLo"; // private googlemapsAPI key
  $scope.addr = $scope.currentUser.location.replace(" ", "+"); // parse the event address for googlemapsAPI
  $scope.mapUrl = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/place?key="+$scope.googleAPIkey+"&q="+$scope.addr+"&zoom=16");
}]);