<template>
    <v-app>
        <v-main>
            <v-container fill-height>
                <v-row align="center" justify="center">
                    <v-col md="6">
                        <Loader />
                        <Errors />
                        <QuoteCard />
                        <RandomBtn />
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import RandomBtn from './components/GenerateRandomBtn';
import QuoteCard from './components/QuoteCard';
import Errors from './components/Errors';
import Loader from './components/Loader';
import './App.css';

export default {
    name: 'App',
    components: {
        RandomBtn,
        QuoteCard,
        Errors,
        Loader
    },
    mounted() {
        this.$store.dispatch('checkServerReady');
    }
};
</script>
