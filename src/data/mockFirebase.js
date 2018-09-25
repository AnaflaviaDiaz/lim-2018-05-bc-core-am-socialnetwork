// *** para correr los test debe descomentarse  la linea 2 ***
// const firebase = require("firebase");

const config = {
  apiKey: "AIzaSyADhe8BrL2a1vVRQnECNe4np96pxkwgoSw",
  authDomain: "salutem-a2461.firebaseapp.com",
  databaseURL: "https://salutem-a2461.firebaseio.com",
  projectId: "salutem-a2461",
  storageBucket: "salutem-a2461.appspot.com",
  messagingSenderId: "953244358481"
};

// const config = {
//   apiKey: "AIzaSyDW8PIGL6vbFaMhRy0PpXtNv_e59eZYmfs",
//   authDomain: "auth-social-network.firebaseapp.com",
//   databaseURL: "https://auth-social-network.firebaseio.com",
//   projectId: "auth-social-network",
//   storageBucket: "auth-social-network.appspot.com",
//   messagingSenderId: "1041115691430"
// };

firebase.initializeApp(config);

window.logIn = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(e => {
      showWrongPassword();
      // console.log(e);
    });
}

window.facebookAccount = () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider).then(result => {
    providerFacebook(result.user);
  }).catch(error => {
    // alert(error.message);
  });
}

window.googleAccount = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(result => {
    providerGoogle(result.user);
  }).catch(error => {
    // console.log(error.message);
  });
}

window.createUser = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}
