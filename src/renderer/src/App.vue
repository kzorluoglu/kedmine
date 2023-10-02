<script>
import Timer from "./components/Timer.vue";
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
      getSettings() {
        return {
          redmineURL: localStorage.getItem('redmineURL') || '',
          htaccessUsername: localStorage.getItem('htaccessUsername') || '',
          htaccessPassword: localStorage.getItem('htaccessPassword') || '',
          apiToken: localStorage.getItem('apiToken') || '',
        }
      },
      async fetchTickets() {
        const settings = this.getSettings();

        // Check for necessary information
        if (!settings.redmineURL || !settings.apiToken) {
          console.error('Redmine URL or API Token is missing. Please configure in the setup page.');
          return;
        }

        // Construct headers
        let headers = {
          'X-Redmine-API-Key': settings.apiToken,
        };

        if (settings.htaccessUsername && settings.htaccessPassword) {
          headers['Authorization'] = 'Basic ' + btoa(settings.htaccessUsername + ':' + settings.htaccessPassword);
        }

        try {
          let response = await axios.get(`${settings.redmineURL}/issues.json`, {
            params: {
              // Include any necessary parameters for the API request
            },
            headers: headers,
          });

          this.tickets = response.data.issues.slice(0, 50); // take last 50 issues
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
  <div id="app">
    <nav class="navbar">
      <router-link to="/" class="nav-link">Timers</router-link>
      <router-link to="/setup" class="nav-link">Setup </router-link>
    </nav>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: #007bff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid #007bff;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
}

.nav-link:hover {
  background-color: #007bff;
  color: #fff;
}

.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>
