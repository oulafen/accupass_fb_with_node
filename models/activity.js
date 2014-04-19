//var mongodb = require('./db');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/accupass_fb_with_node');

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

Activity.prototype.update = function(){
    var activity = new activityModel(this) ;
    activityModel.remove({user:this.user});
    activity.save(activity);
};

Activity.get = function(){

};

module.exports = Activity;
