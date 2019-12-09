<template>
  <div id="app">
    <!--<topHeader v-show="!this.$route.path.includes('login')"></topHeader>
    <div class="content"><router-view ></router-view></div>-->
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  watch:{

    },
  components:{

  },
  methods: {
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      })
    }
  },

};

</script>

<style>
  @import "./assets/css/main.css";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

</style>
