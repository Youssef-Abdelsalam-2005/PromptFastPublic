let email = document.getElementById("pfEmail");
let pass = document.getElementById("pfPassword");
let submit = document.getElementById("pfSubmit");
let show = document.getElementById("pfDescription");
let logOut = document.getElementById("pfLogOut");
let create = document.getElementById("pfCreate");
let forgot = document.getElementById("pfForgot");
let billing = document.getElementById("pfBilling");

let logInEmail = "";

document.addEventListener("DOMContentLoaded", (event) => {
  submit.addEventListener("click", async function (e) {
    e.preventDefault();
    await login();
  });

  logOut.addEventListener("click", function (e) {
    e.preventDefault();
    firebase.auth().signOut();
  });

  create.addEventListener("click", async function (e) {
    e.preventDefault();
    try {
      let account = await firebase.auth().getUserByEmail(email.value);
      show.textContent = "Account already exists";
    } catch (e) {
      try {
        firebase.auth().createUserWithEmailAndPassword(email.value, pass.value);
        show.textContent = "Created account successfully";
        await login();
        show.textContent = "Check your email for verification";
      } catch (e) {
        console.log(e);
        show.textContent = "Something went wrong";
      }
    }
  });

  forgot.addEventListener("click", async function (e) {
    e.preventDefault();
    try {
      firebase.auth().getUserByEmail(email.value);
      try {
        await firebase.auth().sendPasswordResetEmail(email.value);
        show.textContent = "Email sent";
      } catch (e) {
        console.log(e);
        show.textContent = "Email is incorrect";
      }
    } catch (e) {
      show.textContent = "Account doesn't exist";
    }
  });

  billing.addEventListener("click", async function (e) {
    e.preventDefault();

    fetch("https://promptfast.info/get-billing", {
      method: "POST", // Specify the method as POST
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify({
        // Convert the JavaScript object to a JSON string
        email: logInEmail,
      }),
    })
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => {
        //console.log(typeof data.prompt);
        if (data.prompt == "No account info found") {
          show.textContent = "No billing information available";
        } else {
          window.open(data.prompt);
        }
      }) // Log the data to the console
      .catch((error) => {
        show.textContent = "No billing information available";
      }); // Catch any errors
  });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      logInEmail = user.email;
      if (firebase.auth().currentUser.emailVerified) {
        sayHello();
        show.textContent = "Logged in";
      } else {
        firebase.auth().currentUser.sendEmailVerification();
        show.textContent = "Check your email for verification";
      }

      logOut.disabled = false;
      submit.disabled = true;
      create.disabled = true;
      forgot.disabled = true;
      billing.disabled = false;
    } else {
      sayBye();
      logOut.disabled = true;
      submit.disabled = false;
      create.disabled = false;
      forgot.disabled = false;
      billing.disabled = true;
      show.textContent = "Not logged in";
    }
  });
});

async function login() {
  logInEmail = email.value;
  e = email.value;
  p = pass.value;
  try {
    await firebase.auth().signInWithEmailAndPassword(e, p);
  } catch (e) {
    console.log(e);
    show.textContent = "Invalid email or password";
  }
}
console.log("working");

async function sayHello() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let tokenID = await firebase
    .auth()
    .currentUser.getIdToken(/* forceRefresh */ true);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [tokenID, logInEmail],
    func: function (tokenID, logInEmail) {
      if (document.getElementById("pf") == null) {
        let button = document.createElement("button");
        button.textContent = "Get Prompt";
        button.style.cssText = `
        border: 1px solid white;
        border-radius: 8px;
        width: 18%;
        margin: auto;
        background-color: white;
        color: black;
        margin-bottom: 13px;
        font-weight: 500;
        cursor: default;
        opacity: 0.2;
      
        transition: all 0.15s ease-in-out;

        `;
        button.id = "pf";
        console.log("no button");

        button.type = "button";

        button.disabled = true;

        document
          .getElementById("prompt-textarea")
          .addEventListener("input", (e) => {
            if (e.target.value != "") {
              button.style.opacity = "1";
              button.disabled = false;
              button.style.cursor = "pointer";
            } else {
              button.style.opacity = "0.2";
              button.disabled = true;
              button.style.cursor = "default";
            }
          });

        button.addEventListener("click", async function () {
          document.getElementById("prompt-textarea").value =
            "Generating Prompt...";
          button.style.opacity = "0.2";
          button.disabled = true;
          button.style.cursor = "default";
          fetch("https://promptfast.info/generate-prompt", {
            method: "POST", // Specify the method as POST
            headers: {
              "Content-Type": "application/json", // Set the content type to JSON
            },
            body: JSON.stringify({
              // Convert the JavaScript object to a JSON string
              message: document.getElementById("prompt-textarea").value, // Replace with the actual message
              token: tokenID,
              email: logInEmail,
            }),
          })
            .then((response) => response.json()) // Parse the response as JSON
            .then((data) => {
              console.log(data);
              document.getElementById("prompt-textarea").style.height = "268px";
              document.getElementById("prompt-textarea").value = data.prompt;
              if (data.prompt != "User has not payed") {
                document.getElementById("prompt-textarea").style.height =
                  "268px";
              }
            }) // Log the data to the console
            .catch((error) => {
              console.error("Error:", error);
              document.getElementById("prompt-textarea").value =
                "Error loading prompt";
            }); // Catch any errors
        });

        document
          .querySelector(
            ".overflow-hidden.flex.flex-col.w-full.flex-grow.relative.border.rounded-2xl.bg-token-main-surface-primary.border-token-border-medium"
          )
          .appendChild(button);
      } else {
        button = document.getElementById("pf");
        button.addEventListener("click", async function () {
          document.getElementById("prompt-textarea").value =
            "Generating Prompt...";
          button.style.opacity = "0.2";
          button.disabled = true;
          button.style.cursor = "default";
          fetch("https://promptfast.info/generate-prompt", {
            method: "POST", // Specify the method as POST
            headers: {
              "Content-Type": "application/json", // Set the content type to JSON
            },
            body: JSON.stringify({
              // Convert the JavaScript object to a JSON string
              message: document.getElementById("prompt-textarea").value, // Replace with the actual message
              token: tokenID,
              email: logInEmail,
            }),
          })
            .then((response) => response.json()) // Parse the response as JSON
            .then((data) => {
              console.log(data);
              document.getElementById("prompt-textarea").value = data.prompt;
              if (data.prompt != "User has not payed") {
                document.getElementById("prompt-textarea").style.height =
                  "268px";
              }
            }) // Log the data to the console
            .catch((error) => {
              console.error("Error:", error);
              document.getElementById("prompt-textarea").value =
                "Error loading prompt";
            }); // Catch any errors
        });
      }
    },
  });
}

async function sayBye() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: function () {
      let button = document.getElementById("pf");
      button.parentNode.removeChild(button);
    },
  });
}
