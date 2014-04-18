var mongodb = require('./db');

function Bid(user,bids) {
    this.user = user;
    this.bids = bids;
}

module.exports = Bid;

Bid.prototype.update = function(callback){
    var bid = this;
    mongodb.open(function (err, db) {
        db.collection('bids', function (err, collection) {
            collection.remove({user:bid.user},function(err,bid){
                return callback(null,bid);
            });
            collection.insert(bid,{safe: true},function(err,bid){
                mongodb.close();
                return callback(null,bid);
            })
        });
    });
};

