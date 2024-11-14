<template>
    <div class="match-notification" @click.self="closeNotification">
      <div class="content">
        <!-- <img src="https://img.icons8.com/fluent/48/000000/filled-like.png" alt="match-icon" class="icon" /> -->
        <div class="hometown">
          <div class="heart" :class="{ clicked: isClicked }">
          </div>
          <div id="top">
            <span class="char1">F</span>
            <span class="char2">o</span>
            <span class="char3">u</span>
            <span class="char4">n</span>
            <span class="char5">d</span>
          </div>
          <div class="city" @click="closeNotification">Match</div>
          <div id="bottom">
            <span class="char1">Y</span>
            <span class="char2">o</span>
            <span class="char3">u</span>
            <span class="char4">r</span>
          </div>
        </div>
        <div class="hint">OPEN YOUR HEART</div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { computed } from 'vue';
  
  export default {
    setup(props,{ emit }) {
      const isClicked = ref(false);

      const store = useStore();
  
      const matchedUser = computed(() => store.getters.getMatchNotification);
  
      const closeNotification = () => {
        toggleMatchColor();
        store.dispatch('clearMatchNotification');
      };

      const toggleMatchColor = () => {
        isClicked.value = !isClicked.value;  
      };
  
      return { matchedUser, closeNotification, isClicked };
    }
  };
  </script>
  
  <style scoped>
  .match-notification {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6); /* Dark overlay background */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.4s ease forwards;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .content {
    border-left: 1px solid rgba(255,255,255,0.4);
    border-top: 1px solid rgba(255,255,255,0.4);
    padding: 2rem;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    text-align: center;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    animation: popIn 0.6s ease forwards;
    display: flex; /* Center content vertically */
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  @keyframes popIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

.heart {
  z-index: 1;
  width: 80px;
  height: 80px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: rotate(-45deg);
  margin: auto;
  background-color: red;
}

.heart::before,
.heart::after {
  content: "";
  background-color: red;
  border-radius: 50%;
  position: absolute;
  width: 80px;
  height: 80px;
}

.heart.clicked,
.heart::before.clicked,
.heart::after.clicked{
  background: white;
}

.heart::before {
  top: -40px;
  left: 0;
}

.heart::after {
  top: 0;
  left: 40px;
}

.hometown {
  font-family:'Inconsolata', sans-serif;
  font-weight: bold;
  font-size: 2.0em;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
  width: 512px;
  height: 512px;
  color: #FFF;
}

#top {
  width: 200px;
  margin: auto;
  position: relative;
}

#top span {
  height: 350px;
  position: absolute;
  width: 20px;
  left: 50%;
  margin-left: -10px;
  top: 110px;
}

.char1 {
    transform: rotate(-24deg);
}
.char2 {
    transform: rotate(-12deg);
}
.char3 {
    transform: rotate(0deg);
}
.char4 {
    transform: rotate(12deg);
}
.char5 {
    transform: rotate(24deg);
}

#bottom span {
  height: 350px;
  line-height: 700px;
  position: absolute;
  width: 20px;
  left: 50%;
  margin-left: -10px;
  top: 10px;
}

#bottom .char1 {
    transform: rotate(18deg);
}
#bottom .char2 {
    transform: rotate(6deg);
}
#bottom .char3 {
    transform: rotate(-6deg);
}
#bottom .char4 {
    transform: rotate(-18deg);
}

.city {
  font-family: "Hammersmith One";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center and adjust rotation */
  z-index: 100;
  cursor: pointer;
  font-size: 2.0em;
  text-align: center;
  width: 100%;
}


.heart {
  animation: HEARTBEAT 2.5s infinite;
}
#top span {
  animation: BOUNCE 2.5s infinite;
}

@keyframes HEARTBEAT {
    0% {
        transform: rotate(-45deg) scale(1);
    }
    10% {
        transform: rotate(-45deg) scale(1.3);
    }
    15% {
        transform: rotate(-45deg) scale(1.1);
    }
    20% {
        transform: rotate(-45deg) scale(1.5);
    }
    75% {
        transform: rotate(-45deg) scale(1);
    }
    100% {
        transform: rotate(-45deg) scale(1);
    }
}

@keyframes BOUNCE {
    0% {
        top: 110px;
    }
    10% {
        top: 80px;
    }
    15% {
        top: 85px;
    }
    20% {
        top: 70px;
    }
    75% {
        top: 110px;
    }
    100% {
        top: 110px;
    }
}
  
  
  .hint {
    color: #FFF;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1rem;
    margin-top: 3rem;
    transition: background-color 0.3s, transform 0.2s;
  }
  
  .close-button:hover {
    background-color: #ff6f61;
    transform: scale(1.05); /* Slight scaling on hover */
    color: white;
  }
  </style>
  