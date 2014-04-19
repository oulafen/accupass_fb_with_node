//var mongodb = require('./db');
var mongoose = require('mongoose');
var _ = require('underscore');

var bidSchema = new mongoose.Schema({
    user: String,
    bids: Array
}, {
    collection: 'bids'
});

var bidModel = mongoose.model('Bid', bidSchema);

function Bid(user,bids) {
    this.user = user;
    this.bids = bids;
}

Bid.prototype.update = function(){
    var bid = new bidModel(this);
    bidModel.remove({user:this.user});
    bid.save(bid);
};

Bid.count_bids_num = function(user_name,activity_name,callback){
    bidModel.find({user:user_name},function(err,bid){
        var bids = _.filter(bid.bids,function(bid){
            return bid.activity_name == activity_name
        });
        return callback(bids.length);
    })
};

module.exports = Bid;
