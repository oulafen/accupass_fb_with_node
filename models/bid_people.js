var mongodb = require('./db');

function BidPeople(bid_people) {
    this.user = bid_people.user;
    this.activity_name = bid_people.activity_name;
    this.bid_name = bid_people.bid_name;
    this.name = bid_people.name;
    this.phone = bid_people.phone;
    this.price = bid_people.price;
}

module.exports = BidPeople;

BidPeople.prototype.save = function (callback) {
    var bid_people = {
        user: this.user,
        activity_name: this.activity_name,
        bid_name: this.bid_name,
        name: this.name,
        phone:this.phone,
        price:this.price
    };
    mongodb.open(function (err, db) {
        db.collection('bid_peoples', function (err, collection) {
            collection.insert(bid_people, {
                    safe: true
                }, function (err, bid_people) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, bid_people[0]);
                }
            );
        });
    });
};

BidPeople.get = function (user, activity_name, callback) {
    mongodb.open(function (err, db) {
        db.collection('bid_peoples', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find({user: user, activity_name: activity_name}, function (err, bid_people) {
                mongodb.close();
                callback(null, bid_people);
            });
        });
    });
};


