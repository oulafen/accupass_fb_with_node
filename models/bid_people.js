//var mongodb = require('./db');
var mongoose = require('mongoose');
var Promise = require('promise');
var _ = require('underscore');

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

BidPeople.count_bid_apply_num = function(user_name,activity_name,bid_name){
    return new Promise(function(resolve){
        bidPeopleModel.find({user:user_name}).execQ()
            .then(function(bid_people){
                return _.filter(bid_people[0].bid_people,function(bid_person){
                    return bid_person.bid_name == bid_name && bid_person.activity_name == activity_name;
                }).length;
            })
            .done(function(bid_apply_num){
                resolve(bid_apply_num);
            })
    })
};

BidPeople.get = function(user_name,activity_name,bid_name){
    return new Promise(function(resolve){
        bidPeopleModel.find({user:user_name}).execQ()
            .then(function(bid_people){
                return _.filter(bid_people[0].bid_people,function(bid_person){
                    return bid_person.activity_name == activity_name && bid_person.bid_name == bid_name;
                });
            })
            .done(function(bid_people){
                resolve(bid_people);
            })
    })
};

BidPeople.reconstruct_prices_list = function(user_name,activity_name,bid_name){
    return new Promise(function(resolve){
        BidPeople.get(user_name,activity_name,bid_name)
            .then(function(bid_people){
                var prices_list=[];
                    bid_people.forEach(function(bid_person){
                        var price_list = {};
                        if(!_.find(prices_list,function(price_l){return price_l.price == price_list.price;})){
                            price_list.price = bid_person.price;
                            price_list.num = _.filter(bid_people,function(bid_p){
                                return bid_p.price == bid_person.price;
                            }).length;
                            prices_list.push(price_list);
                        }
                    });
                resolve(prices_list);
            });
    })
};

module.exports = BidPeople;

