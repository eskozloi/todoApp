<script setup lang="ts">
const bgParticlesNum = 10;

const validBorder = "1px solid rgba(255, 255, 255, 0.4)";
const invalidBorder = "2px solid rgba(255, 0, 0, 0.4)";

const credentials = ref({
  email: {
    placeholder: "Email",
    type: "email",
    value: ref(""),
    valid: true,
    border: validBorder,
    regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g,
    regOnly: false,
    aditionalCheck: async () => {
      checkIfUserExists();
    },
  },
  password: {
    placeholder: "Password",
    type: "password",
    value: ref(""),
    valid: true,
    border: validBorder,
    regex: /.{6,}/g,
    regOnly: false,
  },
  passwordConfirmation: {
    placeholder: "Password Confirmation",
    type: "password",
    reference: "password",
    value: ref(""),
    valid: true,
    border: validBorder,
    regOnly: true,
  },
});

const newUser = ref(false);
const submited = ref(false);

const auth = authStore();

const checkIfUserExists = async () => {
  auth.checkIfUserExists(credentials.value.email.value).then((exist) => {
    if (exist) newUser.value = false;
    else newUser.value = true;
  });
};

const validate = async (key) => {
  let refKey: string;
  if (
    ((refKey = credentials.value[key].reference) && credentials.value[key].value === credentials.value[refKey].value) ||
    (!refKey && credentials.value[key].value.match(credentials.value[key].regex))
  ) {
    credentials.value[key].valid = true;
    credentials.value[key].border = validBorder;
    if (credentials.value[key].aditionalCheck) credentials.value[key].aditionalCheck();
  } else {
    credentials.value[key].valid = false;
    credentials.value[key].border = invalidBorder;
  }
};

const authenticateUser = async () => {
  const invalidData = Object.entries(credentials.value).find(([key, item]) => {
    if (key === "passwordConfirmation" && !newUser.value) return false;
    validate(key);
    return !item.valid;
  });
  if (!invalidData) {
    submited.value = true;
    if (newUser.value)
      await auth.register({ email: credentials.value.email.value, password: credentials.value.password.value });
    else await auth.login({ email: credentials.value.email.value, password: credentials.value.password.value });
    return navigateTo("/");
  }
};
</script>

<template>
  <div>
    <div class="wrapper">
      <div class="container">
        <h1 :class="{ moveDown: submited }">Welcome</h1>
        <form class="form" :class="{ hide: submited }" @submit.prevent>
          <div v-for="(credential, key) in credentials">
            <input
              v-if="!credential.regOnly || newUser"
              :type="credential.type"
              :placeholder="credential.placeholder"
              :style="{ border: credential.border }"
              v-model="credential.value"
              @focusout="validate(key)"
            />
          </div>
          <button v-if="newUser" type="submit" @click="authenticateUser">Sign in</button>
          <button v-else type="submit" @click="authenticateUser">Log in</button>
        </form>
      </div>

      <ul class="bg-bubbles">
        <li v-for="particle in bgParticlesNum"></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300);
::-webkit-input-placeholder {
  /* WebKit browsers */
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  font-weight: 300;
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  opacity: 1;
  font-weight: 300;
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  opacity: 1;
  font-weight: 300;
}
:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  font-weight: 300;
}
/*::placeholde {
  color: white;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 300;
}*/
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-moz-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-webkit-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-o-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-ms-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.hide {
  animation: fadeOut ease 0.5s;
  -webkit-animation: fadeOut ease 0.5s;
  -moz-animation: fadeOut ease 0.5s;
  -o-animation: fadeOut ease 0.5s;
  -ms-animation: fadeOut ease 0.5s;
  animation-fill-mode: forwards;
  /*visibility: hidden;*/
  /*opacity: 0;
  transition: visibility 0s 2s, opacity 2s linear;*/
}
.wrapper {
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  font-weight: 300;
  background: #50a3a2;
  background: linear-gradient(to top left, #50a3a2 0%, #53e3a6 100%);
  background: linear-gradient(to bottom right, #50a3a2 0%, #53e3a6 100%);
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.moveDown {
  transform: translateY(85px);
}
.container {
  max-width: 600px;
  text-align: center;
}
.container h1 {
  font-size: 40px;
  transition-duration: 1s;
  transition-timing-function: ease-in- put;
  font-weight: 200;
}
form {
  padding: 20px 0;
  position: relative;
  z-index: 2;
}
form input {
  appearance: none;
  outline: 0;
  /*border: 1px solid rgba(255, 255, 255, 0.4);*/
  background-color: rgba(255, 255, 255, 0.2);
  width: 250px;
  border-radius: 3px;
  padding: 10px 15px;
  margin: 0 auto 10px auto;
  display: block;
  text-align: center;
  font-size: 18px;
  color: white;
  -webkit-transition-duration: 0.25s;
  transition-duration: 0.25s;
  font-weight: 300;
}
form input:hover {
  background-color: rgba(255, 255, 255, 0.4);
}
form input:focus {
  background-color: white;
  width: 300px;
  color: #53e3a6;
}
form button {
  appearance: none;
  outline: 0;
  background-color: white;
  border: 0;
  padding: 10px 15px;
  color: #53e3a6;
  border-radius: 3px;
  width: 250px;
  cursor: pointer;
  font-size: 18px;
  transition-duration: 0.25s;
}
form button:hover {
  background-color: #f5f7f9;
}
.bg-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.bg-bubbles li {
  position: absolute;
  list-style: none;
  display: block;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.15);
  bottom: -160px;
  animation: square 40s infinite;
  transition-timing-function: linear;
}
.bg-bubbles li:nth-child(1) {
  left: 10%;
}
.bg-bubbles li:nth-child(2) {
  left: 20%;
  width: 80px;
  height: 80px;
  animation-delay: 2s;
  animation-duration: 35s;
}
.bg-bubbles li:nth-child(3) {
  left: 25%;
  animation-delay: 4s;
}
.bg-bubbles li:nth-child(4) {
  left: 40%;
  width: 60px;
  height: 60px;
  animation-duration: 32s;
  background-color: rgba(255, 255, 255, 0.25);
}
.bg-bubbles li:nth-child(5) {
  left: 70%;
}
.bg-bubbles li:nth-child(6) {
  left: 80%;
  width: 120px;
  height: 120px;
  animation-delay: 3s;
  background-color: rgba(255, 255, 255, 0.2);
}
.bg-bubbles li:nth-child(7) {
  left: 32%;
  width: 160px;
  height: 160px;
  animation-delay: 7s;
}
.bg-bubbles li:nth-child(8) {
  left: 55%;
  width: 20px;
  height: 20px;
  animation-delay: 15s;
  animation-duration: 40s;
}
.bg-bubbles li:nth-child(9) {
  left: 25%;
  width: 10px;
  height: 10px;
  animation-delay: 2s;
  animation-duration: 40s;
  background-color: rgba(255, 255, 255, 0.3);
}
.bg-bubbles li:nth-child(10) {
  left: 90%;
  width: 160px;
  height: 160px;
  animation-delay: 11s;
}
@keyframes square {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-700px) rotate(600deg);
  }
}
@keyframes square {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-1200px) rotate(600deg);
  }
}
</style>
