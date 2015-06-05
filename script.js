var currentUser, userToken, gameSession, createOrJoin, UIState = {};

$(function(){

  // window.onload = function(){
  //   console.log("Loaded");
  //   UIState.unauthenticated();
  // };

  $(document).ready(function(){
    UIState.unauthenticated();
  });

  // var listners = {
  //   'onUserJoinRequest': onSessionUserJoinRequest,
  //   'onJoinApprove': onSessionJoinApprove
  // };

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
    createOrJoin = 1;

    KandyAPI.Session.create(
    {
      session_type: $('#session-type').val(),
      user_first_name: $('#firstname').val(),
      user_last_name: $('#lastname').val()
    },
    function(result) {
      // console.log(result);
      $("#session-info").addClass("hidden");

      gameSession = result.session_id;
      // getOpenSessions();
      KandyAPI.Session.activate(result.session_id);
      emailFriend();

      $("#session-id").text("Your sessionID is "+gameSession+". Provide this ID to your friend so they can join your game.");

      UIState.sessionavailable();

      alert('Session Created. Enable popups to send an email to your friend\'s email');
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
    createOrJoin = 2;

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


  function emailFriend(){
    var emailTo = $("#friends-email").val();
    window.open("mailto:"+emailTo+"?subject=Join My Game on 'Versus'&body=Hey! It's "+$('#firstname').val() +" "+$('#lastname').val()+", I'd like to invite you to join my "+ $('#session-type').val()+" game on Versus! Login to your Versus account and join my game with this gameID: "+gameSession);
  }

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

  $("#start-session").on('click', function(){
    KandyAPI.CoBrowse.startBrowsingUser(gameSession);
    UIState.cobrowsingstarted();
  });

  $('#leave-session').on('click', function() {
    KandyAPI.CoBrowse.stopBrowsingUser();

    KandyAPI.Session.terminate(
      gameSession,
      function () {
        UIState.cobrowsingstopped(); 
        alert('Session Ended');
      },
      function (msg, code) {
        alert('Error deleting session (' + code + '): ' + msg);
      }
      );
  });

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
  $("#browse-game-section").addClass("hidden");
};

UIState.sessionavailable = function(){
  $("#leave-session").addClass("hidden");
  $("#session-controls").removeClass("hidden");
};

// UIState.sessionleft = function(){
// };

UIState.sessionjoin = function(){

};

UIState.cobrowsingstarted = function(){
  $("#start-session").addClass("hidden");
  $("#leave-session").removeClass("hidden");
  $("#browse-game-section").removeClass("hidden");

  if(createOrJoin == 1){  //create
    $("#browse-viewer").addClass("hidden");
    $("#games").removeClass("hidden");
  }else{ //join
    $("#games").addClass("hidden");
    $("#browse-viewer").removeClass("hidden");
  }
};

UIState.cobrowsingstopped = function(){
  $("#session-info").removeClass("hidden");
  $("#session-controls").addClass("hidden");
  $("#browse-game-section").addClass("hidden");
  UIState.sessionunavailable();
  UIState.authenticated();
};



});
