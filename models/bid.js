//var mongodb = require('./db');
var mongoose = require('mongoose');
var _ = require('underscore');
var Promise = require('promise');

var bidSchema = new mongoose.Schema({
    user: String,
    bids: Array
}, {
    collection: 'bids'
});

var bidModel = mongoose.model('Bid', bidSchema);

function Bid(user, bids) {
    this.user = user;
    this.bids = bids;
}

Bid.prototype.update = function (callback) {
    var bid = new bidModel(this);
    bidModel.remove({user: bid.user}, function (err, bid) {
        return callback(null, bid)
    });
    bid.save(bid);
};

Bid.count_bids_num = function (user_name, activity_name) {
    return new Promise(function (resolve) {
        bidModel.find({user: user_name}).execQ()
            .then(function (bid) {
                var bids = _.filter(bid.bids, function (bid) {
                    return bid.activity_name == activity_name;
                });
                return  bids.length;
            })
            .done(function (bids_length) {
                resolve(bids_length)
            });
    });
};

module.exports = Bid;
