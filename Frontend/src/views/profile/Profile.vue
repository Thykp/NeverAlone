<template>
  <div class="background"></div>
  <div class="red-background"></div>
  <div class="relative min-h-screen">
    <Navbar class="navbar" />

    <div class="container mx-auto px-4 pt-6 relative z-10 ">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <v-overlay v-model="overlay" class="align-center justify-center">
          <v-card width="450" align-center justify-center class="pa-4">
            <v-row>
              <v-col sm="8">
                <v-file-input
                  label="File input"
                  show-size
                  prepend-icon="mdi-camera"
                  variant="filled"
                  v-model="file"
                  clearable
                ></v-file-input>
              </v-col>
              <v-col sm="4">
                <v-btn
                  :loading="loading"
                  class="mt-2"
                  text="Submit"
                  v-on:click="uploadTask"
                ></v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-overlay>

        <!-- Profile Header -->
        <div class="header"> Profile </div>
        <div v-if="loading">
          <v-progress-circular color="blue-lighten-3" indeterminate :size="56"></v-progress-circular>
        </div>
        <div v-else>
          <div class="flex flex-col items-center mb-8 relative">
            <PencilSquareIcon
              @click="disabled = !disabled"
              class="absolute right-0 edit-icon"
              style="width: 1.8rem; height: 1.8rem;"
            ></PencilSquareIcon>
            <div class="relative mb-4">
                <img
                  @click="overlay = !overlay"
                  :src="data.images[0] || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'" 
                  alt="Profile"
                  class="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer"
                >
            </div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ data.name }}</h1>
            <p class="text-gray-600">{{ data.email }}</p>
          </div>

          <!-- Profile Information -->
          <v-form validate-on="submit lazy" @submit.prevent="submit" class="relative">
            <v-row v-if="!disabled">
              <v-col cols="12">
                <div class="profile-field">
                  <label>Name</label>
                  <input type="text" v-model="data.name" :disabled="disabled" class="profile-input" />
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div class="profile-field">
                  <label>Introduction</label>
                  <textarea v-model="data.introduction" :disabled="disabled" class="profile-textarea" style="width: 100%; height: 100%"></textarea>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <div class="profile-field">
                  <label>Age</label>
                  <input type="text" v-model="data.age" :disabled="disabled" class="profile-input" />
                </div>
                <div class="profile-field mt-2">
                  <label>Gender</label>
                  <v-select
                    :disabled="disabled"
                    label="Gender"
                    :items="['Male','Female']"
                    v-model="data.gender"
                  ></v-select>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="profile-field">
                  <label>Religion</label>
                  <input type="text" v-model="data.religion" :disabled="disabled" class="profile-input" />
                </div>
                <div class="profile-field mt-2">
                  <label>Looking For</label>
                  <v-select
                    :disabled="disabled"
                    label=""
                    :items="['Love','Friends']"
                    v-model="data.lookingFor"
                  ></v-select>
                </div>
              </v-col>
            </v-row>

            <v-row class="space-y-4">
              <v-col class="profile-field">
                <label>Personality Description</label>
                <textarea v-model="data.personalityDescription" :disabled="disabled" class="profile-textarea"></textarea>
              </v-col>
            </v-row>

            <v-row class="gap-4">
              <v-col class="profile-field">
                <label>What I Love</label>
                <textarea v-model="data.loves" :disabled="disabled" class="profile-textarea"></textarea>
              </v-col>
              <v-col class="profile-field">
                <label>What I Hate</label>
                <textarea v-model="data.hates" :disabled="disabled" class="profile-textarea"></textarea>
              </v-col>
            </v-row>

            <v-row class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <v-col class="profile-field">
                <label>Goals</label>
                <textarea v-model="data.goals" :disabled="disabled" class="profile-textarea"></textarea>
              </v-col>
              <v-col class="profile-field">
                <label>Dealbreakers</label>
                <textarea v-model="data.dealbreakers" :disabled="disabled" class="profile-textarea"></textarea>
              </v-col>
            </v-row>

            <v-row class="profile-field">
              <label>Hobbies</label>
              <textarea v-model="data.hobbies" :disabled="disabled" class="profile-textarea"></textarea>
            </v-row>

            <v-row v-if="!disabled">
              <v-btn class="mt-2" text="Submit" type="submit" block>Submit</v-btn>
            </v-row>
          </v-form>
        </div>

        <v-snackbar v-model="snackbar" 
      :timeout="3000" 
      rounded="pill"
      location="top"
      color="green-darken-2"
      multi-line>
      {{ snackbarMessage }}
      <template #action>
        <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
      </template>
</v-snackbar>


      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from '../../components/Navbar.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as firebaseRef } from "firebase/storage";
import { PencilSquareIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const auth = getAuth();
let userData = ref();

const loading = ref(true);
let disabled = ref(true);
let overlay = ref(false);
let snackbar = ref(false);
let snackbarMessage = ref("");

const storage = getStorage();

const metadata = {
  contentType: 'image/jpg',
};
const file = ref();

let data = ref({
  "name": "",
  "age": "",
  "gender": "",
  "hobbies": "",
  "religion": "",
  "lookingFor": "",
  "introduction": "",
  "personalityDescription": "",
  "loves": "",
  "hates": "",
  "dealbreakers": "",
  "goals": "",
  "images": [],
  "likes": [],
  "matches": []
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loading.value = true;
    userData.value = user;
    axios.get('/user/' + user.uid)
      .then(function (response) {
        data.value = response.data;
        data.value.email = user.email;
        loading.value = false;
      });
  } else {
    router.push('/login');
  }
});

const handleRouteLeave = (to, from, next) => {
  if (!data.value.gender.trim() || !data.value.lookingFor.trim()) {
    snackbarMessage.value = "Please fill in both Gender and Looking For fields.";
    snackbar.value = true;
    next(false);
  } else {
    next();
  }
};

onMounted(() => {
  router.beforeEach((to, from, next) => {
    handleRouteLeave(to, from, next);
  });
});

const submit = (() => {
  if (userData) {
    loading.value = true;
    try {
      axios.post('/user/' + userData.value.uid, data.value)
        .then(function (response) {
          console.log(response);
        });

      snackbarMessage.value = "Profile updated successfully!";
      snackbar.value = true;

    } catch (error) {
      console.log(error);
    }
    loading.value = false;
    disabled.value = true;
    overlay.value = false;
  }
});

const uploadTask = () => {
  if (file.value) {
    const storageRef = firebaseRef(storage, 'gs://wad2-g4-t15.appspot.com/' + file.value.name);
    uploadBytes(storageRef, file.value, metadata).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        data.value.images.unshift(url);
        submit();
      });
    });
  }
};
</script>

<style scoped>

@media (max-width: 768px) {
  ::v-deep .main-content {
        display:none;
    }
  
  .container{
    padding-bottom: 100px;
  }
}

@media (min-width: 768px) {
  .container{
    padding-bottom: 32px;
  }
}

.header {
    text-align: center;
    font-size: 2em;
    font-weight: bold;
    padding: 0px 0px 5px 0px;
    margin: 0px 0px 20px 0px;
    border-bottom: 1px solid black;
  }

.background {
  /* background: linear-gradient(to bottom, rgba(255, 118, 118, 0.1), rgba(245, 78, 162, 0.1)); */
  background: white;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}

.red-background {
  background: linear-gradient(180deg, #ffa578, rgb(255, 128, 192), #a67bf5);
  background-size: 400% 400%;
  animation: spin-gradient 15s ease infinite;
  height: 40vh;
  width: 100%;
  position: absolute;
  top: 0;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  z-index: 1;
}

@keyframes spin-gradient {
            0% {
                background-position: 0% 50%; /* Start from the left */
            }
            25% {
                background-position: 100% 50%; /* Move to the right */
            }
            50% {
                background-position: 100% 0%; /* Move to the top */
            }
            75% {
                background-position: 0% 0%; /* Move to the left */
            }
            100% {
                background-position: 0% 50%; /* Move back to the original position */
            }
        }

.profile-field {
  @apply space-y-2;
}

.profile-field label {
  @apply block text-sm font-medium text-gray-700 text-left;
}

.profile-input {
  @apply w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500;
}

.profile-textarea {
  @apply w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 min-h-[100px] resize-none;
}

.navbar {
  z-index: 10;
}

.edit-icon {
  cursor: pointer;
  transition: color 0.3s ease;
}

.edit-icon:hover {
  color: #FD0E42;
}

.edit-icon:active {
  color: #C30F31;
}

::v-deep .v-snackbar__content {
  text-align: center;
  bottom: 0; /* Default position for larger screens */
}

@media (max-width: 600px) {
  ::v-deep .v-snackbar {
    top: 0 !important;
    bottom: auto !important; /* Override bottom to make it appear at the top */
  }
}
</style>
