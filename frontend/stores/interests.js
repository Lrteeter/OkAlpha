var Store = require('flux/utils').Store,
    Constants = require('../constants/constants'),
    UserStore = require('./users'),
    ApiInterestUtil = require('../util/api_interest_util'),
    AppDispatcher = require('../dispatcher/dispatcher');

var InterestStore = new Store(AppDispatcher);
var _interests = {};

var resetInterests = function(interests){
  _interests = {};
  interests.forEach(function (interest) {
    _interests[interest.id] = interest;
  });
};

var resetInterest = function (interest) {
  _interests[interest.id] = interest;
};

var removeInterest = function () {
  var interests = [];
  ApiInterestUtil.fetchInterests();
  interests = InterestStore.allInterests();
};

InterestStore.allInterests = function () {
  var interests = [];
  for (var id in _interests) {
    interests.push(_interests[id]) ;
  }
  return interests;
};

InterestStore.allMyInterests = function (user_id) {
  var interests = [];
  for (var id in _interests) {
    if (_interests[id].user_id === user_id) {
      interests.push(_interests[id]) ;
    }
  }
  return interests;
};

InterestStore.allMyMatches = function (user_id) {
  var matches = [];
  var myInterests = InterestStore.allMyInterests(user_id)
  for (var i in _interests) {
    for (var j in myInterests) {
      if (_interests[i].interest.toLowerCase() === myInterests[j].interest.toLowerCase()
            && _interests[i].user_id != user_id) {
        matches.push(_interests[i]);
      }
    }
  }
  return matches;
};

InterestStore.find = function (id) {
  return _interests[id];
};

InterestStore.__onDispatch = function (payload) {
  switch(payload.actionType) {
    case Constants.INTERESTS_RECEIVED:
      resetInterests(payload.interests);
      break;
    case Constants.INTEREST_RECEIVED:
      resetInterest(payload.interest);
      break;
    case Constants.INTEREST_REMOVED:
      removeInterest(payload.interest);
      break;
  }
  InterestStore.__emitChange();
};

module.exports = InterestStore;
