function Activity(name,status) {
    this.user = localStorage.user;
    this.name = name;
    this.status = status;
}

Activity.prototype.create = function () {
    var activities = JSON.parse(localStorage.getItem('activities'))||[];
    activities.unshift(this);
    localStorage.setItem('activities', JSON.stringify(activities));
    localStorage.setItem('present_activity_name', this.name);
    localStorage.setItem('click_activity_name',this.name );
}

Activity.get_activities = function () {
    var activities = JSON.parse(localStorage.getItem('activities'));
    var present_activities = _.filter(activities, function (activity) {
        return activity.user == localStorage.getItem('user');
    });
    var acts=[];
    _.each(present_activities,function(activity){
        acts.push(new Activity(activity.name,activity.status))
    });
    return acts;
}

Activity.get_present_activity_name = function () {
    return localStorage.getItem('present_activity_name');
}

Activity.save_present_activity_name = function (present_activity_name) {
    localStorage.setItem('present_activity_name', present_activity_name)
}

Activity.get_click_activity_name = function () {
    return localStorage.getItem('click_activity_name');
}

Activity.save_click_activity_name = function (click_activity_name) {
    localStorage.setItem('click_activity_name', click_activity_name);
}

Activity.judge_activity_name_is_repeat = function (name) {
    var activities = Activity.get_activities();
    var repeat_result = false;
    _.each(activities, function (activity) {
        if (activity.name == name) {
            repeat_result = true;
        }
    });
    return repeat_result;
}

Activity.get_click_activity = function () {
    var activities = JSON.parse(localStorage.getItem('activities'));
    var name = localStorage.getItem('click_activity_name');
    return _.find(activities, function (activity) {
        return activity.name == name;
    });
}

Activity.get_present_activity = function () {
    var activities = JSON.parse(localStorage.getItem('activities'));
    var name = localStorage.getItem('present_activity_name');
    return _.find(activities, function (activity) {
        return activity.name == name;
    }) || new Activity('');
}

Activity.synchronous_show = function () {
    $.ajax({
        type: "POST",
        url: "/process_phone_data",
        data: {'login_user': localStorage.user, "activities": Activity.get_activities(),
            'sign_ups': SignUp.get_sign_ups_of_present_user(), 'bids': Bid.get_bids_of_present_user(),
            'bid_peoples': Bid.get_bid_peoples_of_present_user(), 'bid_results': Bid.get_bid_result_of_present_user()},
        success: function () {
            alert('同步成功！')
        },
        error: function () {
            alert('同步失败，请重新上传...')
        }
    });
}

