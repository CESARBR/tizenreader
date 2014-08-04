'use strict';

// -- Model ---------------------------------------------------------------- //

function Feed() {
  this.url = "";
  this.title = "";
}
Feed.prototype = {};

function FeedStorage() {
  this.feeds = [];
}
FeedStorage.prototype = {};

FeedStorage.prototype.add = function(item) {
  this.feeds.push(item);
}

FeedStorage.prototype.remove = function(url) {
  for (var i = 0; i < this.feeds.length; i++) {
    var feed = this.feeds[i];

    if (feed.url == url) {
      this.feeds.splice(i, 1);
      break;
    }
  }
}

// -- View ----------------------------------------------------------------- //

function FeedView() {}
FeedView.prototype = {};

FeedView.prototype.onAddNewFeedClick = function(value) {
  var title = $(value).text();
  var url = value.id;
  var html =
    '<li data-icon="minus" onclick="feedView.onRemoveFeedClick(this);" id="' + url + '" >' +
    '  <a class="ui-link-inherit feed_list_item">' + title + '</a>' +
    '</li>';
  $(value).replaceWith(html);

  var feed = new Feed();
  feed.title = title;
  feed.url = url;
  feedStorage.add(feed);

  $("#feed_search_result").listview('refresh');
  this.buildFeedMenu();
}

FeedView.prototype.onRemoveFeedClick = function(value) {
  var title = $(value).text();
  var url = value.id;
  var html =
    '<li data-icon="plus" onclick="feedView.onAddNewFeedClick(this);" id="' + url + '">' +
    '  <a class="ui-link-inherit feed_list_item">' + title + '</a>' +
    '</li>';
  $(value).replaceWith(html);

  feedStorage.remove(url);

  $("#feed_search_result").listview('refresh');
  this.buildFeedMenu();
}

FeedView.prototype.onFeedsSearchButtonClick = function() {
  var query = $("#search_field").val();
  google.feeds.findFeeds(query, function(result) {
      if (!result.error) {
        var html = '';

        for (var i = 0; i < result.entries.length; i++) {
          var entry = result.entries[i];
          this.title = entry.title;
          html +=
            '<li data-icon="plus" onclick="feedView.onAddNewFeedClick(this)" id="' + entry.url + '">' +
            '  <a class="ui-link-inherit feed_list_item">' + entry.title + '</a>' +
            '</li>';
        }
        $("#feed_search_result").html(html);
        $("#feed_search_result").listview('refresh');
      }
  });
}

FeedView.prototype.buildFeedMenu = function() {
  var html = '';

  for (var i = 0; i < feedStorage.feeds.length; i++) {
    var feed = feedStorage.feeds[i];
    this.getUnreadFeeds(feed.url, i);

    html +=
      '<li  onclick="feedView.findFeedsFromUrl(this)" id="' + feed.url + '">' +
      '  <a class="ui-link-inherit feed_list_item">' + feed.title +
      '    <span class="ui-li-count"><span id="' + i + '"</span></span>' +
      '  </a>' +
      '</li>';
  }
  $("#list_of_added_feeds").html(html);
  $("#list_of_added_feeds").listview('refresh');
}

FeedView.prototype.getUnreadFeeds = function(url, index) {
  var feed = new google.feeds.Feed(url);

  feed.load(function(result) {
    if (!result.error) {
      $("#" + index).html('<span id="' + index + '">' + result.feed.entries.length + '</span>');
      $("#feed_search_result").listview('refresh');
    }
  });
}

FeedView.prototype.findFeedsFromUrl = function(value) {
  var feed = new google.feeds.Feed(value.id);

  feed.load(function(result) {
    if (!result.error) {
      var container = $("#list_unred_feeds");
      var html = '';

      for (var i = 0; i < result.feed.entries.length; i++) {
        var entry = result.feed.entries[i];
        var content = entry.content;
        var img = $(content).children("img")[0];
        var imgSrc = "img/mario_bros.jpg"; //TODO: change to default image

        if (img) {
          imgSrc = img.src;
        }
        var li =
          '<li data-icon="false">' +
          '  <a href="details.html?id=' + entry.title + '" style="display:inline-block">' +
          '    <img class="feed_image" src="' + imgSrc + '"/>' +
          '    <p><strong>' + entry.title + '</strong></p>' +
          '    <p>' + entry.contentSnippet + '</p>' +
          '  </a>'+
          '</li>';
        html += li;
      }
      $("#list_unred_feeds").html(html);
      $("#list_unred_feeds").listview('refresh');
    } else {
      alert(result.error.message);
    }
  });
}

// -- Components ----------------------------------------------------------- //

var feedView = new FeedView();
var feedStorage = new FeedStorage();
