(function (options) {

    function request(url) {
        return Promise.resolve($.ajax({
            url : url,
            data: {
                "client_id" : clientId
            },
            dataType: "jsonp"
        }));
    }

    options = options || {};

    var clientId = options.clientId || "";
    var users = options.users || [];

    Promise.resolve(users)
    .then(function discoverBroadcasters(users) {
         return users.map(function (userName) {
             return request("https://api.twitch.tv/kraken/streams/"+ userName);
         });
    })
    .then(function checkOnlineOffline(broadcasters) {
        return Promise.all(
            broadcasters.map(function (promise) {
                return promise.then(function (broadcaster) {
                    var result;

                    if (broadcaster.stream) {
                        result = broadcaster.stream.channel;
                        result.online = true;
                    } else {
                        result = request(broadcaster._links.channel);
                    }

                    return Promise.resolve(result);
                });
            })
        )
    })
    .then(function (channels) {

        var rowTemplate = $("script[data-template-name='row-online-template']").text(),
            rowDescriptionTemplate = $("script[data-template-name='row-description']").text();

        return channels.map(function (channel) {

            var description = rowDescriptionTemplate
                                .replace("{{ game }}", channel.game)
                                .replace("{{ status }}", channel.status);

            return rowTemplate
                .replace("{{ online }}", channel.online ? "online" : "offline")
                .replace("{{ logo }}", channel.logo)
                .replace("{{ url }}", channel.url)
                .replace("{{ name }}", channel.name)
                .replace("{{ description }}", description);
        });
    })
    .then(function (channels) {
        channels.forEach(function (channel) {
            $(".js-display").append($(channel));
        });
    })
    .catch(function errorHandler(err) {
        console.error(err);
    })

})({
    clientId : "1v915rwzbemit2dh9i8k1kmc3sdb1rd",
    users : [
        "ESL_SC2",
        "OgamingSC2",
        "cretetion",
        "freecodecamp",
        "storbeck",
        "habathcx",
        "RobotCaleb",
        "noobs2ninjas"
    ]
});
