function Bid(bid_name) {
    this.activity_name = localStorage.getItem('present_activity_name');
    this.user = localStorage.user;
    this.bid_name = bid_name;
    this.bid_status = 'null';
}

Bid.prototype.save = function () {
    var bids = Bid.get_bids();
    bids.push(this);
    localStorage.setItem('bids', JSON.stringify(bids));
}

Bid.get_present_bid_name = function () {
    return localStorage.getItem('present_bid_name');
}

Bid.save_present_bid_name = function (bid_name) {
    localStorage.setItem('present_bid_name', bid_name);
}

Bid.get_click_bid_name = function () {
    return localStorage.getItem('click_bid_name');
}

Bid.save_click_bid_name = function (bid_name) {
    localStorage.setItem('click_bid_name', bid_name);
}

Bid.get_bids_of_present_activity = function () {
    var bids = Bid.get_bids();
    return _.filter(bids, function (bid) {
        return bid.activity_name == localStorage.getItem('present_activity_name') && bid.user == localStorage.user;
    }) || [];
}

Bid.get_bid_name = function () {
    var bids = Bid.get_bids_of_present_activity();
    return ('竞价' + (bids.length + 1));
}

Bid.get_bids = function () {
    var bids = JSON.parse(localStorage.getItem('bids'));
    return bids || [];
}

Bid.get_present_bid = function () {
    return _.find(Bid.get_bids_of_present_activity(), function (bid) {
        return bid.bid_name == localStorage.getItem('present_bid_name')
    }) || {};
}

Bid.get_click_bid = function () {
    return _.find(Bid.get_bids(), function (bid) {
        return bid.bid_name == localStorage.getItem('click_bid_name')
    }) || [];
}

Bid.get_bid_people_by_phone = function (phone) {
    return _.find(SignUp.get_present_sign_ups(), function (sign_up) {
        return sign_up.phone == phone;
    }) || {};
}

Bid.update_bids = function (present_bid) {
    var bids = Bid.get_bids();
    _.map(bids, function (bid) {
        if (bid.bid_name == present_bid.bid_name
            && bid.activity_name == localStorage.present_activity_name
            && bid.user == localStorage.user) {
            bid.bid_status = present_bid.bid_status;
        }
    });
    localStorage.setItem('bids', JSON.stringify(bids));
}

Bid.get_prices = function () {
    var prices = [];
    _.each(Bid.get_bid_peoples_by_price(), function (present_bid_people) {
        var price = {};
        if (!Bid.judge_find_in_prices(prices, present_bid_people.price)) {
            price.price = present_bid_people.price;
            price.number = Bid.get_same_price(present_bid_people.price).length;
            prices.push(price);
        }
    });
    return prices;
}

Bid.get_present_bid_peoples = function () {
    var bid_peoples = _.filter(JSON.parse(localStorage.getItem('bid_peoples')), function (bid_people) {
        return bid_people.activity_name == localStorage.present_activity_name
            && bid_people.bid_name == localStorage.present_bid_name
            && bid_people.user == localStorage.user;
    });
    return bid_peoples || [];
}

Bid.judge_find_in_prices = function (prices, p) {
    return _.find(prices, function (price) {
        return price.price == p;
    });
}

Bid.get_same_price = function (price) {
    return _.filter(Bid.get_present_bid_peoples(), function (present_bid_people) {
        return  present_bid_people.price == price
    });
}

Bid.get_bid_peoples_by_price = function () {
    return _.sortBy(Bid.get_present_bid_peoples(), function (bid_people) {
        return bid_people.price
    });
}

Bid.get_bid_winner = function () {
    var win_price = _.find(Bid.get_prices(), function (price) {
        return price.number == 1;
    }) || [];
    return _.find(Bid.get_bid_peoples_by_price(), function (present_bid_people) {
        return present_bid_people.price == win_price.price;
    }) || 'fail';
}

Bid.save_bid_result = function () {
    var bid_result = Bid.init_bid_result();
    var bid_results = JSON.parse(localStorage.getItem('bid_results')) || [];
    var is_find = _.find(bid_results, function (result) {
        return result.activity_name == bid_result.activity_name
            && result.bid_name == bid_result.bid_name;
    });
    if (is_find == undefined) {
        bid_results.push(bid_result);
        localStorage.setItem('bid_results', JSON.stringify(bid_results));
    }
}

Bid.init_bid_result = function () {
    var winner = Bid.get_bid_winner();
    var bid_result = {};
    bid_result.status = 'fail';
    bid_result.user = localStorage.user;
    bid_result.activity_name = localStorage.getItem('present_activity_name');
    bid_result.bid_name = localStorage.getItem('present_bid_name');
    bid_result.name = '';
    bid_result.phone = '';
    bid_result.price = '';
    if (winner != 'fail') {
        bid_result.name = winner.name;
        bid_result.phone = winner.phone;
        bid_result.price = winner.price;
        bid_result.status = 'success';
    }
    return bid_result;
}

Bid.get_bids_of_present_user = function () {
    return _.filter(JSON.parse(localStorage.getItem('bids')), function (bid) {
        return bid.user == localStorage.user;
    });
}

Bid.get_bid_peoples_of_present_user = function () {
    return _.filter(JSON.parse(localStorage.getItem('bid_peoples')), function (bid_people) {
        return bid_people.user == localStorage.user;
    });
}

Bid.get_bid_result_of_present_user = function () {
    var bid_result = _.filter(JSON.parse(localStorage.getItem('bid_results')), function (result) {
        return result.user == localStorage.user;
    });
    if (bid_result[0] == null) {
        return [Bid.init_bid_result()];
    }
    return bid_result;
}

Bid.post_show_winner = function ($http) {
    var post_data = {bid_winner: Bid.get_bid_winner()};
    Bid.synchronous_show();
    $http.post('/show_winner_data', post_data);
}

Bid.synchronous_show = function () {
    $.ajax({
        type: "POST",
        url: "/process_phone_data",
        data: {'login_user': localStorage.user, "activities": Activity.get_activities(),
            'sign_ups': SignUp.get_sign_ups_of_present_user(), 'bids': Bid.get_bids_of_present_user(),
            'bid_peoples': Bid.get_bid_peoples_of_present_user(), 'bid_results': Bid.get_bid_result_of_present_user()}
    });
}

