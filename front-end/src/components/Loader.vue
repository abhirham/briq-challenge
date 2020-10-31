<template>
    <v-overlay v-show="showLoader">
        <v-progress-circular
        indeterminate
        color="primary"
        ></v-progress-circular>
    </v-overlay>
</template>
<script>
export default {
    name: 'Loader',
    computed: {
        showLoader() {
            return this.$store.state.loaderModule.isLoading.length > 0;
        }
    }
};
</script>