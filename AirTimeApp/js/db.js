// Handle Sign In
function toggleSignIn() {
  if (firebase.auth().currentUser) {
    //Found User
    firebase.auth().signOut();
    //Set Up Display
    cleanUpUI();
  } else {
    //Sign In User
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    //TODO: Better email validation
    if (email.length < 4) {
      alert('Please enter a valid email address.');
      return;
    }
    //TODO: Better password validation
    if (password.length < 4) {
      alert('Please enter a valid password.');
      return;
    }
    // Sign in with email and pass.
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      //TODO: Better error handling
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
  }
}

// Handle Sign Up
function handleSignUp() {
  var email = document.getElementById('email_signup').value;
  var password = document.getElementById('password_signup').value;
  // TODO: Better email validation
  if (email.length < 4) {
    alert('Please enter a valid email address.');
    return;
  }
  // TODO: Better password validation
  if (password.length < 4) {
    alert('Please enter a valid password.');
    return;
  }
  // Sign in with email and pass.
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END createwithemail]

}

// Recheck notifications
function verifyNotifications(user) {
  if (user.emailVerified == false) {
    console.log('here');
    document.getElementById('email_verification_notification').style.display = 'block';
  } else {
    document.getElementById('email_verification_notification').style.display = 'none';
  }
  if (user.displayName == null || user.displayName == "") {
    document.getElementById('profile_update_notification').style.display = 'block';
  } else {
    document.getElementById('profile_update_notification').style.display = 'none';
  }
}

// Sends an email verification to the user.
function sendEmailVerification() {
  // [START sendemailverification]
  firebase.auth().currentUser.sendEmailVerification().then(function () {
    // Email Verification sent!
    // [START_EXCLUDE]
    console.log('Email Verification Sent!');
    //fix some gif or animation?
    //clear notification?

    // [END_EXCLUDE]
  });
  // [END sendemailverification]
}

// Sends an email to reset user password.
function sendPasswordReset() {
  var email = document.getElementById('email').value;
  // [START sendpasswordemail]
  firebase.auth().sendPasswordResetEmail(email).then(function () {
    // Password Reset Email Sent!
    // [START_EXCLUDE]
    alert('Password Reset Email Sent!');
    // [END_EXCLUDE]
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END sendpasswordemail];
}

// Set user meta details.
function placeUserMetaDetails(user) {
  if (user.metadata.lastSignInTime || user.metadata.creationTime) {
    document.getElementById('user-meta').style.display = 'block';

    let signupDate = new Date(user.metadata.lastSignInTime);
    let lastLogin = new Date(user.metadata.creationTime);

    document.getElementById('last-login').innerHTML = signupDate.toDateString();
    document.getElementById('signup-since').innerHTML = lastLogin.toDateString();
  }
}


//delete account 
// var user = firebase.auth().currentUser;

// user.delete().then(function() {
//   // User deleted.
// }).catch(function(error) {
//   // An error happened.
// });

// Resets user display name and updates UI
function setUserNameToFB() {
  if (firebase.auth().currentUser) {
    username = document.getElementById('updateUserDisplayName').value;
    firebase.auth().currentUser.updateProfile({
      displayName: username
    }).then(function () {
      placeUserDisplayName(firebase.auth().currentUser);
      document.getElementById('edit-modal-profile').click();
      verifyNotifications(firebase.auth().currentUser);
    }).catch(function (error) {
      alert(err.message);
    });
  }
}

// Places username where class name is found
function placeUserDisplayName(user) {
  console.log('called');
  console.log(user.displayName);
  if (user.displayName !== null || user.displayName == "") {
    for (i = 0; i < document.getElementsByClassName('username_display').length; i++) {
      document.getElementsByClassName('username_display')[i].innerText = user.displayName;
    }
  } else {
    for (i = 0; i < document.getElementsByClassName('username_display').length; i++) {
      document.getElementsByClassName('username_display')[i].innerText = "Guest";
    }
  }
}

// Show Login Screen
function showLoginScreen() {
  if (!firebase.auth().currentUser || firebase.auth().currentUser === undefined) {
    document.getElementById('login_div').style.display = 'block';
  }
}


// Hide Login Screen
function hideLoginScreen() {
  if (firebase.auth().currentUser) {
    document.getElementById('login_div').style.display = 'none';
  }
}

// Show Loader
function showLoader() {
  document.getElementById('loader').style.display = 'block';
}

// Hide Loader
function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

// Return recent credit history for user
function getRecentCreditHistory(userId) {
  console.log(userId);

  let userHistoryRef = 'users/' + userId + '/history';

  let display = document.getElementById('user-history');
  // console.log(`'/history/${userId}'`);
  firebase.database().ref(userHistoryRef).on('value', function (snapshot) {
    display.innerHTML = JSON.stringify(snapshot.val(), undefined, 2);
    // console.log(snapshot.val())
  });
}

function loadCreditHistory() {
  if (firebase.database() && firebase.auth().currentUser) {

    let db = firebase.database();

    let userId = firebase.auth().currentUser.uid;

    let dbLink = "users/" + userId + "/history";

    let userHistoryRef = db.ref(dbLink);

    let home_tab = document.getElementById('home');

    home_tab.addEventListener('click', () => {
      this.loadCreditHistory();
    })


    db.ref(userHistoryRef).on('child_added', function (snapshot, prevChildKey) {
      var newPost = snapshot.val();
      var newPostID = snapshot.key;
      console.log(snapshot);
      console.log(newPost, newPostID);
    });

  }
}

// Get API 
function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  };
  xhttp.open("GET", "https://community.ipaygh.com/v1/gateway/status_chk?invoice_id=11123456&merchant_key=tk_603a62a4-81fc-11e8-85be-f23c9170642f", true);
  xhttp.send();
}


// Toggle Logged In/Sign Up UI
function cleanUpUI() {
  document.getElementById('login_div').style.display = 'block';
  document.getElementById('navigation').style.display = 'none';
  document.getElementById('myTabContent').style.display = 'none';
  document.getElementById('contact').style.display = 'none';
  document.getElementById('ad-placeholder').style.display = 'none';
}

function toggleLoader(second) {
  let loader = document.getElementById('loader');
  let dashboard = document.getElementById('myTabContent');
  let navigation = document.getElementById('navigation');

  setTimeout(function () { loader.style.display = 'none'; }, 2000);
  // setInterval(() => {
  // loader.style.display = 'none';
  // }, second);
  // let loader = document.getElementById("loader");
  // while (loader.firstChild) {
  //   loader.removeChild(loader.firstChild);
  // }
  // loader.style.display = 'none';
  document.body.style.backgroundColor = 'white';
  dashboard.style.display = 'block';
  navigation.style.display = 'block';
  // document.getElementById('navigation').style.display = 'block';
  // document.getElementById('myTabContent').style.display = 'block';
  // document.getElementById('contact').style.display = 'block';
  // document.getElementById('ad-placeholder').style.display = 'block';
}

// Show Dashboard
function showDashboard() {
  document.getElementById('navigation').style.display = 'block';
  document.getElementById('myTabContent').style.display = 'block';
}

//BUY AIRTIME LOGIC - BEGIN
function buyAirTimeComposer() {
  //Final values
  let vendor_selection = "";
  let amount_selection = "";

  //MOVE OUT!!
  let key = "";

  let form_summary_vendor = document.getElementById('summary_vendor');
  let form_summary_amount = document.getElementById('summary_amount');
  let form_total_value = document.getElementById('total_value');
  let form_invoice = document.getElementById('invoice_id');
  let form_id_summary = document.getElementById('invoice_id_display');

  toggleCreditSelection();

  let mtn_vendor = document.getElementById('mtn_vendor');
  let vodafone_vendor = document.getElementById('vodafone_vendor');
  let airtel_vendor = document.getElementById('airtel_vendor');
  let glo_vendor = document.getElementById('glo_vendor');
  let tigo_vendor = document.getElementById('tigo_vendor');

  let selectSection = document.getElementById('pills-credit-amount-tab');
  let selectSectionBtn = document.getElementById('amount_selection_btn');

  // let confirmSection = document.getElementById('pills-process-payment');
  let confirmSection = document.getElementById('pills-process-payment-tab');
  let confirmSectionBtn = document.getElementById('payment_overview_btn');

  let no_vendor_selected_check = true;

  let checkmark = "";

  function enableSelectAmount() {
    if (no_vendor_selected_check === true) {
      selectSection.classList.remove("disabled");
      selectSectionBtn.disabled = false;
      selectSectionBtn.onclick = goToAmountSelection;
      // form_summary_vendor = vendor_selection;
      // form_summary_vendor.innerText = `Vendor: ${vendor_selection}`;
      // console.log(form_summary_vendor.innerHTML);
      // console.log(form_summary_vendor);
    }
  };

  function disableSelectAmount() {
    selectSection.classList.add("disabled");
    selectSectionBtn.disabled = true;
    no_vendor_selected_check = false;
    console.log(no_vendor_selected_check);
    // selectSectionBtn.onclick = alert('Please make a selection');
  }

  function goToAmountSelection() {
    if (!selectSection.classList.contains("disabled")) {
      selectSection.click();
    }
  }

  //toggle CSS on vendor selection and set vendor for form (also allow credit amount selection)
  function toggleVendorSelection(selectedVendor) {
    let everyChild = document.querySelectorAll("#pills-network-provider .card-modifications");
    for (var i = 0; i < everyChild.length; i++) {
      if (selectedVendor == everyChild[i].id) {
        if (everyChild[i].classList.contains('vendor-card-selected')) {
          everyChild[i].classList.toggle('vendor-card-selected');
          disableSelectAmount();
        } else {
          everyChild[i].classList.toggle('vendor-card-selected');
          form_summary_vendor.innerText = `Vendor: ${vendor_selection}`;
          no_vendor_selected_check = true;
        }
        console.log(everyChild[i].id);
      } else {
        if (everyChild[i].classList.contains('vendor-card-selected')) {
          everyChild[i].classList.remove('vendor-card-selected');
        }
      }
    }
  }

  function toggleUnitSelection(selectedUnit) {
    let everyChild = document.querySelectorAll("#pills-network-provider .card-modifications");
    for (var i = 0; i < everyChild.length; i++) {
      if (selectedVendor == everyChild[i].id) {
        if (everyChild[i].classList.contains('vendor-card-selected')) {
          everyChild[i].classList.toggle('vendor-card-selected');
          disableSelectAmount();
        } else {
          everyChild[i].classList.toggle('vendor-card-selected');
          form_summary_vendor.innerText = `Vendor: ${vendor_selection}`;
          no_vendor_selected_check = true;
        }
        console.log(everyChild[i].id);
      } else {
        if (everyChild[i].classList.contains('vendor-card-selected')) {
          everyChild[i].classList.remove('vendor-card-selected');
        }
      }
    }
  }

  mtn_vendor.addEventListener('click', function () {
    vendor_selection = "MTN";
    //add CSS Select Class
    toggleVendorSelection(mtn_vendor.id);
    // mtn_vendor.classList.toggle('vendor-card-selected');
    enableSelectAmount();
  });

  vodafone_vendor.addEventListener('click', function () {
    vendor_selection = "Vodafone";
    //add CSS Select Class
    toggleVendorSelection(vodafone_vendor.id);
    enableSelectAmount();
  });

  airtel_vendor.addEventListener('click', function () {
    vendor_selection = "Airtel";
    //add CSS Select Class
    toggleVendorSelection(airtel_vendor.id);
    enableSelectAmount();
  });

  tigo_vendor.addEventListener('click', function () {
    vendor_selection = "Tigo";
    //add CSS Select Class
    toggleVendorSelection(tigo_vendor.id);
    enableSelectAmount();
  });

  glo_vendor.addEventListener('click', function () {
    vendor_selection = "Glo";
    //add CSS Select Class
    toggleVendorSelection(glo_vendor.id);
    enableSelectAmount();
  });

  // Detect click on credit section, assign and enable confirmation screen.
  function toggleCreditSelection() {
    let everyChild = document.querySelectorAll("#pills-credit-amount .card-modifications");
    for (let index = 0; index < everyChild.length; index++) {
      let element = everyChild[index];
      element.addEventListener('click', () => {
        amount_selection = element.id;
        form_summary_amount.innerText = `Credit Amount: ${amount_selection.slice(14)}`;
        form_total_value.value = amount_selection.slice(14);
        toggleConfirmationScreen();
      });
    }
  }

  function goToPaymentOverview() {
    confirmSection.click();
    console.log(form_summary_vendor.innerText);
    form_summary_vendor.innerText = `Vendor: ${vendor_selection}`;
    form_summary_amount.innerText = `Credit Amount: ${amount_selection.slice(14)}`;
    // generateInvoiceID(vendor_selection, amount_selection.slice(14));
    console.log(`${vendor_selection} ${amount_selection}`)

  }

  // Allow users to click next button and also click the tab for order confirmation
  function toggleConfirmationScreen() {
    if (amount_selection !== "") {
      confirmSectionBtn.disabled = false;
      confirmSection.classList.remove('disabled');
      // generateInvoiceID(vendor_selection, amount_selection.slice(14));
      confirmSectionBtn.onclick = goToPaymentOverview;
    }
  }

  function finalSubmitAction(vendor_selection, amount_selection) {

    let submitBtn = document.getElementById('airtime-buy');
    let finalForm = document.getElementById('ipayghform');

    if (firebase.database() && firebase.auth().currentUser) {

      let db = firebase.database();

      let userId = firebase.auth().currentUser.uid;

      let dbLink = "users/" + userId + "/history";

      let userHistoryRef = db.ref(dbLink);

      let purchase_entry = userHistoryRef.push();
      purchase_entry.set({
        vendor: vendor_selection,
        amount: amount_selection,
        status: "Initialized"
      });

      key = purchase_entry.key;

      form_invoice.value = key;

      // method=POST id="ipayghform" action="https://community.ipaygh.com/gateway"

      // finalForm.submit();
    }
  }
}

//BUY AIRTIME LOGIC - END

function listenForResponse() {
  if (firebase.database() && firebase.auth().currentUser) {

    let db = firebase.database();

    let userId = firebase.auth().currentUser.uid;

    let api_log = '/history/api_history';

    let user_history = 'users/' + userId + '/history';

    console.log(userId);

    function extend(base) {
    var parts = Array.prototype.slice.call(arguments, 1);
    parts.forEach(function (p) {
        if (p && typeof (p) === 'object') {
            for (var k in p) {
                if (p.hasOwnProperty(k)) {
                    base[k] = p[k];
                }
            }
        }
    });
    return base;
}

    // db.ref().

    // var fb = new Firebase("https://examples-sql-queries.firebaseio.com/");
    db.ref().child('api_log').once('value', function (userSnap) {
      db.ref().child('user_history').once('value', function (mediaSnap) {
        // extend function: https://gist.github.com/katowulf/6598238
        console.log(extend({}, userSnap.val(), mediaSnap.val()));
      });
    });
  }
}

// App Init 
function initApp() {

  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(function (user) {

    if (user) {

      //BEGIN OF UI SET UP - SHOW LOADER

      // Show Loader
      showLoader();

      // User is signed in.
      hideLoginScreen();

      // Get notifications
      verifyNotifications(user);

      // Place username on UI
      placeUserDisplayName(user);

      // Placeuser meta details
      placeUserMetaDetails(user);

      // Credit purchase history js
      getRecentCreditHistory(user.uid);

      // !TODO REPOSITION THIS!
      // listenForResponse();
      
      //load user history
      loadCreditHistory();

      //END OF UI SET UP - REVEAL SCREEN
      hideLoader();
      showDashboard();

      // Listen for Buy AirTime button
      document.getElementById('profile-tab').addEventListener('click', function () {
        buyAirTimeComposer();
      });



    } else {

      // User is signed out or no user found.
      showLoginScreen();
      hideLoader();

    }
  });
}

window.onload = function () {
  initApp();
};
