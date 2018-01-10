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
      $location.url("/");
    });
  }
});

// controller of creating new events
app.controller("CreateCtrl", function($scope, $http, $rootScope, $location, $q) {

  // initial value for button state
  $scope.createBtnState = false;

  // check if cbox confirmed
  $scope.toggleSelection = function(event) {
    // enable create button if true
    // otwherwise disable button
    if (event.target.checked) {
      $scope.createBtnState = true;
    } else {
      $scope.createBtnState = false;
    }
};

  // check photo url for validity
  var isImage = (url) => {
    let deferred = $q.defer();
    let s = document.createElement("IMG");
    s.src = url;
    s.type = "image";
    s.onerror = () => { deferred.resolve(false); };
    s.onload  = () => { deferred.resolve(true) };
    return deferred.promise;
  };

  // create a new event
  $scope.create = function(user) {

    // initial value for error
    $scope.createError = null;

    // check if the passwords match in validation
    // then send a post request for creation
    if (user.password == user.password2) {
      // check the photo validity
      isImage(user.photourl).then(function(val) {
        if (!val) {
          $scope.createError = "Invalid photo url!";
          return;
        }
      });
      // post the request to API
      $http.post('/create', user)
      // if succressful, redirect to event page
      .success(function(user) {
        $rootScope.currentUser = user;
        $location.url("/event");
      })
      // otherwise prompt error and type
      .error(function (error, status){
        $scope.createError = "Something went wrong!";
      });
  } else {
      $scope.createError = "Passwords don't match!"; // if passwords differ
  }
}
});

// controller for event-page and its' components
app.controller('EventCtrl', ['$scope', '$sce', '$rootScope',
  function($scope, $sce, $rootScope) {

  // trust the image resource so it can be shown
  $scope.eventPhotoUrl = $sce.trustAsResourceUrl($rootScope.currentUser.photourl);

  /*
  // hide photo element if there is no url
  if (!$rootScope.currentUser.photourl) {
    $("#photoElem").hide();
    $("#infoElem").attr('class', 'col-md-12');
  }
  */

  // parse date
  $scope.formatDate = function(date){
    var dateOut = new Date(date);
    return dateOut;
  };

//  google maps
//===========================================================================

  // geocoding to check validity of address
  $scope.checkAddr = function (address) {
      // get geocoder instance
      var geocoder = new google.maps.Geocoder();
      // geocode the address
      geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
            // return true if affress is valid
            return true;
            // return false if it's not
        } else return false;
    });
  };

  // some functionality for the google maps API
  $scope.googleAPIkey = "AIzaSyBHaI_RFoA7TLy7pXW2HbQMKSyOQ9WdLLo"; // private googlemapsAPI key
  $scope.addr = $rootScope.currentUser.location.replace(" ", "+"); // parse the event address for googlemapsAPI
  $scope.mapUrl = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/place?key="+$scope.googleAPIkey+"&q="+$scope.addr+"&zoom=16");


  // WebSocket for chat
  //=======================================================================================

  // initialize this for later use
  var eventName = $rootScope.currentUser.username;

  // initialize socket
  var ws = new WebSocket("ws://" + window.location.hostname + ":8080");

  // once connected, fetch current events messages
  ws.onopen = function () {
    ws.send(JSON.stringify({
      type: 'loadMsg',
      event: eventName
    }));
  };

  // handle username setting and message sending
  $('form').submit(function() {
    var name = $('#name').val() ? $('#name').val() : 'Guest';
    $('#submitname').hide();
    $("#name").prop('disabled', true);
    ws.send(JSON.stringify({
      type: 'newMsg',
      event: eventName,
      name: name,
      message: $('#message').val()
    }));
    $('#message').focus();
    $('#message').val('');
    return false;
  });

  // listen for incoming messages, add them and scroll to bottom of element
  ws.onmessage = function(data) {
    $('#messages').append(data.data);
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
  };

  // show errors
  ws.onerror = function(evt) {
    $('#messages').append('<span style="color: red;">ERROR:</span> ' + evt.data);
  };
}]);