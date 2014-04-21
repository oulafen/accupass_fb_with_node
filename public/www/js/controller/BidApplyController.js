function BidApplyController($scope, $navigate) {
    $scope.status_map = {
        'null': 'unbegin',
        'yellow': 'beginning',
        'lightgray': 'end'
    }

    $scope.bid_apply_begin_button_status_init = function () {
        $scope.present_bid = Bid.get_present_bid();
        $scope.click_bid = Bid.get_click_bid();
        if ($scope.present_bid.bid_status == 'yellow' &&
            $scope.click_bid.bid_name != $scope.present_bid.bid_name) {
            $scope.status = 'begin_disabled';
        } else {
            $scope.status = $scope.click_bid.bid_name == $scope.present_bid.bid_name ?
                $scope.status_map[$scope.present_bid.bid_status] :
                $scope.status_map[$scope.click_bid.bid_status];
        }
    }

    $scope.go_bid_list = function () {
        $navigate.go('/bid/list');
    }

    $scope.get_bid_peoples = function () {
        $scope.bid_peoples = Bid.get_present_bid_peoples();
    }

    $scope.bid_apply_unbegin = function () {
        $scope.present_activity = Activity.get_present_activity();
        $scope.status = 'beginning';
        if ($scope.present_bid.bid_status != 'yellow') {
            $scope.present_bid.bid_name = $scope.click_bid.bid_name;
            $scope.sign_up_status = SignUp.get_sign_up_status();
            $scope.sign_up_status = 'end';

            SignUp.save_sign_up_status($scope.sign_up_status);

            $scope.present_bid.bid_status = 'yellow';
            $scope.present_activity.status = 'yellow';

            Bid.update_bids($scope.present_bid);
            SignUp.update_sign_up_activities($scope.present_activity);
            Bid.save_present_bid_name($scope.present_bid.bid_name);
            Bid.save_bid_result();
            Bid.synchronous_show();
        }
    }

    $scope.bid_apply_beginning = function () {
        $scope.present_activity = Activity.get_present_activity();
        if (confirm('确定要结束本次竞价吗？')) {
            $scope.status = 'end';
            $scope.sign_up_status = 'unbegin';

            SignUp.save_sign_up_status($scope.sign_up_status);

            $scope.present_bid.bid_status = 'lightgray';
            $scope.present_activity.status = 'lightgray';

            Bid.update_bids($scope.present_bid);
            SignUp.update_sign_up_activities($scope.present_activity);
            $navigate.go('/bid/result');
        }
    }

    $scope.click_bid_name = Bid.get_click_bid_name();

    $scope.bid_apply_begin_button_status_init();

    $scope.get_bid_peoples();

}

