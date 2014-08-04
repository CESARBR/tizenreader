'use strict';

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

var feedStorage = new FeedStorage();
