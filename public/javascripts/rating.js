$(document).ready(function() {
    $('[rating]').each(function() {
        var rating = $(this).attr('rating');
        var map = ["gray", "gray", "green", "orange", "red"];
        var color = map[rating / 500];
        $(this).css("color", color);
    });
});
