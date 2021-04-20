const buttons = document.getElementById("buttons"),
  userName = document.getElementById("userName"),
  contentProtected = document.getElementById("contentProtected"),
  form = document.getElementById("form"),
  inputChat = document.getElementById("inputChat");

// session

firebase.auth().onAuthStateChanged((user) => {
  //
  // creating elements
  const elementHtml = (element, content, id = "", className = "") => {
    if (element === "btn") {
      return /*html*/ `<button id=${id} class="btn btn-outline-${className}">${content}</button>`;
    } else {
      return /*html*/ `<p class="text-center lead" >${content}</p>`;
    }
  };

  if (user) {
    // console.log(user);
    buttons.innerHTML = elementHtml("btn", "Sign Out", "signOut", "danger");
    userName.textContent = `${user.displayName}`;
    contentProtected.innerHTML = elementHtml("p", "Estas en el chat");
    form.classList = "input-group bg-dark py-3 fixed-bottom container";
    contentForm(user);

    logOut();
  } else {
    buttons.innerHTML = elementHtml("btn", "Sign In", "signIn", "success");
    userName.textContent = "Chat";
    contentProtected.innerHTML = elementHtml("p", "Debes iniciar sesión");
    form.classList = "input-group bg-dark py-3 fixed-bottom container d-none";

    logIn();
  }
});

const logIn = () => {
  const SignIn = document.getElementById("signIn");

  if (SignIn) {
    SignIn.addEventListener("click", async (e) => {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const authenticationWithFirebase = await firebase
          .auth()
          .signInWithPopup(provider);

        authenticationWithFirebase
          ? authenticationWithFirebase
          : console.log("Error");
      } catch (error) {
        console.log(error);
      }
    });
  }
};

const logOut = () => {
  const signOut = document.getElementById("signOut");

  if (signOut) {
    signOut.addEventListener("click", (e) => {
      try {
        const signOff = firebase.auth().signOut();

        signOff ? signOff : console.log("Error");
      } catch (error) {
        console.log(error);
      }
    });
  }
};

/* Content Form */

const contentForm = (user) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!inputChat.value.trim()) {
      // if remove white space to text and the text is void then well be false
      // but the operator of negation will pass to true, entry in the if
      // !false = true
      console.log("input vacio");

      return;
      // outside function
    }
  });
};
