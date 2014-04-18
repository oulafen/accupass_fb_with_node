var mongodb = require('./db');

function Bid(bid) {
    this.user = bid.user;
    this.activity_name = bid.activity_name;
    this.bid_name = bid.bid_name;
    this.bid_status = bid.bid_status;
}

module.exports = Bid;

Bid.prototype.save = function (callback) {
    var bid = {
        user: this.user,
        activity_name: this.activity_name,
        bid_name: this.bid_name,
        bid_status: this.bid_status
    };
    mongodb.open(function (err, db) {
        db.collection('bids', function (err, collection) {
            collection.insert(bid, {
                    safe: true
                }, function (err, bid) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, bid[0]);
                }
            );
        });
    });
};

Bid.get = function (user, activity_name, callback) {
    mongodb.open(function (err, db) {
        db.collection('bids', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find({user: user, activity_name: activity_name}, function (err, bid) {
                mongodb.close();
                callback(null, bid);
            });
        });
    });
};


