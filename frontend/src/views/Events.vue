<template>
  <div class="role-form">
    
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

    <div v-if="authenticated ">
      <div class="event-list">
        <h2>Event List</h2>
        <ul style="text-align: center;">
          <li v-for="event in events" :key="event.id" class="event-item">
            <span>Name: {{ event.name }}</span> <br>
             <span>Location: {{ event.location }}</span> <br>
              <span>Description: {{ event.description }}</span>
              <button v-if="authenticated && role == 'staff' " :id="event.id"  @click="DeleteEvent($event)" class="deleteb">Delete</button>

              <button @click="editEvent(event.id)" class="edit-button" v-if="authenticated && role == 'staff'">Edit</button>

              <div v-if="editEventId === event.id">
                <h3>Edit Event</h3>
                <form @submit.prevent="saveEdit(event)">
                  
                  <div class="form-event">
                    <label for="editedEventName">Event Name:</label>
                    <input type="text" id="editedEventName" v-model="event.updatedName" required>
                    <label for="editedEventLocation">Event Location:</label>
                    <input type="text" id="editedEventLocation" v-model="event.updatedLocation" required>
                    <label for="editedEventDescription">Event Description:</label>
                    <input type="text" id="editedEventDescription" v-model="event.updatedDescription" required>
                  </div>
                  <button type="button" @click="cancelEdit(event)">Cancel</button>
                  <button type="submit" @click="saveEdit(event.id)" class="add-role-button">Save</button>
                </form>
                
              </div>
          </li>
        </ul>
      </div>
      <div class="add-event-form" v-if="authenticated && role == 'staff'">
        <h2>Add event</h2>
        <form @submit.prevent="addEvent">
          <div class="form-event">
            <label for="eventname">event Name:</label>
            <input type="text" id="eventname" v-model="eventData.name" required>
              <label for="eventname">event Location:</label>
            <input type="text" id="eventlocation" v-model="eventData.location" required>
              <label for="eventname">event Description:</label>
            <input type="text" id="eventdesc" v-model="eventData.description" required>
          </div>
          <button type="submit" class="add-role-button">Add event</button>
        </form>
      </div>
    </div>
    <div v-else>
      <p>You need to be university staff to access the event list.</p>
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
      errors :[],
      editEventId: null, 
      events: [],
      role:'',
      eventData: {
        name: '',
        location: '',
        description:'',
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
      this.fetchevents();
    } else {
      this.notAuthenticated = true;
    }
  },
  methods: {
    isAuthenticated() {
      const token = store.getToken();
      return !!token;
    },
    
    addEvent() {
      axios.post('/api/events/add', this.eventData, {
        headers: { Authorization: `Bearer ${store.getToken() }`,"email":store.getEmail() },
      })
        .then((response) => {
          if (response.data) {
            this.successMessage = 'event added successfully!';
            this.errorMessage = '';
            this.eventData.name = ''; // Clear the event name field
            this.fetchevents(); // Update the list after adding a event
          } else {
            this.successMessage = '';
            this.errorMessage = response.data.error;
          }
        })
        .catch((errors) => {
          console.error('Error adding event:', errors);
          this.successMessage = '';
          this.errorMessage = errors.response.data.error;
        });
    },
    fetchevents() {
      axios.get('/api/events', {
        headers: { Authorization: `Bearer ${store.getToken()}` },
      })
        .then((response) => {
          this.events = response.data;
          // Adding edit mode flag and updated fields to each event
          this.events.forEach(event => {
            event.editMode = false;
            event.updatedName = event.name;
            event.updatedLocation = event.location;
            event.updatedDescription = event.description;
          });
        })
        .catch((error) => {
          console.error('Failed to retrieve events:', error);
        });
    },
    DeleteEvent(e) {
      axios.delete(`/api/events/delete/${e.target.id}`, {
        headers: { Authorization : `Bearer ${store.getToken()}`, email:store.getEmail() },
      })
        .then((response) => {
          if (response.data.success) {
            this.successMessage = 'Event Deleted successfully!';
            this.errorMessage = '';
            this.fetchevents();
          } else {
            this.successMessage = '';
            this.errorMessage = response.data.error;
          }
        })
        .catch((errors) => {
          this.successMessage = "";
          console.log('Error:', error.response.data); // Check the actual error data
  this.errors = error.response.data.errors; // Set errors based on the response data
  console.log('Errors:', this.errors); // Log this.errors for confirmation
        });

    },
     editEvent(eventId) {
    this.editEventId = eventId; // Set the ID of the event being edited
  },
     cancelEdit(event) {
       this.editEventId = null;
    },
    saveEdit(event) {
  

  const updatedEvent = {
    name: event.updatedName,
    location: event.updatedLocation,
    description: event.updatedDescription,
  };

  axios.put(`/api/events/update/${this.editEventId}`, updatedEvent, {
    headers: {
      Authorization: `Bearer ${store.getToken()}`,
      email: store.getEmail(),
    },
  })
    .then((response) => {
      console.log(response.data);
       this.successMessage = 'Event Updated successfully!';
            this.errorMessage = '';
      this.fetchevents();
      this.editEventId = null;
    })
    .catch((error) => {
      console.error(error);
      this.errors = error.response.data.errors;
    });
},
  }
};
</script>

<style scoped>
/* Styling for event List */
.event-list {
  margin-bottom: 20px;
}

.event-item {
  border: 1px solid #ccc;
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 5px;
      display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

/* Styling for Add event Form */
.add-event-form {
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

.form-event {
  text-align: left;
  margin-bottom: 15px;
}

.form-event label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: left;
}

.form-event input {
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

@media screen and (max-width: 768px) {
  /* Adjustments for smaller screens */
  nav {
    padding: 10px;
  }

  .content {
    margin: 10px;
    padding: 15px;
  }
}

.event-list {
  margin-bottom: 20px;
}

.event-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

.event-details {
  margin-bottom: 10px;
}

.event-details span {
  display: block;
  margin-bottom: 5px;
}

.event-buttons {
  display: flex;
  justify-content: space-between;
}

.deleteb {
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  margin: 10px;
}

.deleteb:hover {
  background-color: #c82333;
}

.edit-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  margin: 10px;
}

.edit-button:hover {
  background-color: #0056b3;
}

/* Rest of your existing styles */
/* ... */

@media screen and (max-width: 768px) {
  .event-item {
    padding: 15px;
  }
  
  .deleteb,
  .edit-button {
    padding: 6px 10px;
    font-size: 12px;
    margin: 10px;
  }
}
</style>
