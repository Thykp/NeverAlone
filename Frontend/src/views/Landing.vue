<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="floating-shapes">
        <div class="shape shape-circle"></div>
        <div class="shape shape-square"></div>
        <div class="shape shape-triangle"></div>
      </div>
      <div class="hero-overlay"></div>

      <div class="hero-content">        
        <img src="../assets/NeverAloneHandsOnly.png" alt="Never Alone App Logo" class="app-logo" />
        <h1 class="animate-fade-up-delay text-6xl">NeverAlone</h1>
        <p class="animate-fade-up-slower text-xl">Your companion in staying connected and finding support.</p>
        <router-link to="/login">
          <Button style="background-color: #00B0C7; outline:none;"
            label="Get Started"
            icon="pi pi-arrow-right"
            class="p-button-rounded w-48 md:w-2/3 animate-scale-up hover-scale"
          />
        </router-link>
      </div>

      <div class="scroll-indicator" @click="scrollToFeatures">
        <span class="scroll-text">See more</span>
        <i class="pi pi-arrow-down animate-bounce"></i>
      </div>
    </section>

      <!-- Features Section -->
      <section ref="featuresSection" class="features-section">
      <!-- Title above the cards -->
      <h2 class="section-title animate-pop-in">Features</h2>

      <div class="features-list">
        <div class="feature-card animate-slide-left">
          <i class="pi pi-comments feature-icon"></i>
          <h3>Real-time Chat</h3>
          <p>Connect instantly with your matches</p>
        </div>
        <div class="feature-card animate-slide-right">
          <i class="pi pi-users feature-icon"></i>
          <h3>Gamified Dating Experience</h3>
          <p>Participate in our in-app games to gain access to new matches</p>
        </div>
        <div class="feature-card animate-slide-left">
          <i class="pi pi-calendar feature-icon"></i>
          <h3>Unbiased Matchmaking</h3>
          <p>Matchmaking is done by calculating game scores</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import { ref } from 'vue';

const featuresSection = ref(null);

const scrollToFeatures = () => {
  featuresSection.value.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
.landing-page {
  font-family: 'Roboto Flex', sans-serif;
  color: #333;
  min-height: 100vh;
}

.hero-section {
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  background: linear-gradient(90deg, #ff7676, #f54ea2, #ffb3b3);
  background-size: 600% 600%;
  animation: gradient-animation 25s ease infinite;
  overflow: hidden;
}

.hero-content {
  z-index: 2;
  position: relative;
  padding: 0 1rem;
}

.hero-content h1 {
  font-size: 4rem;
  margin-bottom: 2rem;
}

.app-logo {
  width: 200px; 
  height: auto; 
  margin-bottom: 2rem;
  animation: fadeIn 1s ease; 
  margin: auto;
}

h2.section-title {
  font-size: 2rem;
  margin-bottom: 10px;
  color: rgb(219, 115, 132);
  animation: popIn 1.5s ease-out;
}

h3 {
  font-weight: bold;
}

.hero-content p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.hero-content .p-button {
  animation: scaleUp 1s ease-in-out;
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
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

.scroll-indicator {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  cursor: pointer;
}

.scroll-text {
  font-size: 1rem;
}

.pi-arrow-down {
  font-size: 1.5rem;
}

.features-section {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: rgb(219, 115, 132);
  animation: popIn 1.5s ease-out;
  text-align: center;
}

.features-list {
  display: flex;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  padding: 1rem;
  flex-wrap: wrap;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 300px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  margin:auto;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  color: rgb(219, 115, 132);
  margin-bottom: 25px;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

/* Responsive Layouts */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-content p {
    font-size: 1.2rem;
  }

  .app-logo {
    width: 150px;
  }

  .features-list {
    flex-direction: column;
  }

  .feature-card {
    width: 80%;
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-content p {
    font-size: 1rem;
  }

  .app-logo {
    width: 100px;
  }

  .scroll-text {
    font-size: 0.8rem;
  }

  .pi-arrow-down {
    font-size: 1.2rem;
  }

  .features-section {
    padding: 1rem;
  }
}

/* Animations */
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

@keyframes popIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
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
</style>