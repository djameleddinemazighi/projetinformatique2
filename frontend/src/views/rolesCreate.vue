<template>
  <div class="role-form">
    <h2>Add Role</h2>
    <div v-if="notauthenticated">
    Connecter vous pour avoir la liste</div>
    <div class="success-message" v-if="successMessage">{{ successMessage }}</div>
<div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
    <form @submit.prevent="addRole">
      <div class="form-group">
        <label for="roleName">Role Name:</label>
        <input type="text" id="roleName" v-model="role.nom" required>
      </div>

      <button type="submit" class="add-role-button">Add Role</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      role: {
        nom: '',
      },
      successMessage: '',
        errorMessage: '',
       authenticated: false,
      notauthenticated :false,
    };
    },
   created() {
    // Check if the user is authenticated
    this.authenticated = this.isAuthenticated();

    // If authenticated, fetch the list of users
    if (this.authenticated) {
      //nn
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
    addRole() {
      // Send the role data to the backend
      axios
        .post('/api/role/create', this.role , { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } })
          .then((response) => {
            console.log(response)
          if (response.data) {
            this.successMessage = 'Role added successfully!';
            this.errorMessage = '';
            this.role.name = ''; // Clear the role name field
          } else {
            this.successMessage = '';
            this.errorMessage = response.data.error;
          }
        })
        .catch((error) => {
          console.error('Error adding role:', error);
          this.successMessage = '';
          this.errorMessage = 'Network error. Please try again.';
        });
    },
  },
};
</script>

<style scoped>
.role-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 60px;
  border: 1px solid #e1e1e1;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.role-form h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  text-align: left;
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: left;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e1e1e1;
  border-radius: 5px;
}

.add-role-button {
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.add-role-button:hover {
  background-color: #0056b3;
}

.success-message,
.error-message {
  padding: 10px;
  margin: 10px 0;
  text-align: center;
  border-radius: 5px;
}

.success-message {
  background-color: #2ecc71;
  color: #fff;
}

.error-message {
  background-color: #e74c3c;
  color: #fff;
}
</style>
