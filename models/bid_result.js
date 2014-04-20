var mongoose = require('mongoose');
var Promise = require('promise');
var _ = require('underscore');

var bidResultSchema = new mongoose.Schema({
    user: String,
    bid_results: Array
}, {
    collection: 'bid_result'
});

var bidResultModel = mongoose.model('BidResult', bidResultSchema);

function BidResult(user,bid_results) {
    this.user = user;
    this.bid_results = bid_results ;
}

BidResult.prototype.update = function (callback) {
    var bid_result = new bidResultModel(this);
    bidResultModel.remove({user: this.user}, function (err, bid_result) {
        return callback(null, bid_result);
    });
    bid_result.save(bid_result);
};

module.exports = BidResult;


