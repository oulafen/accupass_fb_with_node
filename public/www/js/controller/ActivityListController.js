function ActivityListController($scope, $navigate) {
    $scope.set_create_button_status = function () {
        $scope.present_activity = Activity.get_present_activity();
        $scope.button_status = $scope.present_activity.active_status == 'yellow' ?  'disable' : 'able';
    }

    $scope.go_create = function () {
        $navigate.go('/activity/create', 'slide', 'left');
    }

    $scope.go_apply = function (activity_name) {
        Activity.save_click_activity_name(activity_name);
        $navigate.go('/sign_ups', 'slide', 'left');
    }

    $scope.synchronize_data = function(){
        Activity.synchronous_show();
    }

    $scope.set_create_button_status();

    $scope.activities = Activity.get_activities();
}
