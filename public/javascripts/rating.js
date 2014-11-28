$(document).ready(function() {
    var iter = $('[rating]');
    for (var i = 0; i < iter.length; ++ i) {
        var sel = $('[rating]:eq(' + i.toString() + ')');
        var rating = sel.attr('rating');
        if (rating < 1000) {
            sel.css("color", "gray");
        } else if (rating < 1500) {
            sel.css("color", "green");
        } else if (rating < 2000) {
            sel.css("color", "orange");
        } else {
            sel.css("color", "red");
        }
    }
});
