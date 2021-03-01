var ManagementClient = require('auth0').ManagementClient;
var auth0 = new ManagementClient({
    domain: "<your auth0 domain>",
    clientId: "<your app clientId>",
    clientSecret: '<uodate with your app client secret>',
    scope: 'read:users update:users'
});

exports.updateUserMetadata = (userId, pizzaName) => {

    auth0
        .getUser(userId)
        .then(function (user) {
            var currentMetadata = user[0].user_metadata;

            // console.log(user);
            // console.log(currentMetadata);
            if (typeof currentMetadata !== 'undefined' && currentMetadata !== null) {
               
                currentMetadata.Orders.push(pizzaName);
            } else {
                currentMetadata = {
                    Orders: [pizzaName]
                }
            }

            var params = { id: userId };
            var metadata = currentMetadata;

            auth0.updateUserMetadata(params, metadata, function (err, user) {
                if (err) {
                    console.log(err);
                }

                // Updated user.
                console.log(user);
            });
        })
        .catch(function (err) {
            console.log(err);
        });
}