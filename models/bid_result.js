var mongoose = require('mongoose');
var Promise = require('promise');
var _ = require('underscore');
var BidPeople = require('./bid_people');

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

BidResult.reconstruct_bid_result = function(user_name,activity_name,bid_name){
    return new Promise(function(resolve){
        bidResultModel.find({user:user_name}).execQ()
            .then(function(bid_result){
                return _.find(bid_result[0].bid_results,function(bid_result){
                    return bid_result.activity_name == activity_name && bid_result.bid_name == bid_name;
                });
            })
            .done(function(bid_result){
                BidPeople.get(user_name,activity_name,bid_name)
                    .then(function(bid_people){
                        bid_result.bid_people = bid_people;
                        resolve(bid_result)
                    })
            })
    })

};

module.exports = BidResult;


