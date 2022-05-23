import { defineStore } from "pinia";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

const auth = getAuth(firebaseApp);

export interface userCredentials {
  email: string;
  password: string;
}

/*export interface userState {
  currentUser: User | undefined;
}*/

export interface userState {
  user: User | undefined;
  //allUsers: User[] | undefined[];
}

const state = (): userState => ({
  user: undefined,
  //allUsers: [],
});

const getters = {
  getUser: (state: userState) => () => {
    return state.user;
  },
  /*getAllUsers: (state: userState) => () => {
    return state.allUsers;
  },
  getUserByEmail: (state: userState) => (email: string) => {
    return state.allUsers.find((user) => user.email === email);
  },*/
  checkIfUserExists: (state: userState) => async (email: string) => {
    return fetchSignInMethodsForEmail(auth, email).then((methods) => {
      if (methods.length > 0) return true;
      return false;
    });
  },
};

const actions = {
  async register(userCred: userCredentials) {
    try {
      const userCr = await createUserWithEmailAndPassword(auth, userCred.email, userCred.password);
      this.user = userCr.user;
    } catch (error) {
      console.log(error);
    }
  },
  async login(userCred: userCredentials) {
    try {
      const userCr = await signInWithEmailAndPassword(auth, userCred.email, userCred.password);
      this.user = userCr.user;
    } catch (error) {
      console.log(error);
    }
  },
  async logout() {
    this.user = undefined;
  },
  /*async getAllUsers() {
    listUse
  },*/
};

export const userStore = defineStore("authStore", {
  state,
  getters,
  actions,
});
