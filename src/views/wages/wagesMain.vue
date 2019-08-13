<template>
  <div class="wrap wagesMain">
    <wages-staff-list></wages-staff-list>
  </div>
</template>
<script>
import wagesStaffList from './wagesStaffList.vue';
export default {
  name: "wagesMain",
  inject: ["reload"],
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {},
  computed: {
    wagesKey(){
      return this.$store.state.wagesModule.wagesKey;
    }
  },
  components: {
    wagesStaffList
  }
};
</script>
<style scoped lang="scss">
</style>






