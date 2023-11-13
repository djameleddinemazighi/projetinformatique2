<!-- AddCourseComponent.vue -->

<template>
  <div class="add-course-container" v-if="authenticated">
    <h2>Add a New Course</h2>

      <div class="success-message" v-if="successMessage">{{ successMessage }}</div>
<div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>

    <form @submit.prevent="addCourse" class="add-course-form">
      <div class="form-group">
        <label for="courseName">Course Name:</label>
        <input v-model="newCourse.nom" type="text" id="courseName" required>
      </div>

      <div class="form-group">
        <label for="courseDescription">Course Description:</label>
        <textarea v-model="newCourse.description" id="courseDescription" rows="4" required></textarea>
      </div>

      <button type="submit" class="add-course-button">Add Course</button>
    </form>
  </div>

   <div v-else>
      <p>You need to be authenticated to access the courses add list.</p>
    </div>

</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newCourse: {
        nom: '',
            description: '',
            email : null,
        },
      authenticated : false,
        notauthenticated: false,
        successMessage: '',
        errorMessage: '',
     
    };

    },
    created() {
    // Check if the user is authenticated
    this.authenticated = this.isAuthenticated();

    // If authenticated, fetch the list of users
    if (this.authenticated) {
        this.newCourse.email = localStorage.getItem('email');
    } 
  },
    methods: {
     isAuthenticated() {
      // Check if the user is authenticated (e.g., JWT token is present)
      const token = localStorage.getItem('token');
      return !!token;
    },
        addCourse() {
            this.successMessage = '';
            this.errorMessage = '';
      // Send the new course data to the backend
      axios.post(`/api/courses/add/${localStorage.getItem('email')}`, this.newCourse, { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` , "email" : localStorage.getItem('email') } })
        .then((response) => {
          // Handle success, you might want to redirect or show a success message
            console.log('Course added successfully:', response.data);
            this.successMessage = " course added"
          // Reset the form
          this.newCourse = { nom: '', description: '' };
        })
        .catch((error) => {
            // Handle errors
             if (error.response.status = "403") {
      this.errorMessage = " Vous etes pas un proffesseur"
             } else {
         this.errorMessage = " course not added"
          console.error('Error adding course:', error);
    }
         
        });
    },
  },
};
</script>

<style scoped>
.add-course-container {
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  color: #333;
}

.add-course-form {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 45px;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.add-course-button {
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
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
