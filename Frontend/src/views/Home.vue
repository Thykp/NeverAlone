<template>
  <div class="background">
    <Navbar class="navbar" />
    <div class="red-background"></div>
    <div class="card-container flex justify-center items-center flex-col w-full">
      <div class="flex flex-col items-center w-full overflow-hidden">

        <!-- LoadingScreen -->
        <LoadingScreen v-if="isLoading" />

        <!-- Cards Stack -->
        <div v-else class="cards-stack relative">
          <div v-if="showingLove && filteredMatches.length === 0" class="no-matches-message">
            No more users looking for love.
          </div>
          
          <div v-if="!showingLove && filteredMatches.length === 0" class="no-matches-message">
            No more users looking for friends.
          </div>

          <NewMatchCard 
            v-for="(match, index) in filteredMatches" 
            :key="match.id" 
            v-bind="match" 
            :ref="getCardRef(index)"
            @swipe-right="handleSwipeRight(index)"
            @swipe-left="handleSwipeLeft(index)"
            :style="{ 
              '--z-index': matches.length - index, 
              '--animation-delay': `${index * 0.2}s` 
            }"
          />
        </div>
        
        <ButtonGroup @heart-clicked="handleHeartClick" @times-clicked="handleTimesClick" @filter-clicked="handleFilterClick" class="button-group z-10 mt-10 " />
      </div>
    </div>

    <div class="confetti-container"></div>
    <MatchNotification v-if="showNotification"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import NewMatchCard from "../components/NewMatchCard.vue";
import ButtonGroup from "../components/ButtonGroup.vue";
import Navbar from "../components/Navbar.vue";
import MatchNotification from '../components/MatchNotification.vue';
import LoadingScreen from '../components/LoadingScreen.vue';
import axios from 'axios';
const router = useRouter();
const auth = getAuth();
const store = useStore();

const isLoading = computed(() => store.getters.isLoading);
const matches = ref([]);
const cardRefs = ref([]);
const showingLove = ref(true);

onAuthStateChanged(auth, (user) => {
  if (user) {
    axios.get('/user/' + user.uid)
      .then(function (response) {
        if (response.data.name === "newUser") {
          router.push('/profile');
        }
      });
    store.dispatch('fetchMatches', user.uid);
    store.dispatch('populateMatches', user.uid);
    
  } else {
    router.push('/login');
  }
});

const filteredMatches = computed(() => {
  const result = matches.value.filter(match => {
    // console.log('Match:', match); // Log each match object
    return match.uid !== '' &&
    (showingLove.value ? match.lookingFor === 'Love' : match.lookingFor === 'Friends');
  });
  console.log('Filtered Matches:', result); // Log filtered matches
  return result;
});

const getCardRef = (index) => (el) => {
  cardRefs.value[index] = el;
};

const handleHeartClick = () => {
  if (filteredMatches.value.length === 0) return;
  const topCard = cardRefs.value[0];
  if (topCard) {
    topCard.swipeRight();
  }
};

const handleTimesClick = () => {
  if (filteredMatches.value.length === 0) return;
  const topCard = cardRefs.value[0];
  if (topCard) {
    topCard.swipeLeft();
  }
};

const handleFilterClick = () => {
  showingLove.value = !showingLove.value;
};

const swipeCard = (index, isRightSwipe) => {
  const swipedMatch = filteredMatches.value[index];
  if (swipedMatch) {
    if (isRightSwipe) {
      likeUser(swipedMatch);
    } else {
      dislikeUser(swipedMatch);
    }

    const matchIndex = matches.value.findIndex(match => match.uid === swipedMatch.uid);
    if (matchIndex !== -1) {
      matches.value.splice(matchIndex, 1); 
    }

    cardRefs.value.splice(index, 1);
    cardRefs.value = cardRefs.value.slice();

    if (matches.value.length === 0) return;
  }
};

const likeUser = (match) => {
  const uid = store.getters.getUser.uid;
  const likedUserId = match.uid;
  store.dispatch('likeUser', { uid, likedUserId });
};

const dislikeUser = (match) => {
  const uid = store.getters.getUser.uid;
  const dislikedUserId = match.uid;
  store.dispatch('dislikeUser', { uid, dislikedUserId });
};

const handleSwipeLeft = (index) => {
  swipeCard(index, false);
};

const handleSwipeRight = (index) => {
  swipeCard(index, true);
};

onMounted(() => {
  matches.value = store.getters.getPopulateMatches;
});

store.subscribe((mutation, state) => {
  if (mutation.type === 'setPopulateMatches') {
    matches.value = state.populateMatches;
  }
});

const showNotification = computed(() => !!store.getters.getMatchNotification);

watch(showNotification, (newValue) => {
  if (newValue) {
    triggerConfetti();
  }
});

const triggerConfetti = () => {
  const confettiContainer = document.querySelector('.confetti-container');
  
  // Clean up previous confetti before adding new ones
  confettiContainer.style.zIndex = "19";

  for (let i = 0; i < 75; i++) {  // Adjust the number of hearts
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.setAttribute('data-v-2dc54a20', '');
    confettiContainer.appendChild(heart);

    // Optionally, randomize the falling positions or delay
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${Math.random() * 2}s`; // Random delay for each heart
  }
  setTimeout(() => {
    confettiContainer.innerHTML = '';
    confettiContainer.style.zIndex = "-1";
  }, 5000);
};

</script>

<style scoped>
::v-deep .main-content {
      display:none;
  }

.background {
  /* background: linear-gradient(to bottom, rgba(255, 118, 118, 0.1), rgba(245, 78, 162, 0.1)); */
  background: white;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  overflow: auto;
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

.cards-stack {
  position: relative;
  width: 24rem;
  height: 40rem;
}

.cards-stack > * {
  position: absolute;
  top: 0;
  left: 0;
  animation: stackAnimation 0.8s ease forwards;
  opacity: 0;
  z-index: var(--z-index);
  animation-delay: var(--animation-delay);
}

@keyframes stackAnimation {
  from {
    transform: translateY(100%) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.button-group {
  position: relative;
  z-index: 20;
}

.no-matches-message {
  color: #555;
  font-size: 1.2rem;
  text-align: center;
  padding: 2rem;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

/* Loading Spinner Styles */
.loading-spinner {
  font-size: 1.5rem;
  color: #555;
  text-align: center;
  padding: 2rem;
}

.heart {
  position: absolute;
  background-color: red;
  height: 20px;
  width: 20px;
  transform: rotate(-45deg);
  animation: fall 5s infinite forwards;
  opacity: 0;
}

.heart:after,
.heart:before {
  content: "";
  position: absolute;
  background-color: red;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}

.heart:after {
  top: 0;
  left: 10px;
}

.heart:before {
  top: -10px;
  left: 0;
}

@keyframes fall {
  0% {
    transform: translateY(-100vh) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(45deg);
    opacity: 0;
  }
}

.confetti-container {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-container{
  height: calc(100% + 10vh);
}

@media (max-width: 768px){
  .card-container{
    height: calc(100% - 10vh);
  }
}

</style>
