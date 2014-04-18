function BidPriceStatisticsController($scope, $navigate) {
    $scope.go_bid_list = function () {
        $navigate.go('/bid/list');
    }

    $scope.go_bid_result = function () {
        $navigate.go('/bid/result');
    }

    $scope.prices = Bid.get_prices();

    $scope.click_biding_name = Bid.get_click_bid_name();
}
