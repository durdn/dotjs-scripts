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

function getMetacriticRating(title, callback) {
  var rating = '';
  title = title.toLowerCase().replace(/ /g, '+');
  var query = 'http://www.metacritic.com/search/all/'+encodeURIComponent(title)+'/results';
  console.log('meta url:' + query);
  $.get(query, function(data) {
    var rating = $('.search_results .first_result .metascore', data).text();
    callback(rating);
  });
}

function injectRating(site, movie, rating) {
  if (rating !== '') {
    $(movie).append($('<p />').text(site + ' ' + rating));
  }
}

$('span:contains("nederlands")').css('color','red');
$('span:contains("nederlands")').parents('.movie-highlight').next('.day-table').remove();
$('span:contains("nederlands")').parents('.movie-highlight').remove();
$('span:contains("turkse")').parents('.movie-highlight').next('.day-table').remove();
$('span:contains("turkse")').parents('.movie-highlight').remove();

$('.movie-highlight .heading a').each(function(index, movie) { 
  var title = $(movie).text();

  var rating = localStorage.getItem(title);
  if (rating) {
      console.log('using local storage:' + rating);
      injectRating('rotten:', movie, rating);
  } else {
      getRottenRating(title, function(ajaxRating) {
        console.log('queried rotten:' + ajaxRating);
        injectRating('rotten:', movie,ajaxRating);
        localStorage.setItem(title, ajaxRating);
      });
  }

  var metarating = localStorage.getItem('metacritic-' + title);
  if (metarating) {
      console.log('using local storage:' + metarating);
      injectRating('metacritic:', movie, metarating);
  } else {
      getMetacriticRating(title, function(ajaxRating) {
        console.log('queried metacritic:' + ajaxRating);
        injectRating('metacritic:', movie, ajaxRating);
        localStorage.setItem('metacritic-' + title, ajaxRating);
      });
  }
});

