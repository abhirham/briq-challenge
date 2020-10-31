<template>
    <v-alert
        v-model="showError"
      type="error"
      dense
      dismissible
      class="breakEntireWord"
    >
      {{error}}
    </v-alert>
</template>
<script>
export default {
    name: 'Errors',
    computed: {
        error() {
            return this.$store.state.errorsModule.error;
        },
        showError: {
            get() { return this.error.length > 0 },
            set(val) {
                if(val === false)
                    this.$store.commit('errorsModule/setError', '');
            }
        }
    }
};
</script>