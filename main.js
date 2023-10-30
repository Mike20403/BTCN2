import { ref, toRaw} from 'vue';
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
        const currentMovieGroupIndex = ref(0);
        const currentMovieGroupIndex2 = ref(0);
        const searchMovies = ref([]);
        const pageNum = ref(1);
        const searchResults = ref(null);
        const searchString = ref('');
        const top15Movies = ref([]);
        const topratingMovies = ref([]);
        const result = ref([]);
        const result2 = ref([]);
        // ... your existing setup ...
        const selectedMovie = ref(null);

        const showMovieDetails = (movie) => {
            console.log(movie)
            selectedMovie.value = movie;
        };

        const getNewestMovies = async () => {
            const query = 'get/top50/?per_page=5&page=1'; // Example query for getting top 50 movies
            const response = await DBProvider.fetch(query);
            console.log(response)
            if (response && response.items) {
                movies.value = response.items;
            }
        };
        const getTop15Movies = async () => {
            const query = 'get/mostpopular/?per_page=15&page=1'; // Example query for getting most popular movies
            const response = await DBProvider.fetch(query);

            if (response && response.items) {
                top15Movies.value = response.items;
                const itemsPerGroup = 3;

                for (let i = 0; i < top15Movies.value.length; i += itemsPerGroup) {
                    result.value.push(toRaw(toRaw(top15Movies.value).slice(i, i + itemsPerGroup)));
                    console.log(result)
                }
            }


        };
        const getTopRatingMovies = async () => {
            const query = 'get/toprated/?per_page=15&page=1'; // Example query for getting most popular movies
            const response = await DBProvider.fetch(query);
            console.log(response)
            if (response && response.items) {
                topratingMovies.value = response.items;
                const itemsPerGroup = 3;

                for (let i = 0; i < topratingMovies.value.length; i += itemsPerGroup) {
                    result2.value.push(toRaw(toRaw(topratingMovies.value).slice(i, i + itemsPerGroup)));
                }
                console.log(result2.value)
            }
        };


        getNewestMovies();
        getTopRatingMovies();
        getTop15Movies();
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
        const moveNextGr = () => {
            if (currentMovieGroupIndex.value < result.value.length - 1) {
                currentMovieGroupIndex.value++;
            }
        };

        const movePrevGr = () => {
            if (currentMovieGroupIndex.value > 0) {
                currentMovieGroupIndex.value--;
            }
        };
        const moveNextGr2 = () => {
            if (currentMovieGroupIndex2.value < result2.value.length - 1) {
                currentMovieGroupIndex2.value++;
            }
        };

        const movePrevGr2 = () => {
            if (currentMovieGroupIndex2.value > 0) {
                currentMovieGroupIndex2.value--;
            }
        };

        return { count, movies, moveNext,
            movePrev,moveNextGr,
            movePrevGr,moveNextGr2,movePrevGr2,
            currentMovieIndex,
            currentMovieGroupIndex,currentMovieGroupIndex2,
            searchMovies,
            receiveEmit,pageNum, nextPage, prevPage,
            searchResults
            ,top15Movies, topratingMovies,result,result2,
            selectedMovie,
            showMovieDetails,};
    },
    methods: {
        zoomIn(event) {
            // Change the image size to make it larger when the mouse hovers over
            event.target.style.transform = 'scale(1.3)'; // You can adjust the scale value to control the level of zoom
            event.target.style.transition = 'transform 0.3s'; // Smoothly transition the change
        },
        zoomOut(event) {
            // Revert the image size when the mouse leaves
            event.target.style.transform = 'scale(1)';
            event.target.style.transition = 'transform 0.3s';
        },
    },
    template: `
     <div class="header p-2">
      <vcheader></vcheader>
    </div>
    <div class="vcnavbar">
      <vcnavbar @toggle-search="receiveEmit"></vcnavbar>
    </div>
    <div class="main-body">
      <div v-if="selectedMovie" class="selected-movie-details ml-5 text-center d-flex flex-column" style="width: 800px">
      <div class="movie-detail ml-5">
        <h2>{{ selectedMovie.title }}</h2>
        <img :src="selectedMovie.image" style="width: 500px;height: 700px " :alt="selectedMovie.title" />
        <p>{{ selectedMovie.plot }}</p>
      </div>
      <div class="detail">
      
    </div>
      
      </div>
    </div>
    <div v-if="!selectedMovie">
    <div v-if="searchMovies.length == 0" class="slider d-flex flex-row align-items-center justify-content-center">
        <button @click="movePrev" style="height: 50px;"> << </button>
        <div v-for="(movie, index) in movies" :key="movie.id" :style="{ 
          transform: 'translateX(' + ((index - currentMovieIndex) * 100) + '%)', 
          opacity: index === currentMovieIndex ? 1 : 0, 
          transition: 'transform 0.6s, opacity 1s'
        }">
          <div v-if="index === currentMovieIndex" class="d-flex flex-column align-items-center justify-content-center movie-slide">
            <div class="text-center" style="width: 800px">
              <img
                :style="{
                  width: '600px',
                  height: '700px',
                  transition: 'transform 0.3s',
                }"
                :src="movie.image"
                :alt="movie.title"
                @mouseover="zoomIn"
                @mouseleave="zoomOut"
                @click="showMovieDetails(movie)" 
              />
              <h3>{{ movie.title }}</h3>
              <p>{{ movie.plot }}</p>
            </div>
          </div>
        </div>
        <button @click="moveNext" style="height: 50px;"> >> </button>
      </div>
      <h1 class="ml-5" v-if="searchMovies.length == 0" >Most Popular:</h1>
      <div v-if="searchMovies.length == 0"  class="d-flex flex-row most-popular-slider align-items-center justify-content-center">
        <button @click="movePrevGr" style="height: 50px;"> << </button>
        <div
          v-for="(group, groupIndex) in result"
          :key="groupIndex"
          :style="{ 
            transform: 'translateX(' + ((groupIndex - currentMovieGroupIndex) * 100) + '%)', 
            opacity: groupIndex === currentMovieGroupIndex ? 1 : 0, 
            transition: 'transform 0.6s, opacity 1s'
          }"
        >
          <div v-if="groupIndex === currentMovieGroupIndex" class="d-flex flex-row align-items-center justify-content-center movie-slide">
            <div v-for="(film, index) in group" :key="index">
              <div class="text-center" style="width: 400px">
                <img
                  :style="{
                    width: '300px',
                    height: '350px',
                    transition: 'transform 0.3s',
                  }"
                  :src="film.image"
                  :alt="film.title"
                  @mouseover="zoomIn"
                  @mouseleave="zoomOut"
                  @click="showMovieDetails(film)" 
                />
                <h3>{{ film.title }}</h3>
                <p>{{ film.plot }}</p>
              </div>
            </div>
          </div>
        </div>
        <button @click="moveNextGr" style="height: 50px;"> >> </button>
      </div>
      <h1 v-if="searchMovies.length == 0" class="ml-5">Top rating:</h1>
      <div v-if="searchMovies.length == 0" class="d-flex flex-row most-popular-slider align-items-center justify-content-center">
        <button @click="movePrevGr2" style="height: 50px;"> << </button>
        <div
          v-for="(group, groupIndex) in result2"
          :key="groupIndex"
          :style="{ 
            transform: 'translateX(' + ((groupIndex - currentMovieGroupIndex2) * 100) + '%)', 
            opacity: groupIndex === currentMovieGroupIndex2 ? 1 : 0, 
            transition: 'transform 0.6s, opacity 1s'
          }"
        >
          <div v-if="groupIndex === currentMovieGroupIndex2" class="d-flex flex-row align-items-center justify-content-center movie-slide">
            <div v-for="(film, index) in group" :key="index">
              <div class="text-center" style="width: 400px">
                <img
                  :style="{
                    width: '300px',
                    height: '350px',
                    transition: 'transform 0.3s',
                  }"
                  :src="film.image"
                  :alt="film.title"
                  @mouseover="zoomIn"
                  @mouseleave="zoomOut"
                  @click="showMovieDetails(film)" 
                />
                <h3>{{ film.title }}</h3>
                <p>{{ film.plot }}</p>
              </div>
            </div>
          </div>
        </div>
        <button @click="moveNextGr2" style="height: 50px;"> >> </button>
      </div>
      <div v-if="searchMovies.length > 0" class="searchList row p-5">
        <div v-for="movie in searchMovies" :key="movie.id" class="col-md-4 mb-4 ">
          <div class="card text-center align-items-center">
            <img
              :src="movie.image"
              class="card-img-top"
              style="width: 100%;max-height:500px; transition: transform 0.3s;"
              :alt="movie.title"
              @mouseover="zoomIn"
              @mouseleave="zoomOut"
              @click="showMovieDetails(film)" 
            />
            <div class="card-body">
              <h5 class="card-title">{{ movie.title }}</h5>
              <!-- Add more details here if needed -->
            </div>
          </div>
        </div>
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
