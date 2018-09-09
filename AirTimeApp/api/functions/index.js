const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const express = require('express');
const firebase = require('firebase');
const url = require('url');
const querystring = require('querystring');



const app = express();

app.use((req, res, next) => { //allow cross origin requests

    res.setHeader("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");

    res.header("Access-Control-Max-Age", "3600");

    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    next();

});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// var config = {
//     apiKey: "AIzaSyCtdz_Km9bPVUTCZlHG2R_Fytxw7871Fvs",
//     authDomain: "airtimeteamgh-f5427.firebaseapp.com",
//     databaseURL: "https://airtimeteamgh-f5427.firebaseio.com",
//     projectId: "airtimeteamgh-f5427",
//     storageBucket: "airtimeteamgh-f5427.appspot.com",
//     messagingSenderId: "807384400275"
// };
// firebase.initializeApp(config);

firebase.initializeApp({

    apiKey: "AIzaSyCtdz_Km9bPVUTCZlHG2R_Fytxw7871Fvs",
    authDomain: "airtimeteamgh-f5427.firebaseapp.com",
    databaseURL: "https://airtimeteamgh-f5427.firebaseio.com",
    projectId: "airtimeteamgh-f5427",
    storageBucket: "airtimeteamgh-f5427.appspot.com",
    messagingSenderId: "807384400275",
    serviceAccount: '../airtimeteamgh-f5427-firebase-adminsdk-ghoj1-890f1f0a65.json', //this is file that I downloaded from Firebase Console

});

let db = firebase.database();

let historyRef = db.ref("history/api_history/");

app.get('/gateway', (request, response) => {
    if (request.query.invoice_id) {
        let id = request.query.invoice_id;

        // let postsRef = ref.child("posts");
        let api_entry = historyRef.push();
        api_entry.set({
            name: id,
            status: "Action Needed"
        });

        // let key = api_entry.key;

        // historyRef.on('value', (snapshot) => {
        //     console.log(snapshot.val());
        // });

        response.send(id);

    } else {
        response.send('works, please send valid request though :)');
    }
});

var server = app.listen(3000, () => {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.app = functions.https.onRequest(app);
