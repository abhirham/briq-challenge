<template>
    <v-btn
      rounded
      color="primary"
      dark
      @click="generateRandomQuote"
    >
      Generate Random
    </v-btn>
</template>

<script>
export default {
    name: 'GenerateRandomBtn',
    methods: {
        generateRandomQuote() {
            this.$store.dispatch('generateRandomQuote');
        }
    }
};
</script>