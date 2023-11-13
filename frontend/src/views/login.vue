<template>
  <div class="login-form">
    <h2>Login</h2>
     <!-- Display a success or error message -->
    <div v-if="loginMessage" :class="['message', loginSuccess ? 'success' : 'error']">
      {{ loginMessage }}
    </div>
    <div v-if="!loginMessage" :class="['message', loginSuccess ? 'success' : 'error']">
      {{ loginMessage }}
    </div>
    <form @submit.prevent="loginUser">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="credentials.email" required>
      </div>

      <div class="form-group">
        <label for="mot_de_passe">Mot de Passe:</label>
        <input type="password" id="mot_de_passe" v-model="credentials.mot_de_passe" required>
      </div>

      <button type="submit" class="login-button">Login</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      credentials: {
        email: '',
        mot_de_passe: '',
      },
      loginMessage: null,
      loginSuccess: null,
    };
  },
  methods: {
    loginUser() {
      this.loginMessage = null;
       axios
        .post('/api/user/login', this.credentials)
         .then((response) => {
           console.log(response);
          if (response.data.token) {
            // Save the token to the session
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', response.data.email);
            // You can also set the token in Axios headers for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            axios.defaults.headers.common['email'] = `${response.data.email}`;
             this.loginMessage = 'Login successful!';
            this.loginSuccess = true;
            this.$router.push({ name: 'users' });

            location.reload();
            // Redirect to a protected route or perform other actions
          } else {
            // Handle login error
            this.loginMessage = 'mot de passe ou email errone';
            this.loginSuccess = false;
            console.error('Login failed:', response.data.message);
          }
        })
        .catch((error) => {
          // Handle network or other errors
          this.loginMessage = "mot de passe ou email errone";
          console.error('Login error:', error);
        });
    },
  },
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 60px;
  border: 1px solid #e1e1e1;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-form h2 {
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

.login-button {
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #0056b3;
}
</style>
