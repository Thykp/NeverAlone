<template>
  <div>
    <div class="navbar-container">
      <Toolbar class="custom-toolbar">
        <template #start>
          <div class="flex items-center gap-3 sm:gap-4">
            <img src="../assets/NeverAloneHandsOnlyColored.png" width="50px">
            <span
              class="nav-link"
              :class="{ active: isActive('Home') }"
              @click="navigateTo('Home')"
            >
              <HomeIcon class="nav-icon" style="width: 1.2rem; height: 1.2rem;"/>
              <span class="ml-0.5 link-text">Home</span>
            </span>
            <!--
              <span
                class="nav-link"
                :class="{ active: isActive('Profile') }"
                @click="navigateTo('Profile')"
              >
                <UserIcon class="nav-icon" style="width: 1.2rem; height: 1.2rem;"/>
                <span class="ml-0.5 link-text">Profile</span>
              </span>
            -->
            <span
              class="nav-link"
              :class="{ active: isActive('Gallery') }"
              @click="navigateTo('Gallery')"
            >
              <PhotoIcon class="nav-icon" style="width: 1.2rem; height: 1.2rem;"/>
              <span class="ml-0.5 link-text">Gallery</span>
            </span>
            <span
              class="nav-link"
              :class="{ active: isActive('chat') }"
              @click="navigateTo('chat')"
            >
              <ChatBubbleBottomCenterIcon class="nav-icon" style="width: 1.2rem; height: 1.2rem;"/>
              <span class="ml-0.5 link-text">Chat</span>
            </span>
          </div>
        </template>
        <template #end>
          <div class="flex items-center gap-2 title">
            <v-menu
                open-on-hover
                anchor="bottom"
                internal-activator
                activatorFixed
              >
                <template v-slot:activator="{ props }">
                  <span 
                    class="nav-link-image"
                    :class="{ active: isActive('Profile') }"
                    @click="navigateTo('Profile')"
                  >
                  <v-avatar style="cursor: pointer;" v-bind="props">
                    <v-img :src="photo || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'">
                    </v-img>
                  </v-avatar>
                </span>
                </template>
                <v-list >
                  <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                  >
                    <v-list-item-title @click="navigateTo(item.route)" style="cursor: pointer;">{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
          </div>
        </template>
      </Toolbar>
    </div>
    <div class="main-content">
      <!-- Your other components or content go here -->
    </div>
  </div>
</template>

<script setup>
import Toolbar from 'primevue/toolbar';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter, useRoute } from 'vue-router';
import { HomeIcon, UserIcon, ChatBubbleBottomCenterIcon, PhotoIcon} from '@heroicons/vue/24/solid';
import { ref} from 'vue';

const auth = getAuth();
let props = ref();
const router = useRouter();
const route = useRoute();
let loading = ref(false);
let items = ref([
        { title: 'Profile', route: 'Profile' },
        { title: 'Log Out', route: '/'},
      ])

let photo = ref("https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png")

onAuthStateChanged(auth, (user) => {
  if (user) {
    loading.value = true
    axios.get('/user/' + user.uid)
      .then(function (response) {

        photo.value = response.data.images[0];
        loading.value = false;
      });
  } else {
    router.push('/login');
  }
});

const navigateTo = (path) => {
  router.push(`/${path}`);
};

const isActive = (path) => {
  return route.path === `/${path}`;
};
</script>

<style scoped>
.navbar-container {
  position: fixed;
  width: 100%;
  z-index: 50;
  left: 0;
  right: 0;
  /* Default top positioning for desktop */
  top: 0;
}

.title{
  /* filter: invert(1); */
  z-index: 100;
}

.custom-toolbar {
  border: none;
  background: white;
  backdrop-filter: blur(5px);
  padding: 0.5rem 1rem;
  width: 100%;
  margin: 0;
  border-radius: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-link {
  cursor: pointer;
  padding: 0.5rem 1rem;
  position: relative;
  text-align: center;
  color: black;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-link-image {
  cursor: pointer;
  padding: 0.5rem;
  position: relative;
  color: black;
  display: flex;
  align-items: center;
}

.nav-link-image.active .v-avatar{
  border: 3px solid salmon;
}

.nav-link-image .v-avatar {
  transition: transform 0.3s ease-in-out;
}

.nav-link-image:hover .v-avatar {
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 255, 255, 0.5);
}

.nav-link .nav-icon {
  margin-right: 4px;
}

.nav-link:hover {
  color: red;
}

.nav-link.active {
  color: red;
  font-weight: bold;
}

.nav-link:hover::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 2px;
  background-color: red;
  transition: width 0.3s ease;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.avatar:hover {
  opacity: 0.8;
}

.main-content {
  padding: 15px;
  padding-bottom: 15px;
  /* Default top margin for desktop */
  margin-top: 60px;
}

/* Mobile and Tablet Styles */
@media (max-width: 768px) {
  .navbar-container {
    top: auto; /* Remove top positioning */
    bottom: 0; /* Position at bottom */
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* Optional: add shadow on top */
  }

  .custom-toolbar {
    padding: 0.75rem 1rem;
  }

  .nav-link {
    padding: 0.5rem;
    font-size: 0.9rem;
    flex-direction: column; /* Stack icon and text vertically */
    gap: 0.25rem;
  }

  .nav-link .nav-icon {
    margin-right: 0; /* Remove horizontal margin */
    margin-bottom: 2px; /* Add small vertical margin */
  }

  .link-text {
    font-size: 0.75rem; /* Smaller text on mobile */
  }

  .main-content {
    margin-top: 15px; /* Reduce top margin */
    margin-bottom: 80px; /* Add bottom margin to prevent content from being hidden */
    padding-bottom: 0; /* Remove bottom padding */
  }

  /* Modify the hover line position for bottom nav */
  .nav-link:hover::after {
    bottom: auto;
    top: -4px;
  }
}

/* Desktop Styles */
@media (min-width: 769px) {
  .custom-toolbar {
    flex-direction: row;
  }

  .nav-link {
    flex-direction: row; /* Keep icon and text horizontal on desktop */
  }
}

@media (max-width: 368px) {
  .nav-icon {
    scale: 0.8;
  }
  .link-text{
    font-size: 0.65rem;
  }
  .v-avatar{
    scale: 0.8;
  }
  .title{
    width: 25px;
  }
}
</style>