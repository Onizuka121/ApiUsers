let login_container = document.getElementById("login-container");
let profile_container = document.getElementById("profile-container");
profile_container.style.display = "none";
let error = document.getElementById("error");
error.style.display = "none";

let visible_pass = document.getElementById("visible-password");
let isvisible = false;
let pass_element = document.getElementById("password");
pass_element.textContent = "**********";
visible_pass.addEventListener("click",() => {
    if(isvisible){
        visible_pass.textContent = "visibility";
        pass_element.textContent = "**********";
        isvisible = false;
    }else{
        visible_pass.textContent = "visibility_off";
        pass_element.textContent = user_data.password;
        isvisible = true;
    }
  });

let user_data = {};

document.getElementById("btn-logout").addEventListener("click" , () => {
    window.location = "index.html";
});

function getData() {
  let data_form = [];
  data_form["email"] = document.getElementById("email-login").value;
  data_form["password"] = document.getElementById("password_user").value;
  return data_form;
}

async function checkUserData() {
  LookUpIp();
  let data_form = getData();
  const response = await fetch(
    "https://x8ki-letl-twmt.n7.xano.io/api:mqJfqUPm/utenti"
  );
  const utenti = await response.json();
  let isRegistrato = false;

  utenti.forEach((utente) => {
    if (utente.email == data_form["email"]) {
      if (utente.password == data_form["password"]) {
        isRegistrato = true;
        user_data = utente;
        return;
      }
    }
  });
  if (isRegistrato) {
    profile_container.style.display = "block";
    login_container.style.display = "none";
    displayDataOfUser();
  } else {
    error.style.display = "block";
    document.getElementById("email").value = "";
    document.getElementById("password_user").value = "";
  }
}

function displayDataOfUser() {
  document.getElementById("image").src = user_data.image_url;
  document.getElementById("nome-cognome").textContent = user_data.nome+" "+user_data.cognome;

  for (let [key, value] of Object.entries(user_data)) {
    let element = document.getElementById(key);
    if(element != null){
        element.textContent = value;
    }
  }
  pass_element.textContent = "**********";
}




//QUESTA FUNZIONE E STATA UTILIZZATA SOLO PER LA POPOLAZIONE DEL "DATABASE" DI XANO (API UTILIZZATA) DA UNA API CHE GENERA DEGLI UTENTI RANDOMICI
async function insertDataUsersFrom() {
  const response = await fetch("https://randomuser.me/api/");
  const users_rand = await response.json();
  let email = users_rand.results[0].email; //email
  let nome = users_rand.results[0].name.first; //first
  let cognome = users_rand.results[0].name.last; //last
  let image = users_rand.results[0].picture.medium;
  let phone = users_rand.results[0].cell;
  let pass = users_rand.results[0].login.password;
  let date = new Date(users_rand.results[0].dob.date);
  let month = date.getMonth();
  let day = date.getDay();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  let data_nascita = day + "-" + month + "-" + date.getFullYear();
  let indirizzo =
    users_rand.results[0].location.street.number +
    "," +
    users_rand.results[0].location.street.name;

  console.log(phone);

  fetch("https://x8ki-letl-twmt.n7.xano.io/api:mqJfqUPm/utenti", {
    method: "POST",
    body: JSON.stringify({
      nome: nome,
      cognome: cognome,
      data_nascita: data_nascita,
      email: email,
      password: pass,
      image_url: image,
      telefono: phone,
      indirizzo: indirizzo,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => (document.getElementById("result").textContent = json));
}

async function LookUpIp() {
  const response = await fetch("http://ip-api.com/json/");
  const res = await response.json();
  fetch("https://x8ki-letl-twmt.n7.xano.io/api:mqJfqUPm/log", {
    method: "POST",
    body: JSON.stringify({
        created_at: "now",
        ISP: res.org,
        query : res.query
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}
