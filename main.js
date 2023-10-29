import { ref } from 'vue';
import vcheader from './header.js';
import vcnavbar from './navbar.js';
import { DBProvider } from './dbutils.js';

export default {
    components: {
        vcheader,
        vcnavbar,
    },
    setup() {
        const count = ref(0);
        const movies = ref([]);
        const currentMovieIndex = ref(0);
        const searchMovies = ref([]);
        const pageNum = ref(1);
        const searchResults = ref(null);
        const searchString = ref('');
        const getNewestMovies = async () => {
            const query = 'get/top50/?per_page=5&page=1'; // Example query for getting top 50 movies
            const response = await DBProvider.fetch(query);
            console.log(response)
            if (response && response.items) {
                movies.value = response.items;
            }
        };

        getNewestMovies();
        const inc = () => {

        }
        const searchData = async (searchQuery) => {
            try {
                const query = searchQuery ? searchQuery : '';
                const newSearchResults = await DBProvider.fetch(`search/movie/${query}?per_page=12&page=${pageNum.value}`);

                if (newSearchResults && newSearchResults.items) {
                    searchResults.value = newSearchResults;
                    searchMovies.value = newSearchResults.items;
                } else {
                    searchMovies.value = [];
                }
            } catch (error) {
                console.error('Error occurred during search:', error);
            }
        };

        const nextPage = async () => {
            console.log(searchResults);
            if (searchResults.value.page < searchResults.value.total_page) {

                pageNum.value++;
                await searchData(searchString.value);
            }
        };

        const prevPage = async () => {
            if (pageNum.value > 1) {
                pageNum.value--;
                await searchData(searchString.value);
            }
        };

        const receiveEmit =  (searchQuery) => {
            searchString.value = searchQuery;
             searchData(searchQuery);
        }
        const moveNext = () => {
            if (currentMovieIndex.value < movies.value.length - 1) {
                currentMovieIndex.value++;
            }
        };

        const movePrev = () => {
            if (currentMovieIndex.value > 0) {
                currentMovieIndex.value--;
            }
        };

        return { count, movies, moveNext, movePrev, currentMovieIndex,searchMovies, receiveEmit,pageNum, nextPage, prevPage,searchResults };
    },
    template: `
    <div class="header p-2">
      <vcheader></vcheader>
    </div>
    <div class="vcnavbar">
      <vcnavbar @toggle-search="receiveEmit"></vcnavbar>
    </div>
    <div class="main-body">
      <div v-if="searchMovies.length == 0" class="slider d-flex flex-row align-items-center justify-content-center">
        <button @click="movePrev" style="height: 50px;"> << </button>
        <div v-for="(movie, index) in movies" :key="movie.id" :style="{ 
                 transform: 'translateX(' + ((index - currentMovieIndex) * 100) + '%)', 
                 opacity: index === currentMovieIndex ? 1 : 0, 
                 transition: 'transform 0.6s, opacity 1s'
               }">
        
          <div v-if="index === currentMovieIndex" class="d-flex flex-column align-items-center justify-content-center movie-slide">
            <div class="text-center" style="width: 800px">
              <img style="width: 600px;height: 700px" :src="movie.image" :alt="movie.title" />
              <h3>{{ movie.title }}</h3>
              <p>{{ movie.plot }}</p>
            </div>
          </div>
        </div>

        <button @click="moveNext" style="height: 50px;"> >> </button>
      </div>
      <div v-if="searchMovies.length > 0" class="searchList row p-5">
            <div v-for="movie in searchMovies" :key="movie.id" class="col-md-4 mb-4 ">
                <div class="card text-center align-items-center">
                    <img :src="movie.image" class="card-img-top" style="width: 100%;max-height:500px" :alt="movie.title">
                    <div class="card-body">
                        <h5 class="card-title">{{ movie.title }}</h5>
                        <!-- Add more details here if needed -->
                    </div>
                </div>
            </div>
<!--            add pagination here please-->
<!-- Pagination -->
      <div class="pagination d-flex flex-row justify-content-between">
        <button @click="prevPage" :disabled="pageNum === 1">Previous</button>
        <span>Page {{ searchResults.page }} of {{ searchResults.total_page }}</span>
        <button @click="nextPage" :disabled="pageNum === searchResults.total_pages">Next</button>
      </div>
    </div>
        </div>
    </div>
    <div class="footer"></div>
  `,
};
