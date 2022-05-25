import { defineStore } from "pinia";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
  fetchSignInMethodsForEmail,
  signOut,
} from "firebase/auth";

const auth = getAuth(firebaseApp);

export interface userCredentials {
  email: string;
  password: string;
}

export interface authState {
  auth: Auth | null;
}

const state = (): authState => ({
  auth: auth,
});

const getters = {
  checkIfUserExists: (state: authState) => async (email: string) => {
    return fetchSignInMethodsForEmail(auth, email).then((methods) => {
      if (methods.length > 0) return true;
      return false;
    });
  },
};

const actions = {
  async register(userCred: userCredentials) {
    try {
      await createUserWithEmailAndPassword(auth, userCred.email, userCred.password);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  },
  async login(userCred: userCredentials) {
    try {
      await signInWithEmailAndPassword(auth, userCred.email, userCred.password);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  },
  async logout() {
    await signOut(auth);
  },
  /*async getAllUsers() {
    listUse
  },*/
};

export const authStore = defineStore("authStore", {
  state,
  getters,
  actions,
});
