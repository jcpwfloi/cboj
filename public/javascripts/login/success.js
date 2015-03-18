var cnt = 2;

function getCount() {
    if (!cnt) {
        window.location.href='/';
        return;
    }
    $('#cnt').html(cnt);
    -- cnt;
    setTimeout("getCount()", 1000);
}

$(document).ready(function() {
    setTimeout("getCount()", 1000);
});
