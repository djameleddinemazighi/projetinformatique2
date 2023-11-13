<template>
  <div class="users-list">
    <h2>Roles List</h2>
    <div v-if="notauthenticated">
    Connecter vous pour avoir la liste</div>
    <div v-if="authenticated">
      <ul>
        <li v-for="role in roles" :key="role.id" style="border: 1px solid black;">
          <span>Name: {{ role.nom }} </span>
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

export default {
  data() {
    return {
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
      this.fetchRoles();
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
    fetchRoles() {
        // Fetch the list of users from the backend
        axios.get('/api/role/roles', { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } })
        .then((response) => {
          this.roles = response.data;
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
