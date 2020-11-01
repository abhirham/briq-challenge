<template>
    <v-btn
      color="primary"
      dark
      @click="generateRandomQuote"
      class="mt-5"
    >
      Generate Random
    </v-btn>
</template>

<script>
export default {
    name: 'GenerateRandomBtn',
    methods: {
        generateRandomQuote() {
            this.$store.dispatch('quoteModule/generateRandomQuote');
        }
    }
};
</script>