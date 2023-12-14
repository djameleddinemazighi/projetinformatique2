<!-- CourseComponent.vue -->

<template>
  <div v-if="authenticated && role === 'staff'" style="display: flex;flex-direction: column;justify-content: center;">
    <h2>Courses List</h2>
    <div v-if="notauthenticated">
      Please log in to view the list.
    </div>
    <div v-else style="    align-self: center;">
      <!-- Existing messages for success and error -->
      <div class="success-message" v-if="successMessage">{{ successMessage }}</div>
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>

      <ul class="courses-list">
        <li v-for="course in courses" :key="course.id">
          <span>Name: {{ course.nom }} </span> <br>
          <span>Description: {{ course.description }}</span> <br>
          <button :id="course.id" @click="deleteCourse($event)" class="deleteb">Delete</button>
          <button @click="editCourse(course.id)" class="edit-button">Edit</button>

              <div v-if="editCourseId === course.id">
            <h3>Edit Course</h3>
            <form @submit.prevent="saveEdit(course)">
              <div class="form-course">
                <label for="editedCourseName">Name:</label>
                <input type="text" id="editedCourseName" class="comment-input" v-model="course.updatedName" required>
              </div>
              <div class="form-course">
                <label for="editedCourseDescription">Description:</label>
                <textarea id="editedCourseDescription" class="comment-input" v-model="course.updatedDescription" required></textarea>
              </div>
              <button type="button" class="cancel-button" @click="cancelEdit(course)">Cancel</button>
              <button type="submit" class="add-role-button save-button">Save</button>
            </form>
          </div>

            <div class="comment-section" style="max-width: 800px; align-self: center;">
        <input v-model="course.commentInput" type="text" placeholder="Add a comment" class="comment-input" />
        <button @click="addComment(course.id)" class="add-comment-button">Add Comment</button>
      </div>
      <ul class="comment-list">
        <button @click="Affichecomments(course.id)" class="add-comment-button">Afficher les commentaires</button>
        <li v-for="comment in course.comments" :key="comment.id" class="comment-item">
          {{ comment.description }}
        </li>
      </ul>

          <!-- Edit form -->
      
        </li>
      </ul>
    </div>
  </div>
</template>

  <div v-else>
    <p>You need to be authenticated to access the courses add list.</p>
  </div>
</template>

<script>
import axios from 'axios';
import { useCounterStore } from '@/store';
const store = useCounterStore();

export default {
  data() {
    return {
      successMessage:'',
      errorMessage:'',
      role:'',
      editCourseId:'',
      courses: [],
      authenticated: false,
      notauthenticated: false,
      email: '',
    };
  },
  created() {
    // Check if the user is authenticated
    this.authenticated = this.isAuthenticated();
    this.role = store.getRole();
    // If authenticated, fetch the list of users
    if (this.authenticated) {
      this.fetchCourses();
      this.email = store.getEmail();
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
    async Affichecomments(id) {
      try {
        const response = await axios.get(`/api/courses/comments/${id}`);
        const index = this.courses.findIndex((course) => course.id === id);

        if (index !== -1) {
          this.$set(this.courses, index, { ...this.courses[index], comments: response.data });
          console.log('Comments updated:', this.courses[index].comments);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    async fetchCourses() {
      try {
        const response = await axios.get('/api/courses/get');
        this.courses = response.data.map(course => ({ ...course, comments: [], commentInput: '' }));
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    },
    deleteCourse(e) {
      axios.delete(`/api/courses/delete/${e.target.id}`, {
        headers: { Authorization: `Bearer ${store.getToken()}`, email: store.getEmail() },
      })
        .then((response) => {
          if (response.data.success) {
            this.successMessage = 'Course deleted successfully!';
            this.errorMessage = '';
            this.fetchCourses();
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
    async addComment(courseId) {
      try {
        const response = await axios.post(`/api/courses/comments`,  {
          description: this.courses.find(course => course.id === courseId).commentInput,
          id: courseId,
          email: this.email,
        });

        // Update the comments for the specific course after adding a new comment
        await this.Affichecomments(courseId);

        // Clear the comment input for the specific course
        const courseIndex = this.courses.findIndex(course => course.id === courseId);
        this.$set(this.courses, courseIndex, { ...this.courses[courseIndex], commentInput: '' });
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    },

    editCourse(courseId) {
  const course = this.courses.find((c) => c.id === courseId);
  if (course) {
    this.editCourseId = courseId;
    course.updatedName = course.nom;
    course.updatedDescription = course.description;
  }
},

cancelEdit(course) {
  const originalCourse = this.courses.find((c) => c.id === course.id);
  if (originalCourse) {
    this.editCourseId = null;
    course.updatedName = originalCourse.nom;
    course.updatedDescription = originalCourse.description;
  }
},

saveEdit(course) {
  const updatedCourse = {
    nom: course.updatedName,
    description: course.updatedDescription,
  };

  axios.put(`/api/courses/update/${course.id}`, updatedCourse, {
    headers: {
      Authorization: `Bearer ${store.getToken()}`,
      email: store.getEmail(),
    },
  })
    .then((response) => {
      this.successMessage = 'Course updated successfully!';
      this.errorMessage = '';
      this.fetchCourses();
      this.editCourseId = null;
    })
    .catch((error) => {
      this.successMessage = '';
      this.errorMessage = error.response.data.error;
    });
},
  },
};
</script>

<style scoped>
.course-container {
  max-width: 800px;
  margin: 0 auto;
}

.course-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
}

h2 {
  text-align: center;
  color: #333;
}

.comment-section {
  margin-top: 15px;
  display: flex;
  align-items: center;
      display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.form-course{
      display: flex;
    margin: 10px;
}

.comment-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.add-comment-button {
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  margin-left: 10px;
  cursor: pointer;
}

.comment-list {
  list-style: none;
  padding: 0;
  margin-top: 15px;
  margin: 20px;
}

.comment-item {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 8px;
  margin-bottom: 8px;
  margin: 15px;
}

.course-container {
  max-width: 800px;
  margin: 0 auto;
}

.course-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
}

h2 {
  text-align: center;
  color: #333;
}

.comment-section {
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.comment-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.add-comment-button {
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  margin-left: 10px;
  cursor: pointer;
}

.comment-list {
  list-style: none;
  padding: 0;
  margin-top: 15px;
}

.comment-item {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 8px;
  margin-bottom: 8px;
}
</style>
