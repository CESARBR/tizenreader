'use strict';

function Feed() {
  this.url = "";
  this.title = "";
}
Feed.prototype = {};

function FeedStorage() {
  this.feeds = [];

  // loading the stored feeds
  var array = JSON.parse(localStorage.getItem('feeds'));
  if (array) {
    this.feeds = array.map(function(item) {
        var feed = new Feed();
        feed.url = item.url;
        feed.title = item.title;
        return feed;
    });
  }
}
FeedStorage.prototype = {};

FeedStorage.prototype.add = function(item) {
  this.feeds.push(item);
  localStorage.setItem('feeds', JSON.stringify(this.feeds));
}

FeedStorage.prototype.remove = function(url) {
  for (var i = 0; i < this.feeds.length; i++) {
    var feed = this.feeds[i];

    if (feed.url == url) {
      this.feeds.splice(i, 1);
      break;
    }
  }
  localStorage.setItem('feeds', JSON.stringify(this.feeds));
}

var feedStorage = new FeedStorage();
