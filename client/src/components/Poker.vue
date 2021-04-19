<template>
  <div class="greet">
    <h1>poker</h1>
    <p>invite to > <a :href="room_url" target="_blank">{{room_url}}</a></p>
    <p>
      <b-button class="point" v-on:click="openFunc" variant="outline-primary">open</b-button>
      <b-button class="point" v-on:click="restartFunc" variant="outline-primary">restart</b-button>
    </p>
    <p>
      <b-button class="point" v-on:click="cardFunc(1)" variant="outline-primary">1</b-button>
      <b-button class="point" v-on:click="cardFunc(3)" variant="outline-primary">3</b-button>
      <b-button class="point" v-on:click="cardFunc(5)" variant="outline-primary">5</b-button>
      <b-button class="point" v-on:click="cardFunc(8)" variant="outline-primary">8</b-button>
      <b-button class="point" v-on:click="cardFunc(13)" variant="outline-primary">13</b-button>
      <b-button class="point" v-on:click="cardFunc(21)" variant="outline-primary">21</b-button>
      <b-button class="point" v-on:click="cardFunc(34)" variant="outline-primary">34</b-button>
      <b-button class="point" v-on:click="cardFunc(55)" variant="outline-primary">55</b-button>
    </p>
    <div class="users">
      <div class="user" v-for="(v, index) in member" :key="v.name">
        <UserValue  :you="v.name" :card="v.card" :opened="opened" :id="index" />
      </div>
    </div>
    <div v-if="opened == true">average={{average}}</div>
  </div>
</template>

<script>
import UserValue from './UserValue.vue'

export default {
  name: 'Poker',
  components: {UserValue},
  props: ['room', 'room_url', 'opened'],
  data() {
    return {
      inyname: '',
      inmember: []
    }
  },
  computed: {
    average: {
      get() {
        let sum = 0;
        let count = 0;
        if (this.member.length > 0) {
          this.member.forEach(element => {
            if (element.card > 0) {
              sum += element.card;
              count++;
            }
          });
          if (count > 0) {
            sum /= count;
          }
        } else {
          sum = 0;
        }
        return Math.round(sum*10)/10;
      }
    },
    yname: {
      get () {
        return this.inyname;
      },
      set (value) {
        this.inyname = value;
      }
    },
    member: {
      get() {
        console.log("get member");
        console.log(this.inmember);
        return this.inmember;
      },
      set(val) {
        console.log("set member");
        console.log(val);
        this.inmember = val;
      }
    }
  },
  methods: {
    openFunc() {
      this.$emit('open');
    },
    restartFunc() {
      this.$emit('restart');
    },
    cardFunc(val) {
      this.$emit('card', val);
    },
    set(val) {
      console.log("set func");
      console.log(val);
      this.member = val;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.users {
  display: flex;
  flex-flow: column;
  justify-content: center;
}
.user {
  margin: 4px;
  display: flex;
  justify-content: center;
}
.point {
  margin: 2px;;
}
</style>