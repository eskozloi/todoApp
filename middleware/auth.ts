export default defineNuxtRouteMiddleware((to, from) => {
  /*console.log("here");
  console.log(userStore().getUser());*/
  if (to.name !== "auth" && !userStore().getUser()) {
    return navigateTo("auth");
  }
});
