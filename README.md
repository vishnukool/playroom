## Getting Started

To run the app first, install dependencies by doing:

```bash
yarn
```
Next since this app uses Okta SSO, you need to have a `.env.local` file
like below with a `clientId` and `OktaOrgUrl`

**.env.local**
```bash
REACT_APP_OKTA_CLIENT_ID={yourClientId}
REACT_APP_OKTA_ORG_URL={yourOktaOrgUrl}
```

## 1. Okta Setup

To generate the above information, you can follow the below steps.

You'll need a free Okta developer account. Install the [Okta CLI](https://cli.okta.com/) and run `okta register` to sign up for a new account. If you already have an account, run `okta login`.

Then, run `okta apps create`. Select the default app name, or change it as you see fit. Choose **Single-Page App** and press **Enter**.

Change the Redirect URI to `http://localhost:3000/login/callback` and accept the default Logout Redirect URI of `http://localhost:3000`.

The Okta CLI will create an OIDC Single-Page App in your Okta Org. It will add the redirect URIs you specified and grant access to the Everyone group. It will also add a trusted origin for `http://localhost:3000`. You will see output like the following when it's finished:

```
Okta application configuration:
Issuer:    https://dev-133337.okta.com/oauth2/default
Client ID: 0oab8eb55Kb9jdMIr5d6
```

NOTE: You can also use the Okta Admin Console to create your app. See [Create a React App](https://developer.okta.com/docs/guides/sign-into-spa/react/create-okta-application/) for more information.

Now create a file called `.env.local` in the project root and add the following variables, replacing the values with your own from the previous steps. Your Okta domain is the first part of your issuer, before `/oauth2/default`.

**.env.local**
```bash
REACT_APP_OKTA_CLIENT_ID={yourClientId}
REACT_APP_OKTA_ORG_URL={yourOktaOrgUrl}
```

## 2. Run the app

Now you can run both the Node API server and the React frontend with the same command:

```bash
yarn start:local
```

#### Acknowledgement
This project was bootstrapped from the Okta react.nodejs [git repo](https://github.com/oktadev/okta-react-node-example).