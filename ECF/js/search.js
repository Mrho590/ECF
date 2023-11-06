/**
 * Ce script gère la recherche de films via l'API OMDB et l'affichage des résultats.
 * Il permet également la pagination des résultats de recherche.
 */

// Attendre que le DOM soit entièrement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', function () {
    // Éléments du DOM que nous utiliserons dans le script
    const searchForm = document.getElementById('searchMovieForm');
    const resultsDiv = document.getElementById('results');
    const paginationDiv = document.getElementById('pagination');
    
    // Clé API pour l'API OMDB
    const apiKey = 'a17237f5'; // clé API 

    // Variable pour stocker les détails de la dernière recherche pour la pagination
    let lastSearch = {};

    /**
     * Recherche les films en utilisant l'API OMDB et affiche les résultats.
     * @param {string} title - Le titre du film à rechercher.
     * @param {string} year - L'année de sortie du film.
     * @param {string} type - Type de la recherche (film, série, épisode).
     * @param {number} page - Numéro de la page des résultats à afficher.
     */
    function searchMovies(title, year, type, page = 1) {
        // Construire l'URL pour la requête API
        const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(title)}&y=${year}&type=${type}&page=${page}`;
        
        // Mémoriser la recherche pour la pagination
        lastSearch = { title, year, type, page };

        // Exécuter la requête vers l'API OMDB
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Afficher les résultats ou un message si aucun résultat n'est trouvé
                if (data.Response === 'True') {
                    displayResults(data.Search);
                    displayPagination(data.totalResults, page);
                } else {
                    resultsDiv.innerHTML = '<p>Aucun résultat trouvé.</p>';
                    paginationDiv.innerHTML = '';
                }
            })
            .catch(error => {
                // Gérer les erreurs de requête
                resultsDiv.innerHTML = '<p>Erreur lors de la recherche.</p>';
                paginationDiv.innerHTML = '';
            });
    }

    /**
     * Affiche les résultats de recherche de films.
     * @param {Object[]} movies - Tableau des films retournés par l'API OMDB.
     */
    function displayResults(movies) {
        resultsDiv.innerHTML = ''; // Vider les résultats précédents

        // Parcourir chaque film et créer les éléments HTML pour l'affichage
        movies.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.className = 'movie';

            // Créer et ajouter le poster du film
            const poster = document.createElement('img');
            poster.src = movie.Poster !== 'N/A' ? movie.Poster : '../img/image-not-found-scaled-1150x647.png'; // Utiliser l'image par défaut si nécessaire
            poster.alt = `Poster for ${movie.Title}`;
            movieDiv.appendChild(poster);

            // Créer et ajouter le titre du film
            const title = document.createElement('h3');
            title.textContent = movie.Title;
            movieDiv.appendChild(title);

            // Créer et ajouter l'année du film
            const year = document.createElement('p');
            year.textContent = movie.Year;
            movieDiv.appendChild(year);

            // Ajouter le div du film aux résultats
            resultsDiv.appendChild(movieDiv);
        });
    }

    /**
     * Affiche les boutons de pagination en fonction du nombre total de résultats.
     * @param {number} totalResults - Nombre total de résultats retournés par l'API.
     * @param {number} currentPage - Numéro de la page actuelle.
     */
    function displayPagination(totalResults, currentPage) {
        paginationDiv.innerHTML = ''; // Vider la pagination précédente

        const totalPages = Math.ceil(totalResults / 10); // OMDB renvoie 10 résultats par page
        const maxPagesToShow = 10; // Limiter le nombre de pages à afficher à la fois
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;

        // Ajuster si la fin dépasse le nombre total de pages
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        // Bouton pour aller aux pages précédentes, s'il y a des pages avant la page actuelle
        if (startPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Précédent';
            prevButton.onclick = function () {
                searchMovies(lastSearch.title, lastSearch.year, lastSearch.type, startPage - 1);
            };
            paginationDiv.appendChild(prevButton);
        }

        // Créer un bouton pour chaque page dans l'intervalle défini
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.onclick = function () {
                searchMovies(lastSearch.title, lastSearch.year, lastSearch.type, i);
            };
            if (i === currentPage) {
                button.disabled = true; // Désactiver le bouton de la page actuelle
            }
            paginationDiv.appendChild(button);
        }

        // Bouton pour aller aux pages suivantes, s'il y a des pages après
        if (endPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Suivant';
            nextButton.onclick = function () {
                searchMovies(lastSearch.title, lastSearch.year, lastSearch.type, endPage + 1);
            };
            paginationDiv.appendChild(nextButton);
        }
    }

    // Gérer la soumission du formulaire de recherche
    searchForm.onsubmit = function (event) {
        event.preventDefault(); // Empêcher le comportement par défaut de soumission de formulaire
        // Récupérer les valeurs du formulaire
        const title = searchForm.title.value.trim();
        const year = searchForm.year.value.trim();
        const type = searchForm.type.value;

        // Lancer une recherche avec les valeurs du formulaire
        searchMovies(title, year, type);
    };
});
