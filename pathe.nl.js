//var title = $('.movie-highlight .heading a').slice(1).first().text();
//title = title.toLowerCase();
//title = title.replace(/\s+/g, '_');
//http://www.rottentomatoes.com/search/?search=paranormal&sitesearch=rt
//console.log(query);
//var title = $('.movie-highlight .heading a').slice(1).first().text();
$('.movie-highlight .heading a').each(function(index, movie) { 
  var title = $(movie).text();
  var query = 'http://www.rottentomatoes.com/search/?search='+encodeURIComponent(title)+'&sitesearch=rt';
  $.get(query, function(data) {
    //var rating = $('#movie_results_ul .tmeter', data).text();
    var rating = $('#all-critics-numbers .tomato_numbers #all-critics-meter', data).text();
    if (rating == '') {
      //console.log('trying next method' + query);
      rating = $('#movie_results_ul li', data).first().find('.tMeterScore').text();
      if (rating != '') {
        //console.log(title + ' found ' + rating);
      } else {
	rating = 'not found';
      }
    } else {
      rating = rating + '%';
    }
    $(movie).append($('<p />').text('rotten: ' + rating));
  });
});
