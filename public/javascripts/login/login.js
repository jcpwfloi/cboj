$(document).ready(function() {
    var username, password;
    function login() {
        $.post('/login/auth', {
            username: username,
            password: password
        }, function(data) {
        }, "json");
    }
    $('#password').keyup(function(event) {
        var keycode = event.which;
        if (keycode == 13) {
            username = $('#username').val();
            password = $.md5($('#password').val());
            $('#username').focus();
            $('#submit').click();
        }
    });
    $('#username').keyup(function(event) {
        var keycode = event.which;
        if (keycode == 13) {
            $('#password').focus();
        }
    });
    $('#submit').click(function() {
        login();
    });
});

