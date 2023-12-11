<template>
  <div class="users-list">
    <h2>ma classe</h2>
    <div v-if="notauthenticated">
    Connecter vous pour avoir la liste</div>
    <div v-if="authenticated">
      <ul>
        <li v-for="classe in classes" :key="classe.id" style="border: 1px solid black;">
          <span><img :src="classe.photo" alt="" srcset="" width="20px" height="20px" style="border-radius: 100%;"> Name: {{ classe.nom + " "+ classe.prenom }} </span>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>You need to be authenticated to access the roles list.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useCounterStore } from '@/store';
const store = useCounterStore();

export default {
  data() {
    return {
      classes:"",
      roles: [],
        authenticated: false,
      notauthenticated :false,
    };
  },
  created() {
    // Check if the user is authenticated
    this.authenticated = this.isAuthenticated();

    // If authenticated, fetch the list of users
    if (this.authenticated) {
      this.fetchstudents();
    } else {
        this.notauthenticated = true;
    }
  },
  methods: {
    isAuthenticated() {
      // Check if the user is authenticated (e.g., JWT token is present)
      const token = localStorage.getItem('token');
      return !!token;
    },
    fetchstudents() {
      // Fetch the list of users from the backend
      axios.get('/api/user/classe', { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}`, "email": localStorage.getItem('email') } } )
        .then((response) => {
          this.classes = response.data;
        })
        .catch((error) => {
          console.error('Failed to retrieve users:', error);
        });
    },
  },
};
</script>

<style scoped>
.users-list {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.users-list h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.users-list ul {
  list-style-type: none;
  padding: 0;
}

.users-list li {
  margin-bottom: 10px;
}
</style>
