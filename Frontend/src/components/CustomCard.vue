<template>
  <div class="card-wrapper mb-4 w-full md:w-auto">
    <div class="flip-container" :class="{ flipped: isFlipped, [swipeClass]: swipeClass }" ref="flipContainer">
      
      <!-- Front of the card (Header with full color) -->
      <div class="card-front" :style="{ backgroundColor: frontColor }">
        <h2 class="header-text">{{ headerText }}</h2>
        <i 
          class="pi pi-images flip-icon cursor-pointer" 
          @click="flipCard" 
          aria-hidden="true" 
        />
      </div>
      
      <!-- Back of the card (Editable textarea and image/video upload) -->
      <div class="card-back" :style="{ borderColor: frontColor }">
        <div class="content-area">
          <textarea 
            v-model="editableText" 
            class="editable-textarea" 
            placeholder="Enter your text here..."
          ></textarea>
          
          <!-- Upload image or video -->
          <div class="upload-section">
            <input type="file" @change="handleFileUpload" accept="image/*, video/*" />
          </div>

          <!-- Display uploaded images or videos -->
          <div v-if="uploadedMedia.length > 0" class="media-preview">
            <div v-for="(media, index) in uploadedMedia" :key="index" class="media-item">
              <img v-if="media.type.includes('image')" :src="media.url" class="media-preview-img" />
              <video v-if="media.type.includes('video')" :src="media.url" controls class="media-preview-video"></video>
            </div>
          </div>
        </div>

        <i 
          class="pi pi-images flip-icon cursor-pointer" 
          @click="flipCard" 
          aria-hidden="true" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: "CustomCard",
  props: {
    headerText: {
      type: String,
      default: 'My Custom Header'
    },
    frontColor: {
      type: String,
      default: '#4CAF50' // Default color
    },
  },
  setup(props) {
    const isFlipped = ref(false);
    const editableText = ref('');
    const uploadedMedia = ref([]);

    // Method to flip the card
    const flipCard = () => {
      isFlipped.value = !isFlipped.value;
    };

    // Method to handle file uploads
    const handleFileUpload = (event) => {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileURL = URL.createObjectURL(file);
        uploadedMedia.value.push({ type: file.type, url: fileURL });
      }
    };

    return {
      isFlipped,
      editableText,
      uploadedMedia,
      flipCard,
      handleFileUpload,
    };
  },
};
</script>

<style scoped>
.card-wrapper {
  perspective: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flip-container {
  position: relative;
  width: 24rem;
  height: 15rem;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
}

.card-front {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.card-back {
  transform: rotateY(180deg);
  background-color: white;
  border: 5px solid;
  padding: 1rem;
}

.header-text {
  font-size: 2rem;
  font-weight: bold;
}

.flip-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  font-size: 2rem;
  cursor: pointer;
}

.editable-textarea {
  width: 100%;
  height: 5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 1rem;
}

.upload-section {
  margin-top: 1rem;
}

.media-preview {
  margin-top: 1rem;
}

.media-preview-img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.media-preview-video {
  width: 100%;
  border-radius: 8px;
}
</style>
