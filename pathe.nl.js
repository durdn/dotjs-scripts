function getRottenRating(title, callback) {
  var rating = '';
  var query = 'http://www.rottentomatoes.com/search/?search='+encodeURIComponent(title)+'&sitesearch=rt';
  $.get(query, function(data) {
    var rating = $('#all-critics-numbers .tomato_numbers #all-critics-meter', data).text();
    if (rating == '') {
      rating = $('#movie_results_ul li', data).first().find('.tMeterScore').text();
    } else {
      rating = rating + '%';
    }
    callback(rating);
  });
}

function injectRating(movie, rating) {
  if (rating !== '') {
    $(movie).append($('<p />').text('rotten: ' + rating));
  }
}

$('.movie-highlight .heading a').each(function(index, movie) { 
  var title = $(movie).text();
  var rating = localStorage.getItem(title);
  if (rating) {
      console.log('using local storage:' + rating);
      injectRating(movie, rating);
  } else {
      getRottenRating(title, function(ajaxRating) {
        console.log('queried rotten:' + ajaxRating);
        injectRating(movie,ajaxRating);
        localStorage.setItem(title, ajaxRating);
      });
  }
});
