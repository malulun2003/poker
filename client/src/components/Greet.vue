<template>
  <div class="greet">
    <h1>poker</h1>
    <div class="myname">
      <b-form-input v-model="yname" placeholder="Enter your name"></b-form-input>
    </div>
    <b-button v-show="!jointype" v-on:click="greet" variant="outline-primary">create-room</b-button>
    <b-button v-show="jointype" v-on:click="join" variant="outline-primary">join-room</b-button>
  </div>
</template>

<script>
export default {
  // name: 'HelloWorld',
  props: ['jointype'],
  data() {
    return {
      inyname: '',
      inroom: ''
    }
  },
  computed: {
    yname: {
      get () {
        console.log("query>"+this.$route.query.room);
        // this.$route.query.room
        return this.inyname;
      },
      set (value) {
        this.inyname = value;
      }
    },
    room: {
      get () {
        // console.log("AAA");
        return this.inroom;
      },
      set (value) {
        this.inroom = value;
      }
    }
  },
  methods: {
    greet: function () {
      this.$emit('greet', this.inyname);
    },
    join: function () {
      this.$emit('join', this.inyname);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.myname {
  margin: 4px;
}
.greet {
  margin: 4px;
  display: flex;
  flex-flow: column;
  align-items: center;
}
</style>
