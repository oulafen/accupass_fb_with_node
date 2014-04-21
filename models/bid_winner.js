var mongoose = require('mongoose-q')(require('mongoose'));
var _ = require('underscore');
var Promise = require('promise');

var bidWinnerSchema = new mongoose.Schema({
    user: String,
    bid_winner:Array
}, {
    collection: 'bid_winners'
});

var bidWinnerModel = mongoose.model('BidWinner', bidWinnerSchema);

function BidWinner(user,bid_winner) {
    this.user = user;
    this.bid_winner = bid_winner;
}

BidWinner.prototype.update = function (callback) {
    var bid_winner = new bidWinnerModel(this);
    bidWinnerModel.remove({user: this.user}, function (err, bid_winner) {
        return callback(null, bid_winner);
    });
    bid_winner.save(bid_winner);
};

BidWinner.get = function (user_name) {
    return new Promise(function (resolve) {
        bidWinnerModel.find({user: user_name}).execQ()
            .then(function (bid_winner) {
                resolve(bid_winner);
            })
    })
};

module.exports = BidWinner;

