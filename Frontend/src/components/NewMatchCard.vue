<template>

    <div class="page-container">
      <div class="card-container" @click="flipCard">
        <div class= "card" :class="{ flipped: isFlipped, [swipeClass]: swipeClass }" ref="flipContainer" >
          <div class="card-side front">
            <div class="card-header">
              <div class="waves-container">
                <div class="wave wave1"></div>
                <div class="wave wave2"></div>
                <div class="wave wave3"></div>
              </div>
              <img
                class="profile-img"
                :src="images[0] || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'"
                alt="profile-picture"
                :style="{'border': `3px solid ${ gender == 'male'? 'rgb(155, 200, 248)' : 'rgb(248, 100, 155)' }`}"
              />
            </div>
            <div class="card-body">
              <h1 class="name">{{ name }}</h1>
              <Chip 
                v-if="lookingFor === 'Love'" 
                label="Looking for love" 
                style="
                  height: 1.4rem; 
                  background-color: #ffebf0; /* Softer pink for background */
                  color: #d32f2f; /* Deeper red for text */
                  font-weight: 600; /* Bold for emphasis */
                  font-size: 0.85rem;
                  border-radius: 1rem;
                  padding: 0.1rem 0.6rem;
                  display: inline-flex;
                  align-items: center;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Soft shadow */
                " 
              />

              <Chip 
                v-if="lookingFor === 'Friends'" 
                label="Looking for friends" 
                style="
                  height: 1.4rem; 
                  background-color: #e0f7fa; /* Softer blue for background */
                  color: #0288d1; /* Calmer blue for text */
                  font-weight: 600;
                  font-size: 0.85rem;
                  border-radius: 1rem;
                  padding: 0.1rem 0.6rem;
                  display: inline-flex;
                  align-items: center;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Soft shadow */
                " 
              />

              <div class="quick-info">
                <span>{{ age }} • {{ gender }} • {{ religion }}</span>
              </div>
              <div class="section">
                <!-- <p class="quote">"{{ quote ? quote || "generic quote" }}"</p> -->
              </div>
              <div class="section">
                <p class="intro">{{ introduction }}</p>
              </div>
              <div class="section">
                <p class="subtitle">Personality</p>
                <p class="personality">{{personalityDescription }}</p>
              </div>
              <div class="section interests">
                <div class="interests-grid">
                  <div class="interest-item">
                    <h3>Loves</h3>
                    <p>{{loves }}</p>
                  </div>
                  <div class="interest-item">
                    <h3>Hates</h3>
                    <p>{{ hates }}</p>
                  </div>
                </div>
              </div>
    
            </div>
          </div>
          
          <div class="card-side back">
            <div class="card-body">
            <strong>
              <h2 class="header">More About Me</h2>
            </strong>
              <div class="section">
                <div class="icon-container">
                    <svg class="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="#d95966" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c.67 0 1.32.12 1.94.33L13 9.35l-4 5zM16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35l-1-7l4.5-5l-2.65-5.08C13.87 3.47 15.17 3 16.5 3" />
                    </svg>
                </div>
                <h3 class="back-title">Deal Breakers</h3>
                <p>{{ dealbreakers }}</p>
              </div>
              <div class="section">
                <div class="icon-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path fill="#d95966" d="m13.637 2.363l1.676.335c.09.018.164.084.19.173a.25.25 0 0 1-.062.249l-1.373 1.374a.88.88 0 0 1-.619.256H12.31L9.45 7.611A1.5 1.5 0 1 1 6.5 8a1.5 1.5 0 0 1 1.889-1.449l2.861-2.862V2.552c0-.232.092-.455.256-.619L12.88.559a.25.25 0 0 1 .249-.062c.089.026.155.1.173.19Z" />
                        <path fill="#d95966" d="M2 8a6 6 0 1 0 11.769-1.656a.751.751 0 1 1 1.442-.413a7.502 7.502 0 0 1-12.513 7.371A7.501 7.501 0 0 1 10.069.789a.75.75 0 0 1-.413 1.442A6 6 0 0 0 2 8" />
                        <path fill="#d95966" d="M5 8a3.002 3.002 0 0 0 4.699 2.476a3 3 0 0 0 1.28-2.827a.748.748 0 0 1 1.045-.782a.75.75 0 0 1 .445.61A4.5 4.5 0 1 1 8.516 3.53a.75.75 0 1 1-.17 1.49A3 3 0 0 0 5 8" />
                    </svg>
                </div>
                <h3 class="back-title">Life Goals</h3>
                <p>{{ goals }}</p>
              </div>
              <div class="section">
                <div class="icon-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g fill="none" fill-rule="evenodd">
                            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path fill="#d95966" d="M17 4c.763 0 1.394.434 1.856.89c.481.473.922 1.109 1.314 1.81c.787 1.406 1.472 3.243 1.925 5.058c.45 1.801.699 3.682.54 5.161C22.475 18.404 21.71 20 20 20c-1.476 0-2.652-.76-3.614-1.531l-.351-.289l-.492-.415l-.444-.368C14.08 16.572 13.175 16 12 16s-2.08.572-3.099 1.397l-.444.368l-.492.415l-.35.289C6.651 19.24 5.475 20 4 20c-1.711 0-2.476-1.596-2.635-3.081c-.158-1.48.09-3.36.54-5.161c.453-1.815 1.138-3.652 1.925-5.059c.392-.7.833-1.336 1.314-1.81C5.606 4.434 6.237 4 7 4c.515 0 1.018.123 1.513.27l.592.181q.148.046.295.087c.865.248 1.75.462 2.6.462s1.735-.214 2.6-.462l.885-.267C15.983 4.124 16.49 4 17 4m0 2c-.383 0-.783.116-1.171.243l-.458.151l-.221.068c-.885.252-2 .538-3.15.538s-2.265-.286-3.15-.538l-.22-.068l-.459-.151C7.783 6.115 7.383 6 7 6c-.418.078-.793.585-1.076 1.055l-.158.275l-.19.346c-.682 1.218-1.31 2.88-1.73 4.567c-.395 1.576-.587 3.086-.514 4.21l.026.293l.02.176l.03.208c.069.401.218.87.592.87c.812 0 1.49-.404 2.333-1.074l.403-.328l.76-.636l.344-.28C8.904 14.839 10.235 14 12 14s3.096.84 4.16 1.682l.345.28l.76.636l.402.328C18.51 17.596 19.187 18 20 18c.34 0 .494-.387.571-.759l.038-.218l.037-.317c.123-1.146-.067-2.765-.491-4.463c-.386-1.546-.946-3.072-1.562-4.254l-.359-.66l-.158-.273C17.793 6.585 17.418 6.078 17 6M8.5 8a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5m7 0a1 1 0 0 1 .993.883L16.5 9v.5h.5a1 1 0 0 1 .117 1.993L17 11.5h-.5v.5a1 1 0 0 1-1.993.117L14.5 12v-.5H14a1 1 0 0 1-.117-1.993L14 9.5h.5V9a1 1 0 0 1 1-1m-7 2a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1" />
                        </g>
                    </svg>
                </div>
                <h3 class="back-title">Hobbies</h3>
                <p>{{ hobbies }}</p>
              </div>
           
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Card from 'primevue/card';
  import Chip from 'primevue/chip';
  import Carousel from 'primevue/carousel';
  import { ref, defineExpose } from 'vue';

  export default {
    name: "MatchCard",
    components: {
    Card,
    Chip,
    Carousel,
  },
  props: {
    name: {
      type: String,
      required: true
    },
    age: {
      type: String,
      required: true
    },
    religion: {
      type: String,
      required: true
    },
    introduction:{
      type: String,
      required: true
    },
    gender:{
      type: String,
      required: true
    },
    personalityDescription:{
      type: String,
      required: true
    },
    loves:{
      type: String,
      required: true
    },
    quote:{
      type: String,
      required: false
    },
    hates:{
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: false,
      default: 'https://primefaces.org/cdn/primevue/images/usercard.png'
    },
    lookingFor: {
      type: String,
      required: false
    },
    images: {
      type: Array,
      required: false,
      default: () => ([
        'https://primefaces.org/cdn/primevue/images/usercard.png',
        'https://primefaces.org/cdn/primevue/images/usercard.png',
        'https://primefaces.org/cdn/primevue/images/usercard.png',
      ])
    },
    dealbreakers:{
      type: String,
      required: false
    },
    goals:{
      type: String,
      required: false
    },
    hobbies:{
      type: String,
      required: false
    },
  },
  setup(props, { emit }) {
    const isFlipped = ref(false);
    const swipeClass = ref('');
    const flipContainer = ref(null);

    const flipCard = () => {
      isFlipped.value = !isFlipped.value;
    };

    const swipeRight = () => {
      swipeClass.value = 'swipe-right';
      setTimeout(() => {
        emit('swipe-right');
        swipeClass.value = '';
      }, 300);
    };

    const swipeLeft = () => {
      swipeClass.value = 'swipe-left';
      setTimeout(() => {
        emit('swipe-left');
        swipeClass.value = '';
      }, 300);
    };

    defineExpose({
      swipeRight,
      swipeLeft,
    });

    const imageLoadError = (item) => {
      console.error('Failed to load image:', item);
    };
    return {
      isFlipped,
      flipCard,
      swipeRight,
      swipeLeft,
      swipeClass,
      flipContainer,
      imageLoadError,
    };
  }
  };
  </script>
  
  <style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap");
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
  }

  
  .page-container {
    min-height: 100vh;
    width: 100%;
    padding: 2rem;
    padding-bottom: 0;
  }
 
  @media (max-width: 768px){
    .page-container{
      scale: 1;
    }
  }
  
  .card-container {
    perspective: 1000px;
    width: 100%;
    max-width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .card {
    position: relative;
    width: 24rem;
    height: 40em;
    transform-style: preserve-3d;
    transition: transform 0.6s;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .card.flipped {
    transform: rotateY(180deg);
  }
  
  .card-side {
    position: absolute;
    width: 100%;
    height: 600px;
    backface-visibility: hidden;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 8px rgba(255, 255, 255, 0.5);
    overflow: hidden; /* Prevent content overflow */
  }
  
  .front {
    z-index: 2;
    transform: rotateY(0deg);
  }
  
  .back {
    transform: rotateY(180deg);
  }

  .icon-container {
    display: flex;                /* Enable flexbox */
    justify-content: center;      /* Center horizontally */
    align-items: center;          /* Center vertically */
    height: 70px;                /* Set height for the container */
    width: 70px;                 /* Set width for the container */
    margin: 0 auto;              /* Center the container itself, if necessary */
}


  .card-header {
    height: 150px;
    position: relative;
  }
  
  .waves-container {
    height: 100%;
    overflow: hidden;
  }
  
  .wave {
    position: absolute;
    width: 650px;
    height: 650px;
    background-image: linear-gradient(180deg, #ffa578, rgb(255, 128, 192), #a67bf5);
    transform: translateX(-50%);
  }
  
  .wave1 {
    border-radius: 50%;
    top: -330%;
    left: 50%;
    animation: spin 12s linear infinite;
  }
  
  .wave2 {
    border-radius: 46%;
    top: -332%;
    left: 48%;
    opacity: 0.5;
    animation: spin 16s linear infinite;
  }
  
  .wave3 {
    border-radius: 40%;
    top: -328%;
    left: 52%;
    opacity: 0.2;
    animation: spin 16s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: translateX(-50%) rotate(360deg);
    }
  }
  
  .header{
    font-size: 30px;
  }
  .profile-img {
    margin: 0 auto;
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 80%;
    transform: translate(-50%, -50%);
    z-index: 1;
    border: 3px solid rgb(248, 155, 155);
  }
  
  .card-body {
    text-align: center;
    padding: 15px 20px; /* Reduced padding */
    max-height: none; /* Remove height restriction */
  }
  
  .name {
    font-size: 40px;
    font-weight: 600;
    color: #2c3e50;
    margin: 25px 0 5px; /* Reduced margin */
  }
  
  .quick-info {
    color: #7f8c8d;
    font-size: 14px;
    margin-bottom: 10px; /* Reduced margin */
  }
  
  
  .section {
    margin: 10px 0; /* Reduced margin */
    padding: 8px 0; /* Reduced padding */
    border-bottom: 1px solid rgba(236, 166, 166, 0.998);
  }
  
  .section:last-child {
    border-bottom: none;
  }

  .quote{
    font-size: 24px;
    color: #60afff;
    font-style:oblique;
  }
  
  .intro {
    font-size: 16px;
    color: #ad4952;
    font-style: italic;
  }
  
  .subtitle {
    font-size: 18px; /* Slightly larger font size */
    font-weight: 600; /* Semi-bold to emphasize the text */
    text-transform: uppercase; /* Keeps text uppercase */
    letter-spacing: 1px; /* Space between letters */
    color: #f4a459; /* Subtitle color */
    margin-bottom: 3px; /* Increased margin for spacing */
    line-height: 1.5; /* More space between lines for readability */
    text-align: center; /* Center align the subtitle */
    border-radius: 5px; /* Rounded corners for the background */
}


.personality{
    font-size: 12px; /* Slightly larger font size */
    color: #f1bd6e; /* Subtitle color */
    line-height: 1.5; /* More space between lines for readability */
    text-align: center; /* Center align the subtitle */
    border-radius: 5px; /* Rounded corners for the background */
}
  
  .interests-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin: 10px 0; /* Reduced margin */
  }
  
  .interest-item h3 {
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #f96f6f;
    font-size: 14px; /* Slightly larger font size */
    font-weight: 600; /* Semi-bold to emphasize the text */
    line-height: 1.5; /* More space between lines for readability */
    text-align: center; /* Center align the subtitle */

    border-radius: 5px; /* Rounded corners for the background */
  }
  
  .interest-item p {
    font-size: 12px;
    color: #ff6b6b;
  }


  .back-title{
    font-size: 18px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #ff8282;
    font-weight: 600; /* Semi-bold to emphasize the text */
    line-height: 1.5; /* More space between lines for readability */
    text-align: center; /* Center align the subtitle */
  }

  
  .card.flipped.swipe-right {
    transform: translateX(100%) rotate(20deg) rotateY(180deg);
    transition: transform 0.6s ease-out;
  }

  .card.flipped.swipe-left {
    transform: translateX(-100%) rotate(-20deg) rotateY(180deg);
    transition: transform 0.6s ease-out;
  }

  .card.swipe-right {
    transform: translateX(100%) rotate(20deg);
    transition: transform 0.6s ease-out;
  }

  .card.swipe-left {
    transform: translateX(-100%) rotate(-20deg);
    transition: transform 0.6s ease-out;
  }
  
 
@media (max-height: 740px) {
  .card {
    width: 18rem;
    height: 30rem;
    scale: 0.8; /* Further scaling */
  }

  .profile-img {
    width: 115px;
    height: 115px;
  }

  .name {
    font-size: 1.5rem;
  }

  .quick-info,
  .intro,
  .personality,
  .interest-item h3,
  .back-title {
    font-size: 0.7rem;
  }

  .interest-item p {
    font-size: 0.65rem;
  }
}

@media (max-height: 739px) {
  .card{
    height: 80vh;
  }
}

@media (max-height: 670px) {
  .card{
    height: 70vh;
  }
}

@media (max-height: 600px) {
  .card{
    height: 100vh;
  }
}

  </style>
  