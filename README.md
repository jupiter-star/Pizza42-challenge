# Pizza42

This sample demonstrate how to add authentication to a NodeJS application with Auth0. The sample Singe Page App is downloaded from Auth0 getting started guide.

Demo: https://pizza42-challenge.azurewebsites.net/ (Available for short period of time only)

* Platform: Node.js, Express
* Deployment: MS Azure
* Auth: Auth0

## Setup

### Auth0 Setup

1. Sign up https://auth0.com/signup
2. Give your app a name, Create a Single Page App by selecting second tile and select JavaScript for the technology.
2.1 Follow the QuickStart of login and Add `http://localhost:3000/` to allowed URLs as per the documentaion.

NOTE: you can either download the samples SPA provided by Auth0 or pull from this git repo. This SPA is based on the Auth0 sample SPA.

2.2 Add Google as connection and follow how to set up Google OIDC with your Auth0 app here: https://auth0.com/docs/connections/social/google

3. Create an API https://auth0.com/docs/apis#how-to-configure-an-api-in-auth0
4. Update `auth_config.json` in the current directory and obtain following details from your Auth0 account.
    * clientId: from Auth0/Applications/YourApplication/Settings/Client ID
    * domain: from Auth0/Applications/YourApplication/Settings/Domain
    * audience: from Auth0/APIS/YourAPU/Settings/Identifier
   NOTE: Never put client secret in the auth_config.json file as this will be delivered to user's browser. 
5. Create Rules from `infra/auth0/rules`
5.1 Click Create Rule and pick 'Add email to Access token' as a rule template.
5.2 Change rule name to your liking. and update the rule like below: (This adds attribute whether the email address is verified or not in the token) 
                        function addEmailToAccessToken(user, context, callback) {
                // This rule adds the authenticated user's email address to the access token.

                var namespace = 'https://example.com/';

                context.accessToken[namespace + 'email'] = user.email;
                context.accessToken[namespace + 'verified'] = user.email_verified;
                
                return callback(null, user, context);
                }
5.3 Make sure the rule is turned on.
  

### Local Setup
1. open Command promt and make the SPA folder as a current directory.
2. run npm install (to install NodeJs in the current dir)
3. Make sure you have updated the 'auth_config.json' file with the informatoin from your Auth0 account.
3. run npm start. This will start the all on http://localhost:3000
4. Browse the above url in your browser and you'll be able to navigate to the sample Pizza42 app and sign up / login with email or password or with your google account.
5. If you're using Auth0 sample app --> Open Server.js in the editing tool (I used VS code) and update the "/api/external" API call. replace the call with below code: (This ensures only verified email users can call the API / order pizza) 
    
        app.get("/api/external", checkJwt, (req, res) => {
    // Ensure user has verified email before placing order.  
    if (!req.user['https://example.com/verified']) {
        res.send({
            msg: "Please Verify your email before placing an order"
        });
    } else {
        res.send({
            msg: "Thanks for ordering Pizza 42"
        });
    }

    

#### Deployment on MS Azure
1. Sign up for Azure https://portal.aws.amazon.com/billing/signup
2. Follow the instructions / guide here: https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs?pivots=platform-windows  

NOTE: The live site is deployed on Azure - linux platform via VS Code.

## Based on
* https://github.com/auth0-samples/auth0-javascript-samples
