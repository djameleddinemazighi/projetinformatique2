<template>
  <div v-if="authenticated && role === 'staff'">
    <h2>Roles List</h2>
    <div v-if="notAuthenticated">
      Please log in to view the list.
    </div>
    <div v-else>
      <div class="success-message" v-if="successMessage">{{ successMessage }}</div>
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>

      <div v-if="errors.length > 0" class="error-list">
  <h3>Error List:</h3>
  <ul>
    <li v-for="(error, index) in errors" :key="index" class="error-message error-item">
      {{ error.msg }}
    </li>
  </ul>
</div>

      <ul class="users-list">
        <li v-for="roleItem in roles" :key="roleItem.id" style="">
          <span>Name: {{ roleItem.nom }} </span>
          <button :id="roleItem.id" @click="deleteRole($event)" class="deleteb">Delete</button>
          <button v-if="roleItem.nom != 'staff' && roleItem.nom != 'teacher' && roleItem.nom != 'student'" @click="editRole(roleItem.id)" class="edit-button">Edit</button>
          <span v-if="roleItem.nom == 'staff' || roleItem.nom == 'teacher' || roleItem.nom == 'student'" >Can't edit</span>
          <div v-if="editRoleId === roleItem.id">
            <h3>Edit Role</h3>
            <form @submit.prevent="saveEdit(roleItem)">
              <div class="form-event">
                <label for="editedRoleName">Role Name:</label>
              <input type="text" id="editedRoleName" name="nom" v-model="roleItem.updatedName" required>
              </div>
              <button type="button" class="cancel-button" @click="cancelEdit(roleItem)">Cancel</button>
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
      editRoleId: '',
      roles: [],
      role: '',
      authenticated: false,
      notAuthenticated: false,
      successMessage: '',
      errors: [],
      errorMessage:'',
    };
  },
  created() {
    this.authenticated = this.isAuthenticated();
    this.role = store.getRole();
    
    if (this.authenticated) {
      this.fetchRoles();
    } else {
      this.notAuthenticated = true;
    }
  },
  methods: {
    isAuthenticated() {
      const token = store.getToken();
      return !!token;
    },
    fetchRoles() {
      axios.get('/api/role/roles', { headers: { "Authorization": `Bearer ${store.getToken()}` } })
        .then((response) => {
          this.roles = response.data;
        })
        .catch((error) => {
          console.error('Failed to retrieve roles:', error);
        });
    },
    deleteRole(e) {
      axios.delete(`/api/role/delete/${e.target.id}`, {
        headers: { Authorization: `Bearer ${store.getToken()}`, email: store.getEmail() },
      })
        .then((response) => {
          if (response.data.success) {
            this.successMessage = 'Role deleted successfully!';
            this.errorMessage = '';
            this.fetchRoles();
          } else {
            this.successMessage = '';
            this.errorMessage = response.data.error;
          }
        })
        .catch((errors) => {
          this.successMessage = '';
          this.errorMessage = errors.response.data.error;
        });
    },
  editRole(roleId) {
  this.editRoleId = roleId;
  const roleItem = this.roles.find(role => role.id === roleId);
  if (roleItem) {
    roleItem.updatedName = roleItem.nom; // Initialize with the current name value
  }
},


    cancelEdit(roleItem) {
      this.editRoleId = null;
      roleItem.updatedName = ''; // Reset the updated name
    },
    saveEdit(roleItem) {
      const updatedRole = {
        nom: roleItem.updatedName,
      };

      axios.put(`/api/role/update/${roleItem.id}`, updatedRole, {
        headers: {
          Authorization: `Bearer ${store.getToken()}`,
          email: store.getEmail(),
        },
      })
        .then((response) => {
          this.successMessage = 'Role updated successfully!';
          this.errorMessage = '';
          this.fetchRoles();
          this.editRoleId = null;
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
      display: flex;
    flex-wrap: wrap;
    justify-content: center;
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
