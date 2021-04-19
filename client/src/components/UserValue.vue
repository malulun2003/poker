<template>
  <div class="user-value rounded border text-white" :class="get_color()">
    <div v-if="card == 0" class="panel-row">
      <div class="name-panel">{{you}}</div>
      <div class="check-box" />
    </div>
    <div v-else class="panel-row">
      <div class="name-panel">{{you}}</div>
      <div class="check-box" v-if="opened == true">
        {{card}}
      </div>
      <div class="check-box" v-else>
        <div class="check" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['you', 'card', 'opened', 'id'],

  data() {
    return {
      inyou: '',
    }
  },
  methods: {
    get_color: function() {
      let cols = ['bg-success', 'bg-primary', 'bg-danger', 'bg-info', 'bg-secondary', 'bg-dark']
      let col = cols[this.id % cols.length];
      return col;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.check-box {
  width: 40px;
}
.check {
  content: '';
  width: 20px;
  height: 10px;
  border-left: 5px solid #ffffff;
  border-bottom: 5px solid #ffffff;
  transform: rotate(-45deg);
  margin: 2px;
}
.user-value {
  width: 260px;
  height: 30px;
  padding: 4px;
}
.name-panel {
  width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.panel-row {
  display: flex;
}
</style>
