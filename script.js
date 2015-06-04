$(function(){

  $(document).ready(function(){
    UIState.unauthenticated();
  });

  // var listners = {
  //   'onUserJoinRequest': onSessionUserJoinRequest,
  //   'onJoinApprove': onSessionJoinApprove
  // };

  var currentUser, UIState = {};

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

        console.log("Results: "+ results);
        console.log("ID: "+ results.full_user_id);

        $('#username').text(results.full_user_id);
        UIState.authenticated();
        UIState.sessionunavailable();
      },
      function (msg, code) {
        alert('Error loggin in:(' + code + '): ' + msg);
      });
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
