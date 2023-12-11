<template>
  <div class="register-form">
    <h2>Register</h2>
    <!-- Display a success or error message -->
    <div v-if="registrationMessage" :class="['message', registrationSuccess ? 'success' : 'error']">
      {{ registrationMessage }}
    </div>
    <!-- Display validation errors -->
    <div v-if="validationErrors" class="error">
      <div v-for="(error, index) in validationErrors" :key="index">
       - {{ error.msg }}
      </div>
    </div>

    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label for="nom">Nom:</label>
        <input type="text" id="nom" v-model="user.nom">
      </div>

      <div class="form-group">
        <label for="prenom">Prénom:</label>
        <input type="text" id="prenom" v-model="user.prenom" required>
      </div>

      <div class="form-group">
        <label for="Role">Role:</label>
        <div>
    <select id="selectRole" v-model="user.selectedRole">
      <option v-for="(option, index) in Roles" :key="index" :value="option.nom">
        {{ option.nom }}
      </option>
    </select>

    <p>Selected Role: {{ user.selectedRole }}</p>
  </div>
      </div>

      <div v-if="user.selectedRole=='student'" class="form-group">
        <label for="Role">Groupe:</label>
        <div>
    <select id="groupe" v-model="user.groupe">
      <option v-for="(option, index) in groupes" :key="index" :value="option.name">
        {{ option.name }}
      </option>
    </select>

    <p>Selected Role: {{ user.groupe }}</p>
  </div>
      </div>

      <div class="form-group">
        <label for="naissance">Date de Naissance:</label>
        <input type="date" id="naissance" v-model="user.naissance" required>
      </div>

      <div class="form-group">
        <label for="photo">Photo:</label>
       <input type="file" id="photo" ref="photoInput" accept="image/*"  @change="handleFileUpload">
      </div>

      <div class="form-group">
  <label>Image Preview:</label>
  <img :src="user.photo" style="    max-width: 100%;
    max-height: 200px;" alt="Uploaded Image" class="image-preview" v-if="user.photo">
</div>

      <div class="form-group">
        <label for="telephone">Téléphone:</label>
        <input type="tel" id="telephone" v-model="user.telephone" required>
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="user.email" required>
      </div>

      <div class="form-group">
        <label for="mot_de_passe">Mot de Passe:</label>
        <input type="password" id="mot_de_passe" v-model="user.mot_de_passe" required>
      </div>

      <button type="submit" class="register-button">Register</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        nom: '',
        prenom: '',
        groupe:'',
        naissance: '',
        photo: null,
        telephone: '',
        email: '',
        mot_de_passe: '',
        selectedRole : '',
      },
      registrationSuccess: false,
      registrationMessage: '',
      validationErrors: false,
      Roles: null,
    };
  },
  mounted() {
      axios.get('/api/role/roles')
        .then((response) => {
          this.Roles = response.data;
        })
        .catch((error) => {
          console.error('Failed to retrieve users:', error);
        });
        axios.get('/api/user/groupes')
        .then((response) => {
          this.groupes = response.data;
        })
        .catch((error) => {
          console.error('Failed to retrieve users:', error);
        });
  },
  methods: {
    handleFileUpload(event) {
    const fileInput = this.$refs.photoInput;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.user.photo = reader.result; // Set the base64 representation of the image
      };

      reader.readAsDataURL(file);
    }
  },
  registerUser() {
    // Reset registration message and success flag
    this.registrationMessage = '';
      this.registrationSuccess = false;
      this.validationErrors = false;

    // Send user registration data to the backend
    axios
      .post('/api/user/register', this.user)
      .then((response) => {
      if (response.data.success) {
        // Registration success
        this.registrationMessage = 'Registration successful!';
        this.registrationSuccess = true;
      } else {
        // Registration error
        this.validationErrors = response.data.errors;
        this.registrationMessage = response.data.error;
        this.registrationSuccess = false;
      }
  })
  .catch((error) => {
    // Handle network or other errors
    this.registrationMessage = 'Network error. Please try again.';
    this.registrationSuccess = false;
  });
  },
},

};
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 60px;
  border: 1px solid #e1e1e1;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.register-form h2 {
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

.register-button {
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

.message {
  padding: 10px;
  margin: 10px 0;
  text-align: center;
  border-radius: 5px;
}

.success {
  background-color: #2ecc71;
  color: #fff;
}

.error {
  background-color: #e74c3c;
  color: #fff;
}
</style>
