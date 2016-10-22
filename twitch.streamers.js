(function (options) {

    options = options || {};

    var clientId = options.clientId || "";

    function request(url) {
        $.ajax({
            url : url,
            data: {
                "client_id" : clientId
            },
            dataType: "jsonp"
        })
        .then(
            function fullfill(response) {
                console.log(response);
            },
            function reject(err) {
                console.error(err);
            }
        )
    }


    request("https://api.twitch.tv/kraken/streams/freecodecamp");


})({
    clientId : "1v915rwzbemit2dh9i8k1kmc3sdb1rd"
});
