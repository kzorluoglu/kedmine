<script>
import { EventBus } from "../eventBus";

export default {
  name: 'Timer',
  props: {
    ticketNumber: 'String'
  },
  data() {
    return {
      ticketComment: '',
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      lastUpdate: null,
    };
  },
  computed: {
    usedTime() {
      if (this.isRunning) {
        const now = new Date().getTime();
        const timeSinceLastUpdate = this.lastUpdate ? now - this.lastUpdate : 0;
        return this.elapsedTime + timeSinceLastUpdate;
      }
      return this.elapsedTime;
    },
  },
  methods: {
    toggleTimer() {
      if (this.isRunning) {
        clearInterval(this.interval);
      } else {
        // Emit the 'timer-started' event before starting the timer
        EventBus.emit('timer-started', this.ticketNumber);

        this.lastUpdate = new Date().getTime();
        this.interval = setInterval(this.updateTimer, 1000);
      }
      this.isRunning = !this.isRunning;
      this.saveStateToLocalStorage();
    },
    pauseTimer() {
      if (this.isRunning) {
        clearInterval(this.interval);
        this.isRunning = false;
        this.saveStateToLocalStorage();
      }
    },
    updateTimer() {
      const now = new Date().getTime();
      const timeSinceLastUpdate = this.lastUpdate ? now - this.lastUpdate : 0;
      this.elapsedTime += timeSinceLastUpdate;
      this.lastUpdate = now;
    },
    saveStateToLocalStorage() {
      const timerState = {
        startTime: this.startTime,
        elapsedTime: this.elapsedTime,
        lastUpdate: this.lastUpdate,
        isRunning: this.isRunning,
      };
      localStorage.setItem('timerState_' + this.ticketNumber, JSON.stringify(timerState));
    },
    loadStateFromLocalStorage() {
      const savedState = localStorage.getItem('timerState_' + this.ticketNumber);
      if (savedState) {
        const timerState = JSON.parse(savedState);
        this.startTime = timerState.startTime;
        this.elapsedTime = timerState.elapsedTime;
        this.lastUpdate = timerState.lastUpdate;
        this.isRunning = timerState.isRunning;
        if (this.isRunning) {
          this.interval = setInterval(this.updateTimer, 1000);
        }
      }
    },
    formatTime(milliseconds) {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    },
    pad(value) {
      return value.toString().padStart(2, '0');
    },
  },
  created() {
    this.loadStateFromLocalStorage();
    EventBus.on('timer-started', (ticketNumber) => {
      if (ticketNumber !== this.ticketNumber) {
        this.pauseTimer();
      }
    });
  },
  beforeDestroy() {
    clearInterval(this.interval);
    this.saveStateToLocalStorage();

    // Cleanup to avoid potential memory leaks
    EventBus.off('timer-started');
  },
};
</script>
<template>
  <div class="card">
    <div class="card-body">
      <div class="timer-row">
        <div class="timer-cell">
          <span class="label">Ticket #{{ ticketNumber }}</span>
          <input class="comment-input" v-model="ticketComment" />
        </div>
        <div class="timer-cell fixed-width timer">
          <span>{{ formatTime(usedTime) }}</span>
        </div>
        <div class="timer-cell fixed-width">
          <button class="toggle-button" @click="toggleTimer">{{ isRunning ? 'Pause' : 'Play' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card {
  border: 1px solid rgba(0,0,0,.125);
  border-radius: .25rem;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,.1);
  overflow: hidden;
  margin-bottom: 1rem;
}

.card-header {
  background-color: rgba(0,0,0,.03);
  border-bottom: 1px solid rgba(0,0,0,.125);
  padding: .75rem 1.25rem;
  font-weight: bold;
}

.card-body {
  padding: 1.25rem;
}

.timer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.timer-cell {
  padding: 5px;
  flex-grow: 1;
  vertical-align: middle;
}

.fixed-width {
  width: 100px; /* Adjust the fixed width as needed */
}

.label {
  font-weight: bold;
}

.comment-input {
  width: 100%;
  padding: 5px;
  border: none;
  border-radius: .25rem;
  transition: box-shadow .15s ease-in-out;
}

.comment-input:focus {
  box-shadow: 0 0 0 .2rem rgba(0,123,255,.25);
  outline: 0;
}

.timer {
  text-align: center;
}

.toggle-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: .25rem;
  transition: background-color .15s ease-in-out;
}

.toggle-button:hover {
  background-color: #0056b3;
}

</style>
