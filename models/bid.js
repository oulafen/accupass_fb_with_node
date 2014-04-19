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

Bid.prototype.update = function(){
    var bid = new bidModel(this);
    bidModel.remove({user:this.user});
    bid.save(bid);
};

module.exports = Bid;
