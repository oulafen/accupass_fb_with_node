var mongodb = require('./db');

function BidPeople(user,bid_people) {
    this.user = user;
    this.bid_people = bid_people ;
}

module.exports = BidPeople;

BidPeople.prototype.update = function(callback){
    var bid_people = this;
    mongodb.open(function (err, db) {
        db.collection('bid_people', function (err, collection) {
            collection.remove({user:bid_people.user},function(err,bid_people){
                return callback(null,bid_people);
            });
            collection.insert(bid_people,{safe: true},function(err,bid_people){
                mongodb.close();
                return callback(null,bid_people);
            })
        });
    });
};
