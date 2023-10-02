<script>
import Timer from "./Timer.vue";
import axios from 'axios';

export default {
  components: {
    Timer,
  },
  data(){
    return {
      tickets: [],
      searchTerm: '', // for the realtime search
    }
  },
  computed: {
    filteredTickets() {
      return this.tickets.filter(ticket => {
        return ticket.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          ticket.number.includes(this.searchTerm);
      });
    }
  },
  mounted() {
    this.fetchTickets();
  },
  methods: {
    async fetchTickets() {
      try {
        // Assuming the Redmine API endpoint to get tickets is '/tickets'
        // You also might need authentication headers depending on your setup
        let response = await axios.get('/tickets', {
          params: {
            // Include any necessary parameters for the API request
          },
          headers: {
            // Include necessary headers, e.g., authentication tokens
          },
        });
        this.tickets = response.data.slice(0, 50); // take last 50 tickets
        localStorage.setItem('tickets', JSON.stringify(this.tickets));
      } catch (error) {
        console.error('There was an error fetching the tickets:', error);
        // Try to load from localStorage if the request fails
        this.tickets = JSON.parse(localStorage.getItem('tickets')) || [];
      }
    }
  },
};
</script>

<template>
  <input type="text" v-model="searchTerm" placeholder="Search by text or ticket number...">

  <div v-for="ticket in filteredTickets" :key="ticket.number">
    <Timer :ticketNumber="ticket.number"/>
  </div>
</template>

<style lang="less">
@import '../assets/css/styles.less';
</style>
