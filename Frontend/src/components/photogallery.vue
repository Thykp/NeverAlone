<template>
  <Navbar class="navbar" />
  <div class="red-background"></div>

  <div class="floating-shapes">
      <div class="shape shape-circle"></div>
      <div class="shape shape-square"></div>
      <div class="shape shape-triangle"></div>
    </div>
    

  <div class="photo-gallery">

    <div v-if="error" class="error-alert">
      {{ error }}
      <button @click="error = ''" class="error-close">&times;</button>
    </div>

    <div class="photo-grid">
      <div
        v-for="(photo, index) in photos"
        :key="index"
        class="photo-box"
        :class="{ 'is-loading': photo.isLoading }"
      >
        <div v-if="!photo.file" class="upload-box" @click="() => onUploadClick(index)" :disabled="photo.isLoading">
          <div class="upload-placeholder">
            <p class="upload-help" v-if="!photo.isLoading">
              <span class="pi pi-image"></span>
              Upload Photo
            </p>
            <p v-else>Loading...</p>
          </div>
          <input
            :ref="el => fileInputs[index] = el"
            type="file"
            accept="image/*"
            @change="(event) => handleFileUpload(event, index)"
            class="hidden"
          />
        </div>
        
        <div v-else class="photo-container">
          <img
            :src="photo.preview"
            :alt="`Uploaded Photo ${index + 1}`"
            class="photo-image"
            @error="() => handleImageError(index)"
          />
          <div class="photo-overlay" @click="() => deletePhoto(index)" :disabled="photo.isLoading">
            <div class="overlay-content">
              <span class="pi pi-image"></span>
              Replace
            </div>
          </div>
          <!--
          <div class="caption-box">
            <input
              type="text"
              :placeholder="'Add a caption (optional)'"
              v-model="photo.caption"
              class="caption-input"
              maxlength="100"
            />
            <div class="photo-actions">
              <button
                @click="() => deletePhoto(index)"
                class="overwrite-button"
                :disabled="photo.isLoading"
              >
                Replace
              </button>
            </div>
          </div>
          --> 
        </div>
      </div>
    </div>

    <div class="save-container">
      <button 
        @click="savePhotos" 
        class="save-button"
        :disabled="!hasUnsavedChanges || isSaving"
        v-if="hasUnsavedChanges && !isSaving"
      >
        {{ isSaving ? 'Saving...' : 'Save Changes' }}
      </button>
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
</template>

<script setup>
import "primeicons/primeicons.css";
import Navbar from "../components/Navbar.vue";
import { ref, reactive } from 'vue'
import axios from 'axios';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as firebaseRef } from "firebase/storage";


const auth = getAuth();
const storage = getStorage();
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const fileInputs = reactive({})
const error = ref('')
const isSaving = ref(false)
const hasUnsavedChanges = ref(false)
let isLoading = ref(true)
let userData = ref();
let overlay = ref(false);

let snackbar = ref(false);
let snackbarMessage = ref("");


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

let photos = ref(Array(6).fill().map(() => ({
  file: null,
  caption: '',
  preview: '',
  isLoading: false,
  error: null
})))

const handleError = (message) => {
  error.value = message
  setTimeout(() => {
    if (error.value === message) {
      error.value = ''
    }
  }, 5000)
}

const validateFile = (file) => {
  if (!file.type.startsWith('image/')) {
    handleError('Please upload a valid image file')
    return false
  }

  if (file.size > MAX_FILE_SIZE) {
    handleError('File size must be less than 5MB')
    return false
  }

  return true
}

onAuthStateChanged(auth, (user) => {
  isLoading.value = true;
  if (user) {
    userData.value = user;
    axios.get('/user/' + user.uid)
      .then(function (response) {
        data.value = response.data;
        data.value.email = user.email;
        for(var photo in response.data.images){
          photos.value[photo].file = response.data.images[photo]
          photos.value[photo].preview = response.data.images[photo]
        }
        isLoading.value = false;
      });
  } else {
    router.push('/login');
  }
});

const submit = (() => {
  if (userData) {
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
    overlay.value = false;
  }
});

const metadata = {
  contentType: 'image/jpg',
};

const handleFileUpload = async (event, index) => {
  const file = event.target.files[0]
  if (!file) return

  if (!validateFile(file)) return

  try {
    photos.value[index].isLoading = true

    console.log(file)
    // Simulate upload delay
    const storageRef = firebaseRef(storage, 'gs://wad2-g4-t15.appspot.com/' + file.name);
    uploadBytes(storageRef, file, metadata).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const preview = url
    
        photos.value[index] = {
          file,
          preview,
          caption: photos.value[index].caption,
          isLoading: false,
          error: null
        }
        
        hasUnsavedChanges.value = true
      });
    });
  } catch (err) {
    handleError(err.message)
    photos.value[index].isLoading = false
  }
}

const onUploadClick = (index) => {
  if (fileInputs[index]) {
    fileInputs[index].value = '' // Reset input
    fileInputs[index].click()
  }
}

const deletePhoto = (index) => {
  photos.value[index] = {
    file: null,
    caption: '',
    preview: '',
    isLoading: false,
    error: null
  }
  hasUnsavedChanges.value = true
}

const handleImageError = (index) => {
  deletePhoto(index)
  handleError('Failed to load image')
}

const savePhotos = async () => {
  try {
    isSaving.value = true
    
    // Simulate API call
    let imageArray = []
    for(var photo of photos.value){
      imageArray.push(photo.preview)
    }
    data.value.images = imageArray
    submit()
    hasUnsavedChanges.value = false
    // You can emit an event here if needed
    // emit('save', photos.value.filter(p => p.file))
  } catch (err) {
    handleError('Failed to save photos')
    console.log(err)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>

.navbar {
  position: fixed;
}

/* Adjust top padding to avoid content getting hidden under the navbar */
.photo-gallery {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding-top: 70px; /* Adjust based on navbar height */
}

.background {
  background: linear-gradient(to bottom, rgba(255, 118, 118, 0.1), rgba(245, 78, 162, 0.1));
  height: 10vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
}

.red-background {
  background: linear-gradient(180deg, #ffa578, rgb(255, 128, 192), #a67bf5);
  background-size: 200% 200%;
  animation: spin-gradient 15s ease infinite;
  height: 100vh; /* Cover entire viewport height */
  width: 100vw; /* Cover entire viewport width */
  position: fixed; /* Fix to viewport */
  top: 0;
  left: 0;
  z-index: 0; /* Ensure it stays behind other content */
  border-bottom-left-radius: 0; /* Remove rounded corners for full coverage */
  border-bottom-right-radius: 0;
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

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3; /* Ensure navbar stays on top */
  padding: 1rem 2rem;
}

.photo-gallery {
  max-width: 1024px;
  margin: 0px auto;
  padding: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  width: 100%;
  height: 85%;
  flex-direction: column;
  z-index: 2; /* Ensure it appears above the background */
  position: relative;
  /* overflow-y: auto; */
}
.save-button{
  margin-top: 50px;
}
.photo-box {
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease; /* Add transition for smooth effect */
  height: 100%;
  margin-top:40px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
}

.photo-box:hover {
  transform: translateY(-10px) scale(1.05); /* Scale up and move slightly up */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Make shadow more prominent on hover */
  opacity: 0.9; /* Slightly reduce opacity */
}

.upload-box:hover {
  background-color: #f4f4f4; /* Change background color on hover */
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  z-index: 10;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.photo-box:hover .photo-overlay {
  opacity: 1; /* Show overlay when hovering over the photo box */
}

.error-alert {
  background-color: #fee2e2;
  border: 1px solid #ef4444;
  color: #991b1b;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.error-close {
  background: none;
  border: none;
  color: #991b1b;
  font-size: 1.25rem;
  cursor: pointer;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 15px;
  flex: 1;
  height: 100%;
  min-height:20;
  margin-bottom: 1rem;
}

.photo-box {
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Add transition for smooth effect */
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
}

.photo-box {
  transform: translateY(-10px); /* Pops up by 10px */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Make shadow more prominent on hover */
}

@media (max-width: 960px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    width: 70%;
    margin: auto;
  }
}

@media (max-width: 768px) {
  .photo-gallery{
    margin: 10px auto auto auto;
  }
  .photo-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 1fr);
  }
  .photo-box{
    height: 250px;
    width: 200px;
    margin: auto;
  }
}

@media (max-width: 960px) {
  .save-container {
    position: fixed;
    bottom: 1%;
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    padding: 1rem;
    z-index: 100;
    pointer-events: none;
  }

  .save-button {
    pointer-events: auto;
  }
}

@media (max-width: 768px) {
  .save-container {
    position: fixed;
    bottom: 9%;
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    padding: 1rem;
    z-index: 100;
    pointer-events: none;
  }
}

.upload-box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  padding: 1rem;
  cursor: pointer;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  display: block;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.upload-help {
  color: #6b7280;
  font-size: 1rem;
  margin-top: 0.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.3s; 
}

.photo-box .upload-help{
  opacity: 1;
  transform: translateY(0);
}

.photo-container {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.delete-button {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 9999px;
  width: 2rem;
  height: 2rem;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-button {
  background-color: rgba(0, 0, 0, 0.7);
}

.photo-image {
  flex: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-height: 0;
}

.overlay-content {
  color: rgba(255,255,255,0.7);
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.5;
}

.overlay-content .pi {
  display: inline;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.photo-box .photo-overlay {
  opacity: 1;
}

.photo-box .overlay-content{
  opacity: 1;
  transform: translateY(0);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  z-index: 10;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.caption-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.caption-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.photo-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.caption-count {
  color: #6b7280;
  font-size: 0.75rem;
}

.upload-button,
.overwrite-button {
  background-color: rgb(219, 115, 132);
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.upload-button,
.overwrite-button {
  background-color: rgb(300, 115, 132);
}

.upload-button:disabled,
.overwrite-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.hidden {
  display: none;
}

.is-loading {
  opacity: 0.7;
  pointer-events: none;
}

.save-container {
  padding: 1rem 0;
  text-align: center;
  flex-shrink: 0;
}

.save-button {
  background-color: #00B0C7;
  color: white;
  font-weight: 500;
  padding: 0.75rem 2rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button{
  background-color: #00e1ff;
}

.save-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.gallery-page {
  position: relative;
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  opacity: 0.7;
  animation: float 12s ease-in-out infinite;
}

.shape-circle {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-square {
  width: 120px;
  height: 120px;
  top: 50%;
  left: 75%;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 0;
  animation-delay: 2s;
}

.shape-triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid rgba(255, 255, 255, 0.3);
  top: 70%;
  left: 30%;
  animation-delay: 4s;
  transform: rotate(45deg);
}


@keyframes float {
  0% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-30px) translateX(10px) rotate(120deg);
  }
  50% {
    transform: translateY(-20px) translateX(-20px) rotate(240deg);
  }
  75% {
    transform: translateY(30px) translateX(20px) rotate(360deg);
  }
  100% {
    transform: translateY(0px) translateX(0px) rotate(480deg);
  }
}

::v-deep .v-snackbar__content {
  text-align: center;
}
</style>