<template>
    <div class="login-container">
      <div class="big-screen w-full lg:h-full">
        <div class="login-form">
          <h1 class="text-3xl">Sign in to Your Account</h1>
          <p>
            <InputText v-model="email" placeholder="Email" />
          </p>
          <p>
            <Password v-model="password" toggleMask placeholder="Password" :feedback="false" />
          </p>
          <p>
            <Button label="Login" icon="pi pi-check" class="p-button-rounded w-48 md:w-2/3" style="background-color: #00B0C7; outline:none" @click="login" />
          </p>
          <p>Don't have an account? 
          <router-link to="/register">Register Now</router-link>
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
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import Button from 'primevue/button';
  
  const email = ref("");
  const password = ref("");
  const errMsg = ref();
  const router = useRouter();
  
  const login = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
      .then((data) => {
        console.log("Successfully Signed in!");
        router.push('/home');
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            errMsg.value = "Invalid email";
            break;
          case "auth/user-not-found":
            errMsg.value = "No account with that email was found";
            break;
          case "auth/wrong-password":
            errMsg.value = "Incorrect Password";
            break;
          default:
            errMsg.value = "Email or password was incorrect";
            break;
        }
      });
  };
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

  .login-container {
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

  .login-form {
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
  .login-container {
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

  .app-logo{
    width: 300px;
  }

  .login-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
  }

  .login-form > * {
    width: 100%;
    max-width: 400px;
  }

  .logo {
    display: flex;
    flex-direction: column;
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
  
  .login-form p {
    margin-bottom: 1rem;
  }
  
  .error-message {
    color: red;
    text-align: center;
  }

  :deep .p-inputtext,
  :deep .p-password {
    width: 100%;
    max-width: 400px;
  }

  </style>
  