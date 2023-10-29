import { ref, onMounted } from 'vue'; // Import onMounted from vue
import { DBProvider } from './dbutils.js';

export default {

    setup(_, { emit }) {
        const count = ref(0);
        const searchQuery = ref(null); // Initialize searchQuery with null

        const searchData = async () => {
            try {
                if (searchQuery.value !== null) {
                    const query = searchQuery.value ? searchQuery.value : ''; // Set the query to empty string if null
                    const searchResults = await DBProvider.fetch(`search/movie/${query}?per_page=12&page=2`);
                    emit('search-data', searchResults); // Emit the search results
                }
            } catch (error) {
                console.error('Error occurred during search:', error);
            }
        };

        const returnToTableList = () => {
            // Implement the returnToTableList functionality if needed
        };

        onMounted(() => {
            // You can also emit an event when the component is mounted
            emit('search-data', null); // Replace null with initial data if needed
        });

        return {
            count,
            searchQuery,
            searchData,
            returnToTableList
        };
    },

    template: `
    <div class="p-3 d-flex flex-row navigation-bar navbar navbar-light bg-light">
        <a href="#" class="home-btn navbar-brand" @click="returnToTableList">Home</a>
        <div class="search-section d-flex flex-row justify-content-between" style="width: 300px">
            <input type="text" class="search-input form-control" style="font-size: 20px;width: 210px" v-model="searchQuery" @input="searchData">
            <button class="search-btn btn btn-outline-success" style="font-size: 16px;" @click="searchData">Search</button>
        </div>
    </div>
    `,
};
