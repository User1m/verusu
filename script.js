$(function(){

  $(document).ready(function(){
    UIState.unauthenticated();
  });

  // var listners = {
  //   'onUserJoinRequest': onSessionUserJoinRequest,
  //   'onJoinApprove': onSessionJoinApprove
  // };

  var currentUser, userToken, UIState = {};

  $('#login-btn').on('click', function(event){
    event.preventDefault();

    var username = $("#uname").val();
    var password = $("#pass").val();

    currentUser = username;

    KandyAPI.login(
      "DAK9051d442c74f45cf886a57e64dd6ed38",
      username,
      password,
      function(results) {
        // console.log(results);
        // console.log("ID: "+ results.full_user_id);
        userToken = results.user_access_token;
        // $('#username').text(results.full_user_id);
        UIState.authenticated();
        UIState.sessionunavailable();
      },
      function (msg, code) {
        alert('Error loggin in:(' + code + '): ' + msg);
      });
  });


  $('#logout-btn').on('click', function(event){
    event.preventDefault();
      /** logout()
      logs user out of Kandy Platform
      */
      KandyAPI.logout();
      UIState.unauthenticated();
    });

  $("#create-session").on('click', function(){
    $("#create-info").removeClass("hidden");

    if(!$("#join-info").hasClass("hidden")){
      $("#join-info").addClass("hidden");
    }
  });

  $("#join-session").on('click', function(){
    $("#join-info").removeClass("hidden");

    if(!$("#create-info").hasClass("hidden")){
      $("#create-info").addClass("hidden");
    }
  });

  $("#create-game").on('click', function(){
    /** create(sessionConfig, success, failure) : Void
    Creates a new session. The creating user is the administrator.
    @params <object> sessionConfig, <function> success/failure
    */
    KandyAPI.Session.create(
    {
      session_type: $('#session-type').val(),
      user_first_name: $('#firstname').val(),
      user_last_name: $('#lastname').val()
    },
    function(result) {
      // console.log(result);
      $("#session-info").addClass("hidden");
      getOpenSessions();
      KandyAPI.Session.activate(result.session_id);
      alert('Session Created');
    },
    function(msg, code) {
      alert('Error creating session (' + code + '): ' + msg);
    }
    );
  });

  // Event handler for Get Open Sessions By ID Button
  $('#search-btn').on('click', function() {

    /** getInfoById(sessionId, success, failure) : Void Gets session details by session ID.
    @params <string> sessionId
    */
    KandyAPI.Session.getInfoById(
      $('#search-id').val(),
      function (result) {
        $('#session-status').text('Session info: ' + JSON.stringify(result));
      },
      function (msg, code) {
        $('#session-status').text('Error getting session info(' + code + '): ' + msg);
      }
      );
  });


  function getOpenSessions(){
    /** getOpenSessionsCreatedByUser(success, failure)
    Gets a list of all open sessions created by this user.
    @params <function> success/failure
    */
    KandyAPI.Session.getOpenSessionsCreatedByUser(function(result) {
      loadSessionList(result.sessions);
    },
    function(msg, code) {
      UIState.sessionsunavailable();
      alert('Error getting session info(' + code + '): ' + msg);
    });
  }

  // // Event handler for onUserJoinRequest event
  // function onSessionUserJoinRequest(notification) {
  //   currentSession.joined = true;
  //   UIState.sessionjoined();
  //   KandyAPI.Session.acceptJoinRequest(notification.session_id, notification.full_user_id);
  // }



  UIState.authenticated = function(){
    $("#login").addClass("hidden");
    $("#content").removeClass("hidden");
    $("#current-user").text(currentUser);
  };

  UIState.unauthenticated = function(){
   // $("#uname").text("");
   // $("#pass").text("");
   $("#login").removeClass("hidden");
   $("#content").addClass("hidden");
   $("#current-user").text("username");
 };

 UIState.sessionunavailable = function(){
  $("#create-info").addClass("hidden");
  $("#join-info").addClass("hidden");
  $("#session-controls").addClass("hidden");
};

UIState.sessionavailable = function(){

};

UIState.sessionleft = function(){

};

UIState.sessionjoin = function(){

};

UIState.cobrowsingstarted = function(){

};

UIState.cobrowsingstopped = function(){

};



});
