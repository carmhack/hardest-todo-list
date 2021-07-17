<template>
  <div id="nav">
    <router-link to="/">
      <span class="mdi mdi-format-list-bulleted"></span>
      Tasks
    </router-link>
    <router-link to="/categories">
      <span class="mdi mdi-buffer"></span>
      Categorie
    </router-link>
  </div>
  <router-view/>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

#app {
  width: 100%;
  height: calc(100vh - 100px);
  background-color: $background-clr;
  font-family: Roboto;
}

#nav {
  background-color: $white;
  position: absolute;
  bottom: 0;
  right: 0;
  height: 100px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  span.mdi {
    font-size: 36px;
  }
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    color: $primary-clr;
    font-size: 18px;
    text-decoration: none;

    &.router-link-exact-active {
      color: $accent-clr;
    }
  }
}
</style>
