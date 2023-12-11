import { defineStore } from 'pinia';

export const useCounterStore = defineStore({
  id: 'counter', // unique identifier for the store
  state: () => ({
    count: 0,
    email: '',
    role: '',
    token:'',
  }),
  actions: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
    login(email,role,token) {
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);
    },
    getRole() {
      return localStorage.getItem('role');
    },
    getToken() {
      return localStorage.getItem('token');
    },
    getEmail() {
      return localStorage.getItem('email');
    },
  },
});
