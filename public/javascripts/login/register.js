$(document).ready(function() {
    function message(msg) {
        var RMessage = '<div class="alert alert-danger">' + msg + '</div>';
        $('.register-message').html(RMessage);
        setTimeout("$('.register-message').html('<br /><br />')", 2000);
    }
    function register() {
        var user = $('#user').val();
        var pass = $.md5($('#pass').val());
        var reppass = $.md5($('#reppass').val());
        var refer = $('#invite').val();
        if (pass != reppass) {
            message('两次输入密码不一致。');
            return;
        }
        $.post('/login/register', {
            user: user,
            pass: pass,
            refer: refer
        }, function(data) {
            if (data) {
                if (data.stat == 1) window.location.href='/login/register/success';
                else message('注册失败');
            }
        });
    }
    $('#user').keyup(function(event) {
        var keycode = event.which;
        if (keycode == 13) $('#pass').focus();
    });
    $('#pass').keyup(function(event) {
        var keycode = event.which;
        if (keycode == 13) $('#reppass').focus();
    });
    $('#reppass').keyup(function(event) {
        var keycode = event.which;
        if (keycode == 13) $('#invite').focus();
    });
    $('#invite').keyup(function(event) {
        var keycode = event.which;
        if (keycode == 13) $('#submit').click();
    });
    $('#submit').click(function() {
        register();
        $('#user').focus();
    });
});
