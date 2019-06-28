<template>
  <div class="wrap staffMain">
    <staff-information v-if='!isShowDetails'></staff-information>
    <staff-details v-else></staff-details>
  </div>
</template>
<script>
import staffInformation from "./information/staffInformation.vue";
import staffDetails from "./details/staffDetails.vue";
export default {
  name: "staffMain",
  inject: ["reload"],
  data() {
    return {
      isShow:true,
      curInfo:{}
    };
  },
  mounted() {
  },
  methods: {},
  computed: {
    isShowDetails(){
      return this.$store.state.staffModule.isShowDetails;
    }
  },
  components: {
    staffInformation,
    staffDetails
  }
};
</script>
<style scoped lang="scss">
</style>






