// data.js
import movieData from './db/data.js';
// Simulated movie data
const moviesData = [
    ...movieData.Movies
];

// DB Utility
export const DBProvider = {
    fetch: async (query) => {
        const [type, className, queryPart] = query.split('/');
        const  [pattern,queryParams]= queryPart.split('?');
        const { per_page = 5, page = 1 } = getQueryParams(queryParams);
        switch (type) {
            case 'search':
                const searchQuery = pattern;
                const searchResults = pattern == '' ? [] : moviesData.filter(movie =>
                { return  movie.title.toLowerCase().includes(searchQuery.toLowerCase())})
                const paginatedResults = getPaginatedResults(searchResults, per_page, page);
                return {
                    type,
                    class: className,
                    pattern: searchQuery,
                    per_page,
                    page,
                    total_page: Math.ceil(searchResults.length / per_page),
                    total: searchResults.length,
                    items: paginatedResults,
                };

            case 'detail':
                const id = queryPart;
                const movieDetail = moviesData.find(movie => movie.id === id);

                return movieDetail ? { type, class: className, pattern: id, data: movieDetail } : null;

            case 'get':
                const getQueryType = className.toLowerCase();

                switch (getQueryType) {
                    case 'top50':
                        const top50 = getPaginatedResults(moviesData.slice(0, 50), per_page, page);
                        return { type, class: className,  per_page,
                            page, pattern: '', total: top50.length, items: top50 };

                    case 'mostpopular':
                        // Example logic to sort by popularity or any other suitable criterion
                        const mostPopular = moviesData.slice().sort((a, b) => b.popularity - a.popularity).slice(0, 50);
                        return { type, class: className, pattern: '', total: 50, items: mostPopular };

                    case 'topboxoffice':
                        // Example logic to sort by box office revenue or any other suitable criterion
                        const topBoxOffice = moviesData.slice().sort((a, b) => b.boxOffice - a.boxOffice).slice(0, 50);
                        return { type, class: className, pattern: '', total: 50, items: topBoxOffice };

                    default:
                        return null;
                }

            default:
                return null;
        }
    },
};

const getQueryParams = (queryParamsString) => {
    const params = {};
    const pairs = new URLSearchParams(queryParamsString);
    for (const pair of pairs) {
        params[pair[0]] = pair[1];
    }
    return params;
};

const getPaginatedResults = (data, per_page, page) => {
    const startIndex = (+page - 1) * +per_page;
    const endIndex = startIndex + +per_page;
    return data.slice(startIndex, endIndex);
};
