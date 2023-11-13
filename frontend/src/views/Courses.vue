<!-- CourseComponent.vue -->

<template>
  <div class="course-container" v-if="authenticated">
    <h2>Courses</h2>
    <div v-for="course in courses" :key="course.id" class="course-card">
      <h3>{{ course.nom }}</h3>
      <p>{{ course.description }}</p>
      <div class="comment-section">
        <input v-model="course.commentInput" type="text" placeholder="Add a comment" class="comment-input" />
        <button @click="addComment(course.id)" class="add-comment-button">Add Comment</button>
      </div>
      <ul class="comment-list">
        <button @click="Affichecomments(course.id)" class="add-comment-button">Afficher les commentaires</button>
        <li v-for="comment in course.comments" :key="comment.id" class="comment-item">
          {{ comment.description }}
        </li>
      </ul>
    </div>
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
      courses: [],
      authenticated: false,
      notauthenticated: false,
      email: '',
    };
  },
  created() {
    // Check if the user is authenticated
    this.authenticated = this.isAuthenticated();

    // If authenticated, fetch the list of users
    if (this.authenticated) {
      this.fetchCourses();
      this.email = localStorage.getItem('email');
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
    async addComment(courseId) {
      try {
        const response = await axios.post(`/api/courses/comments`, {
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
