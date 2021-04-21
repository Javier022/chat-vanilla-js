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
    // console.log("user", user);
    buttons.innerHTML = elementHtml("btn", "Sign Out", "signOut", "danger");
    userName.textContent = `${user.displayName}`;
    form.classList = "input-group py-3 fixed-bottom container";
    chatContent(user);

    logOut();
  } else {
    buttons.innerHTML = elementHtml("btn", "Sign In", "signIn", "success");
    userName.textContent = "Chat";
    contentProtected.innerHTML = elementHtml("p", "Debes iniciar sesión");
    form.classList = "input-group  py-3 fixed-bottom container d-none";

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

const chatContent = (user) => {
  const db = firebase.firestore();

  messagesRealTime(db, user);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!inputChat.value.trim()) {
      // console.log("void input, validate input");
      return;
    }

    db.collection("chats")
      .add({
        text: inputChat.value,
        uid: user.uid,
        date: Date.now(),
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));

    inputChat.value = "";
  });
};

// messages
const messagesRealTime = (db, user) => {
  db.collection("chats")
    .orderBy("date")
    .onSnapshot((query) => {
      contentProtected.innerHTML = "";

      query.docs.map((doc) => {
        console.log(doc.data());

        const data = doc.data();
        if (data.uid !== user.uid) {
          // entry message
          contentProtected.innerHTML += /*html*/ `<div class="d-flex justify-content-start my-2 ">
            <span class="badge badge-pill badge-secondary">${data.text}</span>
          </div>`;
        } else {
          // user messages
          contentProtected.innerHTML += /*html*/ `<div class="d-flex justify-content-end my-2">
          <span class="badge badge-pill badge-primary">${data.text}</span>
        </div>
      `;
        }

        contentProtected.scrollTop = contentProtected.scrollHeight;
      });
    });
};
