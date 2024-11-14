<template>
  <div class="register-container">
    <div class="big-screen w-full lg:h-full">
      <div class="register-form">
        <h1 class="text-3xl">Create an Account</h1>
        <p>
          <InputText v-model="email" placeholder="Email" />
        </p>
        <p>
          <Password v-model="password" :toggleMask="true" placeholder="Password" :feedback="true" />
        </p>
        <p>
          <Password v-model="confirmPassword" :toggleMask="true" placeholder="Confirm Password" :feedback="false" />
        </p>
        <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
        <p>
          <Button label="Register" icon="pi pi-check" class="p-button-rounded w-48 md:w-2/3" @click="register" />
        </p>
        <p>Been here before? 
          <router-link to="/login">Login</router-link>
        </p>
        <p v-if="errMsg" class="error-message">{{ errMsg }}</p>
      </div>
      <div class="logo"> 
        <img src="../assets/NeverAloneHandsOnly.png" alt="Never Alone App Logo" class="app-logo" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import axios from 'axios';
import {Client as ConversationsClient} from "@twilio/conversations"
const base_url = import.meta.env.VITE_ENDPOINT ?? `http://localhost:${import.meta.env.VITE_PORT}`;

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errMsg = ref();
const passwordError = ref("");
const router = useRouter();

const register = async () => {
  if (password.value !== confirmPassword.value) {
    errMsg.value = "Passwords do not match";
    return;
  }

  passwordError.value = "";

  try {
    const response = await createUserWithEmailAndPassword(getAuth(), email.value, password.value);
    console.log(response.user.uid);

    await axios.post('/user/' + response.user.uid, { name: "newUser", uid: response.user.uid });
    await run(response.user.uid);

    console.log("Successfully registered!");
    router.push("/Profile");
  } catch (error) {
    console.log(error.code);
    errMsg.value = "Error creating account";
  }
};


let run = async (uid) => {
    const response = await fetch(`${base_url}/chat/auth/${uid}`)
    const responseJson = await response.json()
    new ConversationsClient(responseJson.token)
} 
</script>

<style scoped>

  @keyframes gradient-animation {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
    }
  }

@media (max-width: 1023px) {
  .logo {
    position: absolute;
    display: flex;
    top: 20px;
    left: 20px;
    font-size: 20px;
    font-family: Roboto Flex;
    color: white;
  }

  .app-logo{
    width: 50px;
  }

  .register-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 2rem;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    background: linear-gradient(90deg, #ff7676, #f54ea2, #ffb3b3);

    background-size: 600% 600%;
    animation: gradient-animation 25s ease infinite;
  }

  .register-form {
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    padding: 70px 30px 40px 30px;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
  }
  .big-screen{
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@media (min-width: 1024px) {
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 2rem;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    background: linear-gradient(90deg, #ff7676, #f54ea2, #ffb3b3);

    background-size: 600% 600%;
    animation: gradient-animation 25s ease infinite;
  }

  .register-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }

  .register-form > * {
    width: 100%;
    max-width: 400px;
  }

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 97%;
    width: 50%;
    max-width: 700px;
    font-size: 3rem;
    color: white;
    text-align: center;
    border-radius: 40px;
    font-family: 'Roboto Flex', sans-serif;

    background: linear-gradient(90deg, #ff7676, #f54ea2, #ffb3b3);

    background-size: 600% 600%;
    animation: gradient-animation 25s ease infinite;
  }

  .app-logo{
    width: 300px;
  }

  .big-screen{
    display: flex;
    flex-direction: row;
    background: #fff;
    gap: 2em;
    width: 90%;
    max-width: 1400px;
    height: 80%;
    align-items: center;
    border-radius: 40px;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.register-form p {
  margin-bottom: 1rem;
}

:deep .p-inputtext,
:deep .p-password {
  width: 100%;
}

.error-message {
  color: red;
  text-align: center;
}
</style>