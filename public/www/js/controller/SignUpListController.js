function SignUpListController($scope, $navigate) {

    $scope.status_map = {
        'null': 'unbegin' ,
        'yellow':'beginning',
        'lightgray': 'end'
    }

    $scope.button_status_init=function() {
        $scope.click_activity = Activity.get_click_activity();
        $scope.present_activity = Activity.get_present_activity();
        $scope.sign_up_status = SignUp.get_sign_up_status();
        if ($scope.present_activity.status == 'yellow'
            && $scope.click_activity.name != $scope.present_activity.name) {
            $scope.status = 'begin_disabled';
            return;
        }
        if ($scope.present_activity.status == 'yellow' && $scope.sign_up_status == 'end') {
            $scope.status = 'end';
            return;
        }
        $scope.status = $scope.click_activity.name == $scope.present_activity.name ?
             $scope.status_map[$scope.present_activity.status]
            : $scope.status_map[$scope.click_activity.status];
    }

    $scope.sign_up_unbegin = function () {
        $scope.status = 'beginning';
        $scope.present_activity = $scope.click_activity;
        $scope.present_activity.status = 'yellow';

        Activity.save_present_activity_name($scope.present_activity.name);
        SignUp.update_sign_up_activities($scope.present_activity);
        SignUp.save_sign_up_status('beginning');
    }

    $scope.sign_up_beginning = function () {
        if (confirm('确认要结束本次报名吗？')) {
                SignUp.save_sign_up_status('end');
                $scope.status = 'end';
                $navigate.go('/bid/list');
        }
    }

    $scope.get_peoples=function(){
        $scope.peoples = SignUp.get_present_sign_ups();
    }

    $scope.go_list = function () {
        $navigate.go('/activity/list', 'slide', 'right');
    }

    $scope.go_bid_list = function(){
        $navigate.go('/bid/list');
    }

    $scope.button_status_init();

    $scope.get_peoples();
}

