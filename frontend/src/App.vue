<template>
  <div id="app">
    <nav>
      <ul class="navbar">
        <li><router-link to="/">Home</router-link></li>
        <li v-if="!authenticated"><router-link to="/user/login">Login</router-link></li>
        <li v-if="!authenticated"><router-link to="/user/register">Register</router-link></li>
        <li v-if="authenticated && role == 'staff'" ><router-link to="/user/users">Users</router-link></li>
        <li v-if="authenticated && role == 'staff'"><router-link to="/roles">Roles</router-link></li>
        <li v-if="authenticated && role == 'staff'"><router-link to="/rolesCreate">Create Roles</router-link></li>
        <li v-if="authenticated && role == 'teacher' ||role == 'staff' "><router-link to="/createCourses">Create Course</router-link></li>
        <li><router-link to="/Courses">Courses</router-link></li>
        <li v-if="authenticated && role == 'staff'"><router-link to="/groupes">Groupes</router-link></li>
        <li><router-link to="/events">Events</router-link></li>
        <li><router-link to="/classe">Ma classe</router-link></li>
        <li v-if="authenticated"><button @click="logout">Logout</button></li>
      </ul>
    </nav>
    <router-view/>
  </div>
</template>

<script>

export default {
  data() {
    return {
      authenticated: false,
      role:'',
    };
  },
  created() {
    if (localStorage.getItem('token')) {
      this.authenticated = true;
      this.role = localStorage.getItem('role');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      location.reload();
    },
  },
};
</script>

<style>
ul{
  list-style-type: none;
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

.save-button {
  background-color: green;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  margin: 10px;
}

.save-button:hover {
  background-color: lime;
}

.cancel-button {
  background-color: red;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  margin: 10px;
}

.cancel-button:hover {
  background-color: pink;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.navbar {
  display: flex;
  list-style: none;
  padding: 0;
  justify-content: center;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  align-items: center;
}

.navbar li {
  margin: 0 10px;
}

.navbar a {
  font-weight: bold;
  text-decoration: none;
  color: #2c3e50;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.navbar a:hover {
  background-color: #eaeaea;
}

.navbar button {
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.navbar button:hover {
  background-color: #0056b3;
}

.main-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.project-section {
  text-align: center;
  margin-bottom: 40px;
}

.project-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.features-section {
  text-align: center;
  margin-bottom: 40px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 20px;
}

.feature-card {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.about-section {
  text-align: center;
}
.deleteb{
  background-color: red;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}
</style>
