<template>
  <div class="users-list">
    <h2>Users List</h2>
    <div v-if="notauthenticated">
    Connecter vous pour avoir la liste</div>
    <div v-if="authenticated" style="display: flex;
    justify-content: center;">
      <ul>
        <li v-for="user in users" :key="user.id">
        <div style="display:flex;flex-direction:row-reverse;">
        <div style="align-self:center;">
        <span>Name: {{ user.nom }} {{ user.prenom }}</span> <br>
          <span>Email: {{ user.email }} </span> <br>
           <span>Role: {{ user.selectedRole }} </span>
        </div>
        <div>
                  <img v-bind:src="user.photo" style="width:50px;border-radius:50px;">
        </div>
        </div>
        
          
        </li>
      </ul>
    </div>
    <div v-else>
      <p>You need to be authenticated to access the users list.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
        authenticated: false,
      notauthenticated :false,
    };
  },
  created() {
    // Check if the user is authenticated
    this.authenticated = this.isAuthenticated();

    // If authenticated, fetch the list of users
    if (this.authenticated) {
      this.fetchUsers();
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
    fetchUsers() {
        // Fetch the list of users from the backend
        axios.get('/api/user/users', { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } })
        .then((response) => {
          this.users = response.data;
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
