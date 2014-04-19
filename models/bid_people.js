//var mongodb = require('./db');
var mongoose = require('mongoose');

var bidPeopleSchema = new mongoose.Schema({
    user: String,
    bid_people: Array
}, {
    collection: 'bid_people'
});

var bidPeopleModel = mongoose.model('BidPeople', bidPeopleSchema);

function BidPeople(user,bid_people) {
    this.user = user;
    this.bid_people = bid_people ;
}

BidPeople.prototype.update = function(callback){
    var bid_people = new bidPeopleModel(this);
    bidPeopleModel.remove({user:this.user},function(err,bid_people){
        return callback(null,bid_people);
    });
    bid_people.save(bid_people);
};

module.exports = BidPeople;

