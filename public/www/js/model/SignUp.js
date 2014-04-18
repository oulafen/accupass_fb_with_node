function SignUp() {
}

SignUp.get_sign_up_status = function () {
    return localStorage.getItem('sign_up_status');
}

SignUp.save_sign_up_status = function (status) {
    localStorage.setItem('sign_up_status', status);
}

SignUp.update_sign_up_activities = function (present_activity) {
    var activities = JSON.parse(localStorage.getItem('activities'));
    _.map(activities, function (activity) {
        if (activity.name == present_activity.name) {
            activity.status = present_activity.status;
        }
    });
    localStorage.setItem('activities', JSON.stringify(activities));
}

SignUp.get_present_sign_ups = function () {
    var sign_ups = JSON.parse(localStorage.getItem('sign_ups'));
    return _.filter(sign_ups, function (sign_up) {
        return sign_up.activity_name == localStorage.getItem('present_activity_name')
            && sign_up.user == localStorage.user
    }) || [];
}

SignUp.get_sign_ups_of_present_user = function () {
    return _.filter(JSON.parse(localStorage.getItem('sign_ups')), function (sign_up) {
        return sign_up.user == localStorage.getItem('user')
    });

}