//var mongodb = require('./db');
var mongoose = require('mongoose');
var _ = require('underscore');
var Promise = require('promise');
var BidPeople = require('./bid_people');

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
                var bids = _.filter(bid[0].bids, function (bid) {
                    return bid.activity_name == activity_name;
                });
                return  bids.length;
            })
            .done(function (bids_length) {
                resolve(bids_length)
            });
    });
};

Bid.reconstruct_bid_list_infos = function(user_name,activity_name){
    return new Promise(function(resolve){
        bidModel.find({user:user_name}).execQ()
            .then(function(bid){
                return _.filter(bid[0].bids,function(bid){
                    return bid.activity_name == activity_name;
                });
            })
            .then(function(bids){
                var promises = [];
                bids.forEach(function(bid){
                    var bid_list_info = {};
                    var promise = new Promise(function(resolve){
                        BidPeople.count_bid_apply_num(user_name,activity_name,bid.bid_name)
                            .then(function(bid_apply_num){
                                bid_list_info.bid_name = bid.bid_name;
                                bid_list_info.bid_apply_num = bid_apply_num;

                                resolve(bid_list_info);
                            })
                    });
                    promises.push(promise);
                });
                Promise.all(promises)
                    .then(function(bid_list_infos){
                        resolve(bid_list_infos);
                    })
            })
    });
};

module.exports = Bid;
