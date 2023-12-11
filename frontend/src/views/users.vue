<template>
  <div v-if="authenticated && role === 'staff'">
    <h2>Users List</h2>
    <div v-if="notAuthenticated">
      Please log in to view the list.
    </div>
    <div v-else>
      <!-- Existing messages for success and error -->
      <div class="success-message" v-if="successMessage">{{ successMessage }}</div>
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>

      <ul class="users-list">
        <li v-for="user in users" :key="user.id">
          <span>Name: {{ user.nom }} </span> <br>
          <span>First Name: {{ user.prenom }}</span> <br>
          <span>Telephone: {{ user.telephone }}</span> <br>
          <span>Email: {{ user.email }}</span> <br>
          <span>Role: {{ user.selectedRole }}</span> <br>
          <button :id="user.id" @click="deleteUser($event)"  class="deleteb">Delete</button>
          <button @click="editUser(user.id)" class="edit-button">Edit</button>

          <!-- Edit form -->
          <div v-if="editUserId === user.id">
            <h3>Edit User</h3>
            <form @submit.prevent="saveEdit(user)">
              <div class="form-user">
                <label for="editedUserName">Name:</label>
                <input type="text" id="editedUserName" v-model="user.updatedName" required>
              </div>
              <div class="form-user">
                <label for="editedUserFirstName">First Name:</label>
                <input type="text" id="editedUserFirstName" v-model="user.updatedFirstName" required>
              </div>
              <div class="form-user">
                <label for="editedUserTelephone">Telephone:</label>
                <input type="text" id="editedUserTelephone" v-model="user.updatedTelephone" required>
              </div>
              <div class="form-user" v-if="user.email !== 'admin@univ.com'">
                <label for="editedUserEmail">Email:</label>
                <input type="email" id="editedUserEmail" v-model="user.updatedEmail" required>
              </div>
              <button type="button" class="cancel-button" @click="cancelEdit(user)">Cancel</button>
              <button type="submit" class="save-button">Save</button>
            </form>
          </div>
        </li>
      </ul>
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
      role:'',
      editUserId: '',
      successMessage:null,
      errorMessage:null,
      users: [],
        authenticated: false,
      notauthenticated :false,
    };
  },
  created() {
    // Check if the user is authenticated
    this.authenticated = this.isAuthenticated();
this.role = store.getRole();
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
      const token = store.getToken();
      return !!token;
    },
    fetchUsers() {
        // Fetch the list of users from the backend
        axios.get('/api/user/users', { headers: { "Authorization": `Bearer ${store.getToken()}` } })
        .then((response) => {
          this.users = response.data;
        })
        .catch((error) => {
          console.error('Failed to retrieve users:', error);
        });
    },

    DeleteUser(e) {
        // Fetch the list of users from the backend
        axios.delete(`/api/user/delete/${e.target.id}`, {  headers: { Authorization : `Bearer ${store.getToken()}`, email:store.getEmail() } })
         .then((response) => {
          if (response.data.success) {
            console.log(response.data)
            this.successMessage = 'User Deleted successfully!';
            this.errorMessage = '';
            this.fetchUsers();
          } else {
            this.successMessage = '';
            this.errorMessage = response.data.error;
          }
        })
        .catch((errors) => {
          console.log(errors);
          this.successMessage = '';
          this.errorMessage = errors.response.data.error;
        });

    },
    editUser(userId) {
  this.editUserId = userId;
  const UserItem = this.users.find(user => user.id === userId);
  if (UserItem) {
    UserItem.updatedName = UserItem.nom; // Initialize with the current name value
    UserItem.updatedEmail = UserItem.email;
    UserItem.updatedFirstName = UserItem.prenom;
     UserItem.updatedTelephone = UserItem.telephone;
  }
    },
 cancelEdit(UserItem) {
      this.editUserId = null;
      UserItem.updatedName = ''; // Reset the updated name
    },
    saveEdit(UserItem) {
      const updatedUser = {
        nom: UserItem.updatedName,
        prenom: UserItem.updatedFirstName,
        email: UserItem.updatedEmail,
        telephone: UserItem.updatedTelephone
      };

      axios.put(`/api/user/update/${UserItem.id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${store.getToken()}`,
          email: store.getEmail(),
        },
      })
        .then((response) => {
          this.successMessage = 'User updated successfully!';
          this.errorMessage = '';
          this.fetchUsers();
          this.editUserId = null;
        })
        .catch((error) => {
          console.log(error);
          this.successMessage = '';
          this.errorMessage = error.response.data.error;
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
