var pubnub_flex_history = function (args1, completed) {

    var self = this;

    var result = {
        count: 0,
        start: 0,
        end: 0,
        channel: args1.channel,
        messages: [],
        operation: "undefined",
        operationValue: "undefined"
    };

    result.operation = (args1.hasOwnProperty('last') ? "last" : result.operation);
    result.operation = (args1.hasOwnProperty('since') ? "since" : result.operation);
    result.operation = (args1.hasOwnProperty('upto') ? "upto" : result.operation);
    result.operation = (args1.hasOwnProperty('between') ? "between" : result.operation);
    result.operation = (args1.hasOwnProperty('at') ? "at" : result.operation);
    result.operation = (args1.hasOwnProperty('getrange') ? "getrange" : result.operation);


    if (!args1.hasOwnProperty('channel')) {
        console.error("ERROR: pubnub_flex_history requires a channel specified in options object");
        result.channel = null;
        result.error = true;
        result.errorMessage = "channel not specified";
        completed(result);
        return;
    }

    var params = {
        channel: args1.channel,
        include_token: true
    };

    //Convert Epoch timestamps to Timetokens, convert strings to integers
    function checkTimetoken(t) {
        if (t.toString().length < 12) {
            return parseInt(t) * 10000000;
        }
        else {
            return parseInt(t);
        }
    }

    // Get Page from history API
    function getPage(args2, callback) {
        args2.callback = function (m) {
            //console.log("getPageResult", m);
            //console.log(parseInt(m[2]) - parseInt(m[1]));
            //console.log("");
            callback({
                start: parseInt(m[1]),
                end: parseInt(m[2]),
                count: m[0].length,
                messages: m[0]
            });
        };

        args2.error = function(e) {
            callback({
                error: true,
                errorObject: e,
                errorMessage: e.toString()
            });
        };

        self.history(args2);
    }



    //*****************************************
    // Process Arguments
    //*****************************************


    // Most recent (last: count)
    if (args1.hasOwnProperty('last')) {

        result.operationValue = args1.last;

        // If retrieving less than 100
        if (parseInt(args1.last) <= 100) {
            params.count = args1.last;
            getPage(params, function (r) {
                for (var attrname in r) {
                    result[attrname] = r[attrname];
                }
                completed(result);
            });
        }

        // If retrieving more than 100
        if (parseInt(args1.last) > 100) {

            function lastNextPage() {
                params.count = (args1.last - result.count >= 100 ? 100 : args1.last - result.count );

                getPage(params, function (r) {

                    result.count += r.count;
                    Array.prototype.push.apply(result.messages, r.messages);

                    if (r.start < result.start || result.start === 0) {
                        result.start = r.start;
                    }

                    if (r.end > result.end) {
                        result.end = r.end;
                    }

                    if (result.count < args1.last) {
                        params.end = r.start;  // since going in reverse order
                        lastNextPage();
                    }
                    else {
                        completed(result);
                    }
                });
            }

            lastNextPage();

        }
    }
    // Since timetoken (since: timetoken or epoch)
    else if (args1.hasOwnProperty('since')) {

        result.operationValue = args1.since;

        params.start = checkTimetoken(args1.since);
        params.reverse = true;

        function sinceNextPage() {

            getPage(params, function (r) {

                result.count += r.count;
                Array.prototype.push.apply(result.messages, r.messages);

                if (r.start < result.start || result.start === 0) {
                    result.start = r.start;
                }

                if (r.end > result.end) {
                    result.end = r.end;
                }

                // continue paging if returns whole page
                if (r.count === 100) {
                    params.start = r.end;
                    sinceNextPage();
                }
                else {
                    completed(result);
                }
            });
        }

        sinceNextPage();
    }
    // Upto a timetoken (since: timetoken or epoch) [from first message in channel]
    else if (args1.hasOwnProperty('upto')) {

        result.operationValue = args1.upto;

        params.end = checkTimetoken(args1.upto);
        params.reverse = true;

        function uptoNextPage() {

            getPage(params, function (r) {

                result.count += r.count;
                Array.prototype.push.apply(result.messages, r.messages);

                if (r.start < result.start || result.start === 0) {
                    result.start = r.start;
                }

                if (r.end > result.end) {
                    result.end = r.end;
                }

                // continue paging if returns whole page
                if (r.count === 100) {
                    params.start = r.end;
                    uptoNextPage();
                }
                else {
                    completed(result);
                }
            });
        }

        uptoNextPage();
    }
    // Range of messages in channel
    else if (args1.hasOwnProperty('getrange')) {

        result.operationValue = true;
        result.messages = {};

        params.count = 1;


        // get latest message
        getPage(params, function (r) {

            result.messages.last = r.messages[0];

            if (r.end > result.end) {
                result.end = r.end;
                var utcs = (r.end / 10000000) | 0;
                var s = new Date(0);
                s.setUTCSeconds(utcs);
                result.endE = utcs;
                result.endD = s.toString();
            }

            if (result.start > 0 && result.end > 0) {
                completed(result);
            }
        });

        // get first message
        params.reverse = true;
        getPage(params, function (r) {

            result.messages.first = r.messages[0];
            if (r.start < result.start || result.start === 0) {
                result.start = r.start;
                var utcs = (r.start / 10000000) | 0;
                var s = new Date(0);
                s.setUTCSeconds(utcs);
                result.startE = utcs;
                result.startD = s.toString();
            }

            if (result.start > 0 && result.end > 0) {
                completed(result);
            }
        });

    }
    // Between Timetokens (between: [timetoken, timetoken] (or epoch))
    else if (args1.hasOwnProperty('between')) {

        result.operationValue = args1.between;

        var start = checkTimetoken(args1.between[0]);
        var end = checkTimetoken(args1.between[1]);

        if (start > end) {
            start = end;
            end = checkTimetoken(args1.between[0]);
        }

        params.start = start;
        params.end = end;
        params.reverse = true;

        function betweenNextPage() {

            getPage(params, function (r) {

                result.count += r.count;
                Array.prototype.push.apply(result.messages, r.messages);

                if (r.start < result.start || result.start === 0) {
                    result.start = r.start;
                }

                if (r.end > result.end) {
                    result.end = r.end;
                }

                // continue paging if returns whole page
                if (r.count === 100) {
                    params.start = r.end;
                    betweenNextPage();
                }
                else {
                    completed(result);
                }
            });
        }

        betweenNextPage();

    }
    // At moment in time (at: timetoken or epoch)
    else if (args1.hasOwnProperty('at')) {

        result.operationValue = args1.at;

        params.start = checkTimetoken(args1.at);
        params.count = 1;

        getPage(params, function (r) {

            result.count += r.count;
            Array.prototype.push.apply(result.messages, r.messages);

            if (r.count > 0 && (r.start < result.start || result.start === 0)) {
                result.start = r.start;
            }

            if (r.count > 0 && r.end > result.end) {
                result.end = r.end;
            }

            completed(result);
        });
    }
    else {
        console.error("ERROR: pubnub_flex_history operation required, one of [last, since, getrange, between, at]");
        result.error = true;
        result.errorMessage = "operation required, one of [last, since, getrange, upto, between, at]";
        result.errorArgs = args1;
        completed(result);
    }
};