export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = authStore();

  const redirect = () => {
    if (to.name !== "auth" && !auth.auth.currentUser) {
      return navigateTo("auth");
    } else if (to.name === "auth" && auth.auth.currentUser) {
      return navigateTo("/");
    }
  };

  auth.auth.onAuthStateChanged((user) => {
    return redirect();
  });

  return redirect();
});
