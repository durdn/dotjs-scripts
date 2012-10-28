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
    $(movie).prepend($('<span style="color: red;" />').text(' ' + site + ' ' + rating + " "));
  }
}

function removeTags(title) {
  var tags = '2012 BRRip XviD ETRG RETAiL PSiG EXTENDED COCAIN ALLiANCE 1080p BrRip x264 YIFY XViD AC3 REFiLL DVDRip PLAYNOW 720p BrRip NYDIC 3LT0N AMIABLE Lum1x DEPRiVED REPACK SPARKS LIMITED SPARKS FRENCH BLOODYMARY 720P R6 x264 LiNE JYK EXTENDED RETAIL NEW SOURCE KiNGDOM matine bdrip'.toLowerCase();
  $(tags.split(' ')).each(function(index, tag) {
    title = title.replace(new RegExp('(' + tag + ')', 'gi'), '');
    title = title.replace(new RegExp('(\sts)', 'gi'), '');
  });
  return title;
}

$('.top h1 a').text('Movies');
$('dt:not(:contains("movies"))').each(function(index, movie) { 
  $(movie).parents('dl').remove();
  var title = $(movie).find('a').text();
});

$('dt:contains("movies")').each(function(index, movie) { 
  //$(movie).parents('dl').css('background-color', '#ffff00');
  var title = $(movie).find('a').text();
  console.log('title:' + removeTags(title));
  title = removeTags(title);

  var rating = localStorage.getItem(title);
  if (rating) {
      console.log('using local storage:' + rating);
      injectRating('r:', movie, rating);
  } else {
      getRottenRating(title, function(ajaxRating) {
        console.log('queried rotten:' + ajaxRating);
        injectRating('r:', movie,ajaxRating);
        localStorage.setItem(title, ajaxRating);
      });
  }

  var metarating = localStorage.getItem('metacritic-' + title);
  if (metarating) {
      console.log('using local storage:' + metarating);
      injectRating('m:', movie, metarating);
  } else {
      getMetacriticRating(title, function(ajaxRating) {
        console.log('queried metacritic:' + ajaxRating);
        injectRating('m:', movie, ajaxRating);
        localStorage.setItem('metacritic-' + title, ajaxRating);
      });
  }
});
