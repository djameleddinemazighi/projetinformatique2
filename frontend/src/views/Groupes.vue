<template>
  <div class="role-form">
    <h2>Add Group</h2>
    <div v-if="notAuthenticated">
      Please log in to view the list.
    </div>
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

    <div v-if="authenticated && role == 'staff'">
      <div class="group-list">
        <h3>Group List</h3>
        <ul>
          <li v-for="group in groups" :key="group.id" class="group-item">
            <span>Name: {{ group.name }}</span>
            <button :id="group.id" @click="DeleteGroup($event)" class="deleteb">Delete</button>
            <button @click="editGroup(group)" class="edit-button">Edit</button>

            <div v-if="editGroupId === group.id">
              <h3>Edit Group</h3>
              <form @submit.prevent="saveEditGroup(group)">
                <div class="form-group">
                  <label for="editedGroupName">Group Name:</label>
                  <input type="text" id="editedGroupName" v-model="group.updatedName" required>
                </div>
                <button type="button" class="cancel-button" @click="cancelEditGroup(group)">Cancel</button>
                <button type="submit" class="save-button ">Save</button>
              </form>
            </div>
          </li>
        </ul>
      </div>
      <div class="add-group-form">
        <form @submit.prevent="addGroup">
          <div class="form-group">
            <label for="groupName">Group Name:</label>
            <input type="text" id="groupName" v-model="groupData.name" required>
          </div>
          <button type="submit" class="add-role-button">Add Group</button>
        </form>
      </div>
    </div>

    <div v-else>
      <p>You need to be university staff to access the group list.</p>
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
      errors: [],
      editGroupId: null,
      groups: [],
      role: '',
      groupData: {
        name: '',
      },
      successMessage: '',
      errorMessage: '',
      authenticated: false,
      notAuthenticated: false,
    };
  },
  created() {
    this.authenticated = this.isAuthenticated();
    this.role = store.getRole();

    if (this.authenticated) {
      this.fetchGroups();
    } else {
      this.notAuthenticated = true;
    }
  },
  methods: {
    isAuthenticated() {
      const token = store.getToken();
      return !!token;
    },
    addGroup() {
      axios.post('/api/user/groupes/create', this.groupData, {
        headers: { Authorization: `Bearer ${store.getToken()}` },
      })
        .then((response) => {
          if (response.data) {
            this.successMessage = 'Group added successfully!';
            this.errorMessage = '';
            this.groupData.name = '';
            this.fetchGroups();
          } else {
            this.successMessage = '';
            this.errorMessage = response.data.error;
          }
        })
        .catch((error) => {
          console.error('Error adding group:', error);
          this.successMessage = '';
          this.errorMessage = 'Network error. Please try again.';
        });
    },
    DeleteGroup(e) {
      axios.delete(`/api/user/groupes/delete/${e.target.id}`, {
        headers: { Authorization: `Bearer ${store.getToken()}` },
      })
        .then((response) => {
          if (response.data) {
            this.successMessage = 'Group Deleted successfully!';
            this.errorMessage = '';
            this.groupData.name = '';
            this.fetchGroups();
          } else {
            this.successMessage = '';
            this.errorMessage = response.data.error;
          }
        })
        .catch((error) => {
          console.error('Error deleting group:', error);
          this.successMessage = '';
          this.errorMessage = 'Network error. Please try again.';
        });
    },
    fetchGroups() {
      axios.get('/api/user/groupes', {
        headers: { Authorization: `Bearer ${store.getToken()}` },
      })
        .then((response) => {
          this.groups = response.data;
        })
        .catch((error) => {
          console.error('Failed to retrieve groups:', error);
        });
    },
    editGroup(group) {
      this.editGroupId = group.id;
      group.updatedName = group.name; // Set initial value for editing
    },
    cancelEditGroup(group) {
      this.editGroupId = null;
      group.updatedName = ''; // Reset the updated name
    },
    saveEditGroup(group) {
      const updatedGroup = {
        name: group.updatedName,
      };

      axios.put(`/api/user/groupes/update/${group.id}`, updatedGroup, {
    headers: {
      Authorization: `Bearer ${store.getToken()}`,
      email: store.getEmail(),
    },
  })
    .then((response) => {
      this.successMessage = 'Group Updated successfully!';
      this.errorMessage = '';
      this.fetchGroups();
      this.editGroupId = null;
    })
    .catch((error) => {
      console.log('Error:', error.response.data); // Check the actual error data
  this.errors = error.response.data.errors; // Set errors based on the response data
  console.log('Errors:', this.errors); // Log this.errors for confirmation
    });
    },
  },
};
</script>

<style scoped>
/* Styling for Group List */
.group-list {
  margin-bottom: 20px;
}

.group-item {
  border: 1px solid #ccc;
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: space-around;
  align-items: center;
      display: flex;
    flex-wrap: wrap;
}

/* Styling for Add Group Form */
.add-group-form {
  text-align: center;
}

/* Rest of your existing styles */
/* ... */

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
.edit-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
}




</style>
