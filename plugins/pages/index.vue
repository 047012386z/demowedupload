<template>
    <div>
      <video ref="video" autoplay></video>
      <button @click="takePhoto">ถ่ายรูป</button>
      <button @click="startRecording">เริ่มบันทึกวิดีโอ</button>
      <button @click="stopRecording">หยุดบันทึก</button>
      <button @click="fetchImages">โหลดภาพทั้งหมด</button>
      <div ref="gallery"></div>
    </div>
  </template>
  
  <script>
  import { storage, db } from '@/plugins/firebase';
  
  export default {
    data() {
      return {
        mediaRecorder: null,
        recordedChunks: [],
      };
    },
    mounted() {
      this.startCamera();
    },
    methods: {
      async startCamera() {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        this.$refs.video.srcObject = stream;
      },
      async takePhoto() {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = this.$refs.video.videoWidth;
        canvas.height = this.$refs.video.videoHeight;
        context.drawImage(this.$refs.video, 0, 0);
        const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
        const url = await this.uploadImage(imageBlob);
        await this.saveImageUrl(url);
      },
      async uploadImage(imageBlob) {
        const fileRef = storage.ref(`images/${Date.now()}.jpg`);
        await fileRef.put(imageBlob);
        return await fileRef.getDownloadURL();
      },
      async saveImageUrl(url) {
        await db.collection("images").add({ url });
      },
      async startRecording() {
        const stream = this.$refs.video.srcObject;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event) => {
          this.recordedChunks.push(event.data);
        };
        this.mediaRecorder.start();
      },
      stopRecording() {
        this.mediaRecorder.stop();
        this.mediaRecorder.onstop = async () => {
          const videoBlob = new Blob(this.recordedChunks, { type: "video/webm" });
          const url = await this.uploadImage(videoBlob);
          await this.saveImageUrl(url);
          this.recordedChunks = [];
        };
      },
      async fetchImages() {
        const snapshot = await db.collection("images").get();
        this.$refs.gallery.innerHTML = '';
        snapshot.forEach(doc => {
          const imgElement = document.createElement("img");
          imgElement.src = doc.data().url;
          this.$refs.gallery.appendChild(imgElement);
        });
      }
    }
  };
  </script>
  
  <style>
  video {
    width: 100%;
    height: auto;
  }
  img {
    max-width: 100px;
    margin: 5px;
  }
  </style>
  