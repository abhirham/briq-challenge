<template>
    <v-card
    elevation="2"
    outlined
    v-show="quote._id !== undefined"
    >
        <v-card-title class="breakEntireWord">
            <v-icon>mdi-format-quote-open</v-icon>
            {{quote.en}}
            <v-icon>mdi-format-quote-close</v-icon>
        </v-card-title>
        <v-card-text>
            <v-row class="px-5 font-italic">
                <span>By {{quote.author}}</span>
                <v-spacer></v-spacer>
                <v-rating
                :key="quote.id"
                :value="quote.personalRating"
                @input="addRating"
                hover
                medium
                background-color="orange lighten-3"
                color="orange"
                ></v-rating>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script>
export default {
    name: 'QuoteCard',
    computed: {
        quote() {
            return this.$store.state.quoteModule.quoteToShow;
        }
    },
    methods: {
        addRating(val){
            this.$store.dispatch('quoteModule/upVoteQuote', {quoteId: this.quote.id, newVote: val}).then(() => {
                if(val < 4) {
                    this.$store.dispatch('quoteModule/fetchDifferentQuote', this.quote);
                    return;
                }
                this.$store.dispatch('quoteModule/fetchSimilarQuote', this.quote);
            });
        }
    }
};
</script>