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
        const searchMovies = ref([])

        const getNewestMovies = async () => {
            const query = 'get/top50/?per_page=5&page=1'; // Example query for getting top 50 movies
            const response = await DBProvider.fetch(query);
            console.log(response)
            if (response && response.items) {
                movies.value = response.items;
            }
        };
        const handleSearchData = (searchData) => {
            // Update movies with search results in the main component
            console.log('Received search data:', searchData);
            searchMovies.value = searchData;
            if (!searchData ||  searchData.total == 0) {
                searchMovies.value = null
            }
            // Handle the search data here
        };
        const inc = () => {

        }
        // Listen for the emitted event from vcnavbar
        const navbarSearchHandler = (searchData) => {
            handleSearchData(searchData);
        };
        getNewestMovies();

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

        return { count, movies, moveNext, movePrev, currentMovieIndex, navbarSearchHandler,searchMovies };
    },
    template: `
    <div class="header p-2">
      <vcheader></vcheader>
    </div>
    <div class="vcnavbar">
      <vcnavbar @search-data="navbarSearchHandler"></vcnavbar>
    </div>
    <div class="main-body">
      <div v-if="!searchMovies" class="slider d-flex flex-row align-items-center justify-content-center">
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
      <div v-if="searchMovies" class="searchList row p-5">
            <div v-for="movie in searchMovies.items" :key="movie.id" class="col-md-4 mb-4 ">
                <div class="card text-center align-items-center">
                    <img :src="movie.image" class="card-img-top" style="width: 100%;max-height:500px" :alt="movie.title">
                    <div class="card-body">
                        <h5 class="card-title">{{ movie.title }}</h5>
                        <!-- Add more details here if needed -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer"></div>
  `,
};
