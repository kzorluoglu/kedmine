<template>
  <div>
    <div>
      Ticket #<span>{{ ticketNumber}}</span>
      Comment <input type="text" :value="ticketComment">
      <span>{{ days }}d </span>
      <span>{{ hours }}h </span>
      <span>{{ minutes }}m </span>
      <span>{{ seconds }}s </span>
    </div>
    <button @click="toggleTimer">
      {{ isRunning ? 'Pause' : 'Play' }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    ticketNumber: {
      type: String,   // or Number, depending on what you prefer
      required: true  // if you want to ensure an ID is always passed
    },
    ticketComment: {
      type: String,   // or Number, depending on what you prefer
    },
  },
  data() {
    return {
      interval: null,
      startTime: null,
      isRunning: false,
      elapsedTime: 0,
    };
  },
  created() {
    this.loadStateFromLocalStorage();
  },
  computed: {
    elapsedSeconds() {
      const now = new Date().getTime();
      const timeSinceStart = this.startTime ? (now - this.startTime) : 0; // Time since last start
      return Math.floor((timeSinceStart + this.elapsedTime) / 1000);
    },
    days() {
      return Math.floor(this.elapsedSeconds / (24 * 60 * 60));
    },
    hours() {
      return Math.floor((this.elapsedSeconds % (24 * 60 * 60)) / (60 * 60));
    },
    minutes() {
      return Math.floor((this.elapsedSeconds % (60 * 60)) / 60);
    },
    seconds() {
      return this.elapsedSeconds % 60;
    },
  },
  methods: {
    updateTimer() {
      this.$forceUpdate();  // Force Vue to re-render the component
    },
    toggleTimer() {
      if (this.isRunning) {
        // Pausing the timer
        clearInterval(this.interval);
        this.elapsedTime += new Date().getTime() - this.startTime; // Accumulate elapsed time
        this.startTime = null;  // Reset start time
      } else {
        // Starting/resuming the timer
        this.startTime = new Date().getTime();  // Set new start time
        this.interval = setInterval(this.updateTimer, 1000);
      }
      this.isRunning = !this.isRunning;
      this.saveStateToLocalStorage();
    },
    saveStateToLocalStorage() {
      const timerState = {
        startTime: this.startTime,
        elapsedTime: this.elapsedTime,
        isRunning: this.isRunning
      };
      localStorage.setItem('timerState_' + this.ticketNumber, JSON.stringify(timerState));
    },
    loadStateFromLocalStorage() {
      const savedState = localStorage.getItem('timerState_' + this.ticketNumber);
      if (savedState) {
        const timerState = JSON.parse(savedState);
        this.startTime = timerState.startTime;
        this.elapsedTime = timerState.elapsedTime;
        this.isRunning = timerState.isRunning;

        if (this.isRunning) {
          this.interval = setInterval(this.updateTimer, 1000);
        }
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
    this.saveStateToLocalStorage();
  },
};
</script>
