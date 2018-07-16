// sections
const sectionLogIn = document.getElementById("main-log-in");
const sectionUserSelection = document.getElementById("select-user");
const sectionSignUpDoctors = document.getElementById("main-sign-up-doctors");
const sectionSignUpUsers = document.getElementById("main-sign-up-users");
const sectionResponseLogIn = document.getElementById("response-log-in");
const sectionResponseSignUp = document.getElementById("response-sign-up");
const sectionLogOut = document.getElementById("log-out");

// botones
const btnLogIn = document.getElementById("btn-log-in");
const btnSignUpDoctors = document.getElementById("btn-sign-up-doctors");
const btnSignUpUsers = document.getElementById("btn-sign-up-users");
const btnLogOut = document.getElementById("btn-log-out");
const btnGoogleLogIn = document.getElementById("btn-google-log-in");
const btnFacebookLogIn = document.getElementById("btn-fb-log-in");

// inputs
const txtEmailLogIn = document.getElementById("txt-user-mail-login");
const txtPasswordLogIn = document.getElementById("txt-user-password-login");
const txtEspecialidad = document.getElementById("specialty");
const txtColegiatura = document.getElementById("colegiatura");
const txtDoctorNameSignUp = document.getElementById("txt-doctor-name-signup");
const txtDoctorEmailSignUp = document.getElementById("txt-doctor-mail-signup");
const txtDoctorPasswordSignUp = document.getElementById("txt-doctor-password-signup");
const txtDoctorConfirmPasswordSignUp = document.getElementById("txt-doctor-confirm-password-signup");
const txtUserNameSignUp = document.getElementById("txt-user-name-signup");
const txtUserEmailSignUp = document.getElementById("txt-user-mail-signup");
const txtUserPasswordSignUp = document.getElementById("txt-user-password-signup");
const txtUserConfirmPasswordSignUp = document.getElementById("txt-user-confirm-password-signup");

// enlaces
const goToSignUp = document.getElementById("go-to-sign-up");
const goToLogInFromDoctors = document.getElementById("go-to-log-in-doctors");
const goToLogInFromUsers = document.getElementById("go-to-log-in-users");
const goToSignUpDoctors = document.getElementById("sign-up-selection-doctors");
const goToSignUpUsers = document.getElementById("sign-up-selection-users");

// modals
const modalDoctors = document.getElementById('modal-doctors');
const modalUsers = document.getElementById("modal-users");
const closeModalDoctors = document.getElementsByClassName("close")[0];
const closeModalUsers = document.getElementsByClassName("close")[1];

// modals buttons
const btnModalSignUpDoctors = document.getElementById("btn-email-modal-sign-up-doctors");
const btnModalFbSignUpDoctors = document.getElementById("btn-fb-modal-sign-up-doctors");
const btnModalGgSignUpDoctors = document.getElementById("btn-gg-modal-sign-up-doctors");
const btnModalSignUpUsers = document.getElementById("btn-email-modal-sign-up-users");
const btnModalFbSignUpUsers = document.getElementById("btn-fb-modal-sign-up-users");
const btnModalGgSignUpUsers = document.getElementById("btn-gg-modal-sign-up-users");

// labels helpers
const helperEmailLogIn = document.getElementById("incorrect-email");
const helperPasswordLogIn = document.getElementById("incorrect-password");
const helperEspecialidad = document.getElementById("incorrect-specialty");
const helperColegiatura = document.getElementById("incorrect-colegiatura");
const helperNameDoctorSignUp = document.getElementById("incorrect-doctor-name-sign-up");
const helperEmailDoctorSignUp = document.getElementById("incorrect-doctor-mail-sign-up");
const helperPasswordDoctorSignUp = document.getElementById("incorrect-doctor-password-sign-up");
const helperConfirmPasswordDoctorSignUp = document.getElementById("incorrect-doctor-confirm-password-sign-up");
const helperNameUserSignUp = document.getElementById("incorrect-user-name-sign-up");
const helperEmailUserSignUp = document.getElementById("incorrect-user-email-sign-up");
const helperPasswordUserSignUp = document.getElementById("incorrect-user-password-sign-up");
const helperConfirmPasswordUserSignUp = document.getElementById("incorrect-user-confirm-password-sign-up");

const patronEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

const user = {
  name: '',
  email: '',
  password: '',
  type: ''
}

const config = {
  apiKey: "AIzaSyADhe8BrL2a1vVRQnECNe4np96pxkwgoSw",
  authDomain: "salutem-a2461.firebaseapp.com",
  databaseURL: "https://salutem-a2461.firebaseio.com",
  projectId: "salutem-a2461",
  storageBucket: "salutem-a2461.appspot.com",
  messagingSenderId: "953244358481"
};

firebase.initializeApp(config);

window.onload = () => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      sectionLogIn.hidden = true;
      sectionResponseLogIn.hidden = false;
      sectionLogOut.hidden = false;
      sectionUserSelection.hidden = true;
      modalUsers.style.display = "none";
      modalDoctors.style.display = "none";
      // User is signed in.
      // const displayName = user.displayName;
      // const email = user.email;
      // const emailVerified = user.emailVerified;
      // const photoURL = user.photoURL;
      // const uid = user.uid;
    } else {
      M.updateTextFields();
    }
  });
}

const logOut = () => {
  firebase.auth().signOut().then(() => {
    txtEmailLogIn.value = "";
    txtPasswordLogIn.value = "";
    // doctores
    txtEspecialidad.value = "";
    txtColegiatura.value = "";
    txtDoctorNameSignUp.value = "";
    txtDoctorEmailSignUp.value = "";
    txtDoctorPasswordSignUp.value = "";
    txtDoctorConfirmPasswordSignUp.value = "";
    //pacientes
    txtUserNameSignUp.value = "";
    txtUserEmailSignUp.value = "";
    txtUserPasswordSignUp.value = "";
    txtUserConfirmPasswordSignUp.value = "";

    sectionLogOut.hidden = true;
    sectionResponseLogIn.hidden = true;
    sectionUserSelection.hidden = true;
    sectionResponseSignUp.hidden = true;
    // formularios de email
    sectionSignUpUsers.hidden = true;
    sectionSignUpDoctors.hidden = true;
    // cuando se salga de sesión para cualquier caso siempre se mostrará el login
    sectionLogIn.hidden = false;
  });
}

const logIn = () => {
  const auth = firebase.auth();
  const promise = auth.signInWithEmailAndPassword(user.email, user.password);
  promise.catch(e => {
    helperPasswordLogIn.hidden = false;
  });
}

const validateLogIn = () => {
  if (txtEmailLogIn.value.length > 0 && patronEmail.test(txtEmailLogIn.value)) {
    helperEmailLogIn.hidden = true;
    if (txtPasswordLogIn.value !== "" && txtPasswordLogIn.value !== null) {
      helperPasswordLogIn.hidden = true;
      user.email = txtEmailLogIn.value;
      user.password = txtPasswordLogIn.value;
      if (user.email !== "" && user.password !== "") {
        logIn();
      }
    } else {
      helperPasswordLogIn.hidden = false;
    }
  } else {
    helperEmailLogIn.hidden = false;
  }
}

const showMuro = () => {
  document.getElementById("user-name-sign-up").innerHTML = user.name;
  sectionSignUpDoctors.hidden = true;
  sectionSignUpUsers.hidden = true;
  sectionResponseSignUp.hidden = false;
  sectionLogOut.hidden = false;
}

const signUpByDoctors = () => {
  const auth = firebase.auth();
  const promise = auth.createUserWithEmailAndPassword(user.email, user.password).then(() => {
    const x = firebase.auth().currentUser;
    if (x) {
      x.sendEmailVerification().then(() => {
        console.log("se envió correo de verificación de cuenta al correo");
        showMuro();
      }).catch(function (error) {
        alert(error);
      });
    }
  });
  promise.catch(e => alert(e.message));
}

//validaciones de signup divisiones para users
const ableSignUpByDoctors = () => {
  let name, email, password, confirmPassword;
  //nombre
  if (txtDoctorNameSignUp.value.length > 0) {
    name = true;
  } else if (!txtDoctorNameSignUp.value.length > 0) {
    name = false;
  }
  //email
  if (txtDoctorEmailSignUp.value.length > 0 && patronEmail.test(txtDoctorEmailSignUp.value)) {
    email = true;
  } else if (txtDoctorEmailSignUp.value.length === 0 || !patronEmail.test(txtDoctorEmailSignUp.value)) {
    email = false;
  }
  //new password
  if (txtDoctorPasswordSignUp.value.length >= 6) {
    password = true;
  } else if (txtDoctorPasswordSignUp.value.length < 6) {
    password = false;
  }
  //confirm password
  if (txtDoctorConfirmPasswordSignUp.value.length >= 6 && txtDoctorConfirmPasswordSignUp.value === txtDoctorPasswordSignUp.value) {
    confirmPassword = true;
  } else if (txtDoctorConfirmPasswordSignUp.value.length < 6 || txtDoctorConfirmPasswordSignUp.value !== txtDoctorPasswordSignUp.value) {
    confirmPassword = false;
  }
  // si todas las etiquetas estan ocultas hará el registro
  if (name && email && password && confirmPassword) {
    user.name = txtDoctorNameSignUp.value;
    user.email = txtDoctorEmailSignUp.value;
    user.password = txtDoctorPasswordSignUp.value;
    signUpByDoctors();
  }
}

const signUpUsers = (e) => {
  if (e.currentTarget.id === "btn-email-modal-sign-up-users") {
    sectionSignUpUsers.hidden = false;
    sectionUserSelection.hidden = true;
    modalUsers.style.display = "none";
  } else {
    txtEspecialidad.value = "";
    txtColegiatura.value = "";
    // aqui se deberia mostrar el signup para los doctores
    sectionSignUpDoctors.hidden = false;
    sectionUserSelection.hidden = true;
    modalDoctors.style.display = "none";
  }
}

const signUpByUsers = () => {
  const auth = firebase.auth();
  const promise = auth.createUserWithEmailAndPassword(user.email, user.password).then(() => {
    const x = firebase.auth().currentUser;
    if (x) {
      x.sendEmailVerification().then(() => {
        console.log("se envió correo de verificación de cuenta al correo");
        showMuro();
      }).catch(function (error) {
        alert(error);
      });
    }
  });
  promise.catch(e => alert(e.message));
}

//validaciones de signup divisiones para users
const ableSignUpByUsers = () => {
  let name, email, password, confirmPassword;
  //nombre
  if (txtUserNameSignUp.value.length > 0) {
    name = true;
  } else if (!txtUserNameSignUp.value.length > 0) {
    name = false;
  }
  //email
  if (txtUserEmailSignUp.value.length > 0 && patronEmail.test(txtUserEmailSignUp.value)) {
    email = true;
  } else if (txtUserEmailSignUp.value.length === 0 || !patronEmail.test(txtUserEmailSignUp.value)) {
    email = false;
  }
  //new password
  if (txtUserPasswordSignUp.value.length >= 6) {
    password = true;
  } else if (txtUserPasswordSignUp.value.length < 6) {
    password = false;
  }
  //confirm password
  if (txtUserConfirmPasswordSignUp.value.length >= 6 && txtUserConfirmPasswordSignUp.value === txtUserPasswordSignUp.value) {
    confirmPassword = true;
  } else if (txtUserConfirmPasswordSignUp.value.length < 6 || txtUserConfirmPasswordSignUp.value !== txtUserPasswordSignUp.value) {
    confirmPassword = false;
  }
  // si todas las etiquetas estan ocultas hará el registro
  if (name && email && password && confirmPassword) {
    user.name = txtUserNameSignUp.value;
    user.email = txtUserEmailSignUp.value;
    user.password = txtUserPasswordSignUp.value;
    signUpByUsers();
  }
}

const showSignUp = () => {
  txtEmailLogIn.value = "";
  txtPasswordLogIn.value = "";
  sectionLogIn.hidden = true;
  sectionUserSelection.hidden = false;
}

const showLogIn = () => {
  if (txtEmailLogIn !== "" && txtPasswordLogIn !== "") {
    txtEmailLogIn.value = "";
    txtPasswordLogIn.value = "";
  }
  sectionSignUpUsers.hidden = true;
  sectionSignUpDoctors.hidden = true;
  sectionLogIn.hidden = false;
}

const googleAccount = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function (result) {
    const person = result.user;
    document.getElementById("user-name-log-in").innerHTML = `Bienvenido a Salutem ${person.displayName}`;
  }).catch(function (error) {
    // console.log(error.code);
    // console.log(error.message);
  });
}

const facebookAccount = () => {
  const provider = new firebase.auth.FacebookAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function (result) {
    const person = result.user;
    document.getElementById("user-name-log-in").innerHTML = `Bienvenido a Salutem ${person.displayName}`;
  }).catch(function (error) {
    // console.log(error.code);
    // console.log(error.message);
  });
}

let openModal = (e) => {
  M.updateTextFields();
  if (e.currentTarget.id === "sign-up-selection-users") {
    modalUsers.style.display = "block";
  } else {
    modalDoctors.style.display = "block";
  }
};

let closeModel = (e) => {
  if (e.currentTarget.offsetParent.id === "modal-users") {
    modalUsers.style.display = "none";
  } else {
    modalDoctors.style.display = "none";
    txtEspecialidad.value = "";
    txtColegiatura.value = "";
  }
};

btnLogIn.addEventListener("click", () => validateLogIn());
goToSignUp.addEventListener("click", () => showSignUp());
goToSignUpDoctors.addEventListener("click", (e) => openModal(e));
goToSignUpUsers.addEventListener("click", (e) => openModal(e));
closeModalDoctors.addEventListener("click", (e) => closeModel(e));
closeModalUsers.addEventListener("click", (e) => closeModel(e));
goToLogInFromDoctors.addEventListener("click", () => showLogIn());
goToLogInFromUsers.addEventListener("click", () => showLogIn());
btnSignUpDoctors.addEventListener("click", () => ableSignUpByDoctors());
btnSignUpUsers.addEventListener("click", () => ableSignUpByUsers()); //signUpByUsers
btnGoogleLogIn.addEventListener("click", () => googleAccount());
btnFacebookLogIn.addEventListener("click", () => facebookAccount());
btnLogOut.addEventListener("click", () => logOut());

//button modal
btnModalSignUpDoctors.addEventListener("click", (e) => {
  if (txtColegiatura.value.length > 0 && txtEspecialidad.value.length) {
    helperColegiatura.hidden = true;
    helperEspecialidad.hidden = true;
    signUpUsers(e)
  } else {
    helperColegiatura.hidden = false;
    helperEspecialidad.hidden = false;
  }
});
btnModalFbSignUpDoctors.addEventListener("click", () => {
  if (txtColegiatura.value.length > 0 && txtEspecialidad.value.length) {
    helperColegiatura.hidden = true;
    helperEspecialidad.hidden = true;
    facebookAccount();
  } else {
    helperColegiatura.hidden = false;
    helperEspecialidad.hidden = false;
  }
});
btnModalGgSignUpDoctors.addEventListener("click", () => {
  if (txtColegiatura.value.length > 0 && txtEspecialidad.value.length) {
    helperColegiatura.hidden = true;
    helperEspecialidad.hidden = true;
    googleAccount();
  } else {
    helperColegiatura.hidden = false;
    helperEspecialidad.hidden = false;
  }
});
btnModalSignUpUsers.addEventListener("click", (e) => signUpUsers(e));
btnModalFbSignUpUsers.addEventListener("click", () => facebookAccount());
btnModalGgSignUpUsers.addEventListener("click", () => googleAccount());

txtDoctorNameSignUp.addEventListener("keyup", () => {
  if (txtDoctorNameSignUp.value.length > 0) {
    helperNameDoctorSignUp.hidden = true;
  } else if (!txtDoctorNameSignUp.value.length > 0) {
    helperNameDoctorSignUp.hidden = false;
  }
});
txtDoctorEmailSignUp.addEventListener("keyup", () => {
  if (txtDoctorEmailSignUp.value.length > 0 && patronEmail.test(txtDoctorEmailSignUp.value)) {
    helperEmailDoctorSignUp.hidden = true;
  } else if (txtDoctorEmailSignUp.value.length === 0 || !patronEmail.test(txtDoctorEmailSignUp.value)) {
    helperEmailDoctorSignUp.hidden = false;
  }
});
txtDoctorPasswordSignUp.addEventListener("keyup", () => {
  if (txtDoctorPasswordSignUp.value.length >= 6) {
    helperPasswordDoctorSignUp.hidden = true;
    password = true;
  } else if (txtDoctorPasswordSignUp.value.length < 6) {
    helperPasswordDoctorSignUp.hidden = false;
    password = false;
  }
});
txtDoctorConfirmPasswordSignUp.addEventListener("keyup", () => {
  if (txtDoctorConfirmPasswordSignUp.value.length >= 6 && txtDoctorConfirmPasswordSignUp.value === txtDoctorPasswordSignUp.value) {
    helperConfirmPasswordDoctorSignUp.hidden = true;
    confirmPassword = true;
  } else if (txtDoctorConfirmPasswordSignUp.value.length < 6 || txtDoctorConfirmPasswordSignUp.value !== txtDoctorPasswordSignUp.value) {
    helperConfirmPasswordDoctorSignUp.hidden = false;
    confirmPassword = false;
  }
});

txtUserNameSignUp.addEventListener("keyup", () => {
  if (txtUserNameSignUp.value.length > 0) {
    helperNameUserSignUp.hidden = true;
  } else if (!txtUserNameSignUp.value.length > 0) {
    helperNameUserSignUp.hidden = false;
  }
});
txtUserEmailSignUp.addEventListener("keyup", () => {
  if (txtUserEmailSignUp.value.length > 0 && patronEmail.test(txtUserEmailSignUp.value)) {
    helperEmailUserSignUp.hidden = true;
  } else if (txtUserEmailSignUp.value.length === 0 || !patronEmail.test(txtUserEmailSignUp.value)) {
    helperEmailUserSignUp.hidden = false;
  }
});
txtUserPasswordSignUp.addEventListener("keyup", () => {
  if (txtUserPasswordSignUp.value.length >= 6) {
    helperPasswordUserSignUp.hidden = true;
  } else if (txtUserPasswordSignUp.value.length < 6) {
    helperPasswordUserSignUp.hidden = false;
  }
});
txtUserConfirmPasswordSignUp.addEventListener("keyup", () => {
  if (txtUserConfirmPasswordSignUp.value.length >= 6 && txtUserConfirmPasswordSignUp.value === txtUserPasswordSignUp.value) {
    helperConfirmPasswordUserSignUp.hidden = true;
  } else if (txtUserConfirmPasswordSignUp.value.length < 6 || txtUserConfirmPasswordSignUp.value !== txtUserPasswordSignUp.value) {
    helperConfirmPasswordUserSignUp.hidden = false;
  }
});
