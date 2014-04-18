myModule.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "pages/phone_login_page.html",
        controller:PhoneLoginController
        }).when("/activity/create", {
            templateUrl: "pages/activity_create_page.html",
            controller:ActivityCreateController
        }).when("/activity/list", {
            templateUrl: "pages/activity_list_page.html",
            controller:ActivityListController
        }).when("/sign_ups", {
            templateUrl: "pages/sign_up_page.html",
            controller: SignUpListController
        }).when("/bid/list", {
            templateUrl: "pages/bid_activity_list_page.html",
            controller: BidListController
        }).when("/bid/apply", {
            templateUrl: "pages/bid_activity_apply_page.html",
            controller: BidApplyController
        }).when("/bid/result", {
            templateUrl: "pages/bid_result_page.html",
            controller: BidResultController
        }).when("/bid/price/statistics", {
            templateUrl: "pages/bid_price_statistics_page.html",
            controller: BidPriceStatisticsController
        }).otherwise({
            redirectTo: "/"
        });
});

/** Here is example
myModule.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "pages/activity_list_page.html",
        controller: ActivityListController
    }).when("/activity/create", {
            templateUrl: "pages/activity_create_page.html",
            controller: ActivityCreateController
        }).when("/sign_ups/list/:activity_name", {
            templateUrl: "pages/apply_page.html",
            controller: SignUpListController
        }).otherwise({
            redirectTo: "/"
        });
});
**/