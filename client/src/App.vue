<template>
  <div id="app">
    <div v-show="connected">
      <Greet v-show="doing_greet" @greet="greetFunc" @join="joinFunc" :jointype="jointype" />
      <Poker v-show="!doing_greet" ref="poker" @open="openFunc" @restart="restartFunc" @card="cardFunc" :room="room" :room_url="room_url" :opened="opened">
        <props :member="member"></props>
      </Poker>
    </div>
    <div v-show="!connected">
      <h1>connecting...</h1>
    </div>
  </div>
</template>

<script>
import Greet from './components/Greet.vue'
import Poker from './components/Poker.vue'

// var websocket = new WebSocket('ws://localhost:3000');
var websocket = new WebSocket('wss://cnx3toa5nd.execute-api.us-east-2.amazonaws.com/production/?room=abc');

export default {
  name: 'App',
  components: {Greet, Poker},
  data() {
    return {
      connected: false,
      doing_greet: true,
      jointype: false,
      room_url: '',
      room: '',
      id: '',
      opened: false,
      member: []
    }
  },
  methods: {
    greetFunc(val) {
      // console.log("query="+this.$route.query.room);
      // console.log("val="+val);
      this.room = this.$uuid.v4().substring(0, 8);
      this.id = this.$uuid.v4().substring(0, 8);
      this.room_url = location.origin+"?room="+this.room;
      let send_data = {
        com: 'room',
        room: this.room,
        name: val,
        id: this.id
      };
      websocket.send(JSON.stringify(send_data));
    },
    joinFunc(val) {
      this.id = this.$uuid.v4().substring(0, 8);
      let send_data = {
        com: 'join',
        room: this.room,
        name: val,
        id: this.id
      };
      websocket.send(JSON.stringify(send_data));
    },
    openFunc() {
      let send_data = {
        com: 'open',
        room: this.room,
      };
      websocket.send(JSON.stringify(send_data));
    },
    restartFunc() {
      let send_data = {
        com: 'restart',
        room: this.room,
      };
      websocket.send(JSON.stringify(send_data));
    },
    cardFunc(val) {
      let send_data = {
        com: 'card',
        id: this.id,
        room: this.room,
        card: val
      };
      websocket.send(JSON.stringify(send_data));
    },
  },
  mounted: function() {
    var self = this;

    if (this.$route.query.room) {
      this.room = this.$route.query.room;
      this.jointype = true;
    }

    // websocketをオープンした時
    websocket.onopen = function() {
      // console.log("### websocket.onopen()");
      self.connected = true;
      if (self.$route.query.room) {
        let send_data = {
          com: 'room-check',
          room: self.room,
        };
        websocket.send(JSON.stringify(send_data));
      }
      this.timeobj = setInterval(function() {
        console.log("timeobj!!!!");
        let send_data = {
          com: 'ping',
        };
        websocket.send(JSON.stringify(send_data));
      }, 1000*60*5);
    };

    // websocketでメッセージを受信した時
    websocket.onmessage = function(event) {
      // console.log("### websocket.onmessage()");
      // console.log(event.data);

      // 戻り値チェック
      if (event && event.data && event.data !== "") {
        // 受信したメッセージを表示する
        // console.log("### in check!! "+event.data.length);
        let obj = JSON.parse(event.data);
        let setf = true;
        switch (obj.com) {
          case 'open':
            self.opened = true;
            break;
          case 'restart':
            self.opened = false;
            break;
          case 'room-error':
            // console.log("!!!!!!!!!!!!!!!room-error");
            self.jointype = false;
            setf = false;
            self.$router.push('/')
            break;
          case 'room-success':
            // console.log("!!!!!!!!!!!!!!!room-success");
            self.doing_greet = false;
            setf = false;
            self.room_url = location.origin+"/?room="+obj.room;
            break;
        }
        if (setf) {
          self.$refs.poker.set(obj.member);
        }
      }
    };

    // websocketをクローズした時
    websocket.onclose = function() {
      // console.log("### websocket.onclose()");
      self.doing_greet = true;
      self.connected = false;
      clearInterval(this.timeobj);
    };
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
