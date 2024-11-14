<template>
    <div class="quiz-container">
      <div class="background-elements">
        <div class="floating-circle circle1"></div>
        <div class="floating-circle circle2"></div>
        <div class="floating-circle circle3"></div>
      </div>
      <div class="big-screen w-full lg:h-full">
        <div class="quiz-form">
          <h1 class="text-2xl title-text title-color" v-if="!quizStarted">Score higher than your Match to get a Prize Picture from their Gallery !</h1>
          <p v-if="!quizStarted">
            <Button label="Start Quiz" icon="pi pi-play" severity="warn" class="btn-start p-button-rounded w-48 start-btn" @click="startQuiz" />
          </p>

          <div v-if="quizStarted && currentQuestionIndex < questions.length" class="quiz-section fade-in">
            <h2 class="question-text title-color fade-in">{{ questions[currentQuestionIndex].text }}</h2>
            <div class="circle">
              <div class='wave -one' :class="{ 'animate': isAnimating }"></div>
              <div class='wave -two' :class="{ 'animate': isAnimating }"></div>
              <div class='wave -three' :class="{ 'animate': isAnimating }"></div>
              <span class="timer-text">{{ timeLeft }}</span>
            </div>
            <div v-for="(option, index) in questions[currentQuestionIndex].options" :key="index" class="answer-option fade-in">
              <Button :label="option" class="option-btn w-full" severity="warn" @click="selectAnswer(index)" raised/>
            </div>
          </div>
  
          <div v-if="quizStarted && currentQuestionIndex >= questions.length" class="quiz-complete scale-up">
            <h1 v-if="loading" class="text-2xl title-text title-color">Redirecting back to your match...</h1>
            <div v-if="loading" class="loading-spinner"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import Button from 'primevue/button';
  import { useStore } from 'vuex';
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import axios from 'axios';

  const auth = getAuth();
  const router = useRouter();
  const quizStarted = ref(false);
  const currentQuestionIndex = ref(0);
  const timeLeft = ref(5);
  const score = ref(0);
  const interval = ref(null);
  const loading = ref(false);
  const questions = ref([]);
  const isAnimating = ref(false);
  const store = useStore();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      axios.get('/user/' + user.uid)
        .then(function (response) {
          if (response.data.name === "newUser") {
            router.push('/profile');
          }
        });
      store.dispatch('fetchMatches', user.uid);

    } else {
      router.push('/login');
    }
  });

  const decodeHtmlEntities = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

const fetchQuestions = async () => {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple');
    const data = await response.json();
    questions.value = data.results.map((item) => {
      const options = [...item.incorrect_answers, item.correct_answer];
      return {
        text: decodeHtmlEntities(item.question),
        options: options.map(option => decodeHtmlEntities(option)).sort(() => Math.random() - 0.5),
        correct: options.indexOf(item.correct_answer),
      };
    });
  } catch (error) {
    console.error("Failed to fetch questions:", error);
  }
};
  
  const startQuiz = () => {
    quizStarted.value = true;
    startTimer();
  };
  
  const startTimer = () => {
    timeLeft.value = 5;
    clearInterval(interval.value);

    isAnimating.value = false;
    requestAnimationFrame(() => {
      isAnimating.value = true;
    });
  
    interval.value = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value -= 1;
      } else {
        nextQuestion();
      }
    }, 1000);
  };
  
  const selectAnswer = (index) => {
    if (index === questions.value[currentQuestionIndex.value].correct) {
      score.value += 1;
    }
    nextQuestion();
  };
  
  const nextQuestion = () => {
    currentQuestionIndex.value += 1;
    if (currentQuestionIndex.value < questions.value.length) {
      startTimer();
    } else {
      clearInterval(interval.value);
      redirectAfterQuiz();
    }
  };
  
  const redirectAfterQuiz = () => {
    loading.value = true;
    const userUID = store.state.user.uid;
    console.log(userUID);
    store.dispatch("saveScore", { userUid: userUID, matchUid: store.state.selectedMatchUid, score: score.value });
    setTimeout(() => {
      router.push("/chat");
    }, 2000);
  };
  
  onMounted(() => {
    fetchQuestions();
  });
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

    @keyframes fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes scale-up {
        0% {
            transform: scale(0);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes float {
        0% {
            transform: translateY(0) translateX(0);
        }
        50% {
            transform: translateY(-20px) translateX(20px);
        }
        100% {
            transform: translateY(0) translateX(0);
        }
    }

    .quiz-container {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        padding: 2rem;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        background: linear-gradient(180deg, #ffa578, rgb(255, 128, 192), #a67bf5);
        background-size: 400% 400%;
        animation: spin-gradient 15s ease infinite;
        overflow: hidden;
    }

    .background-elements {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 0;
        pointer-events: none;
    }

    .floating-circle {
        position: absolute;
        border-radius: 50%;
        opacity: 0.8;
        animation: float 5s ease-in-out infinite;
        background: rgba(255, 255, 255, 0.3);
    }

    .circle1 {
        width: 120px;
        height: 120px;
        top: 10%;
        left: 15%;
        animation-duration: 6s;
    }

    .circle2 {
        width: 80px;
        height: 80px;
        bottom: 20%;
        right: 20%;
        animation-duration: 7s;
    }

    .circle3 {
        width: 150px;
        height: 150px;
        top: 50%;
        left: 60%;
        animation-duration: 8s;
    }

    .quiz-form {
        z-index: 1;
        width: 100%;
        max-width: 400px;
        box-shadow: 20px 20px 40px -6px rgba(0,0,0,0.2);
        padding: 50px 30px 30px;
        border-radius: 25px;
        border-left: 1px solid rgba(255,255,255,0.4);
        border-top: 1px solid rgba(255,255,255,0.4);
        background: rgba(255,255,255,0.4);
        backdrop-filter: blur(10px);
        text-align: center;
    }

    .big-screen {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    h1 {
        text-align: center;
        margin-bottom: 2rem;
    }

    .answer-option {
        margin: 20px 0;
    }

    .question-text {
        font-size: 1.5rem;
        margin-bottom: 2rem;
        text-align: left;
        font-weight: bold;
    }

    .fade-in {
        animation: fade-in 0.5s ease-out;
    }

    .pulse {
        animation: pulse 1s infinite;
    }

    .scale-up {
        animation: scale-up 0.8s ease-out;
    }

    .option-btn {
      padding: 17px 20px;
      border-radius: 15px;
      cursor: pointer;
      transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
      background: linear-gradient(90deg, #ffa578, rgb(255, 128, 192), #a67bf5) !important; /* Matching gradient */
      color: #fff !important;
      border: none;
    }

    .option-btn:hover,
    .option-btn:focus {
      box-shadow: 0 0.5em 1em -0.4em rgba(255, 128, 192, 0.6);
      transform: translateY(-0.25em);
      background: linear-gradient(90deg, rgb(255, 128, 192), #ffa578, #a67bf5) !important;
    }

    .timer-text {
      font-weight: bold;
      color: rgb(255, 128, 192); /* Matching pink color */
      font-size: 1.2rem;
    }

    .btn-start {
      background: linear-gradient(90deg, #ffa578, rgb(255, 128, 192), #a67bf5) !important; /* Matching gradient */
      color: #fff !important;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .loading-spinner {
        border: 8px solid #f3f3f3;
        border-top: 8px solid #3498db;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        margin: 20px auto;
        animation: spin 1s linear infinite;
    }

    .circle {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: auto;
      aspect-ratio: 1/1;
      max-width: 120px;
      max-height: 120px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.4);
      background: white;
      position: relative;
      overflow: hidden;
      transform: translate3d(0, 0, 0);
    }

    .wave.animate {
      opacity: 0.4;
      position: absolute;
      left: 50%;
      background: linear-gradient(to bottom, #ffa578, rgb(255, 128, 192));
      width: 200px;
      height: 200px;
      margin-left: -100px;
      transform-origin: 50% 48%;
      border-radius: 43%;
      animation: fillUpTimer 10s linear forwards;
      bottom: -200px; /* Completely hidden initially */
    }

    .wave.-two.animate {
      animation: fillUpTimer 10s linear forwards 0.4s;
      opacity: 0.1;
      background: yellow;
    }

    .wave.-three.animate {
      animation: fillUpTimer 10s linear forwards 0.2s;
      opacity: 0.3;
    }

    @keyframes fillUpTimer {
      0% {
        bottom: -200px; 
        transform: rotate(0deg);
      }
      20% {
        bottom: -160px; 
        transform: rotate(72deg);
      }
      40% {
        bottom: -120px;
        transform: rotate(144deg);
      }
      60% {
        bottom: -80px;  
        transform: rotate(216deg);
      }
      80% {
        bottom: -40px; 
        transform: rotate(288deg);
      }
      100% {
        bottom: 0px;   
        transform: rotate(360deg);
      }
    }

    .title-color{
      font-size: 20px;
      color:#721924;

    }
</style>
