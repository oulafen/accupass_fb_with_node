//var mongodb = require('./db');
var mongoose = require('mongoose');

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

Bid.prototype.update = function(callback){
    var bid = new bidModel(this);
    bidModel.remove({user:this.user},function(err,bid){
        callback(null,bid);
    });
    bid.save(bid,function(err,bid){
        callback(null,bid);
    });
};

module.exports = Bid;
