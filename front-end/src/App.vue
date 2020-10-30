<template>
    <v-app>
        <v-main>
            <v-container >
                <QuoteCard />
                <RandomBtn />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import RandomBtn from './components/GenerateRandomBtn';
import QuoteCard from './components/QuoteCard';

export default {
    name: 'App',
    components: {
        RandomBtn,
        QuoteCard
    },
    mounted() {
        this.$store.dispatch('fetchAllQuotes');
    }
};
</script>
