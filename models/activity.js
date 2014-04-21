//var mongodb = require('./db');
var mongoose = require('mongoose-q')(require('mongoose'));
var Promise = require('promise');
var _ = require('underscore');
var Bid = require('./bid');
var BidPeople = require('./bid_people');

var activitySchema = new mongoose.Schema({
    user: String,
    activities: Array
}, {
    collection: 'activities'
});

var activityModel = mongoose.model('Activity', activitySchema);

function Activity(user,activities) {
    this.user = user;
    this.activities = activities;
}

Activity.prototype.update = function(callback){
    var activity = new activityModel(this) ;
    activityModel.remove({user:this.user},function(err,activity){
        return callback(null,activity);
    });
    activity.save(activity);
};

Activity.get = function(user,callback){
    activityModel.findOne({user:user},function(err,activity){
        callback(null,activity);
    });
};

Activity.reconstruct_syn_show_info = function(user){
    return new Promise(function(resolve){
        var syn_show_info = {};
        Activity.get(user.name,function(activity){
            if(activity){
                var ongoing_activity = _.find(activity[0].activities,function(activity){
                    return activity.status == 'yellow';
                });
                if(ongoing_activity!=undefined){
                    syn_show_info.activity_status = ongoing_activity.status;
                    syn_show_info.activity_name = ongoing_activity.name;
                    Bid.get_ongoing_bid(user.name,ongoing_activity.name)
                        .then(function(ongoing_bid){
                            if(ongoing_bid!='null'){
                                syn_show_info.bid_status = ongoing_bid.bid_status;
                                BidPeople.get(user.name,ongoing_activity.name,ongoing_bid.bid_name)
                                    .then(function(bid_people){
                                        syn_show_info.bid_people = bid_people;
                                        resolve(syn_show_info);
                                    })
                            }
                            if(ongoing_bid=='null'){
                                syn_show_info.bid_status = 'dis_ongoing';
                                resolve(syn_show_info);
                            }
                        })
                }
                if(ongoing_activity == undefined){
                    syn_show_info.activity_status = 'dis_ongoing';
                    resolve(syn_show_info);
                }
            }else{
                resolve({})
            }
        })
//        activityModel.find({user:user.name}).execQ()
//            .then(function(activity){
//                var ongoing_activity = _.find(activity[0].activities,function(activity){
//                    return activity.status == 'yellow';
//                });
//                if(ongoing_activity!=undefined){
//                    syn_show_info.activity_status = ongoing_activity.status;
//                    syn_show_info.activity_name = ongoing_activity.name;
//                    Bid.get_ongoing_bid(user.name,ongoing_activity.name)
//                        .then(function(ongoing_bid){
//                            if(ongoing_bid!='null'){
//                                syn_show_info.bid_status = ongoing_bid.bid_status;
//                                BidPeople.get(user.name,ongoing_activity.name,ongoing_bid.bid_name)
//                                    .then(function(bid_people){
//                                        syn_show_info.bid_people = bid_people;
//                                        resolve(syn_show_info);
//                                    })
//                            }
//                            if(ongoing_bid=='null'){
//                                syn_show_info.bid_status = 'dis_ongoing';
//                                resolve(syn_show_info);
//                            }
//                        })
//                }
//                if(ongoing_activity == undefined){
//                    syn_show_info.activity_status = 'dis_ongoing';
//                    resolve(syn_show_info);
//                }
//            })
    })
};

module.exports = Activity;
