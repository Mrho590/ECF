/**
 * @file Gestion d'une liste de films, permettant l'ajout, l'affichage, la suppression et le tri des films.
 */

/**
 * @typedef {Object} Movie - Représente un film.
 * @property {string} title - Le titre du film.
 * @property {string} year - L'année de sortie du film.
 * @property {string} author - Le réalisateur du film.
 */

/**
 * Attends que le DOM soit complètement chargé avant d'exécuter les fonctions.
 */
document.addEventListener('DOMContentLoaded', function () {
    /** @type {Movie[]} */
    const movies = [
        // Initialisation d'une liste de films
        { title: 'Inception', year: '2010', author: 'Christopher Nolan' },
        { title: 'Interstellar', year: '2014', author: 'Christopher Nolan' },
        { title: 'The Dark Knight', year: '2008', author: 'Christopher Nolan' },
        { title: 'Pulp Fiction', year: '1994', author: 'Quentin Tarantino' }
    ];

    /** @type {HTMLTableSectionElement} */
    const moviesTable = document.getElementById('moviesTable').getElementsByTagName('tbody')[0];
    
    /** @type {HTMLFormElement} */
    const addMovieForm = document.getElementById('addMovieForm');
    
    /** @type {HTMLButtonElement} */
    const addMovieBtn = document.getElementById('addMovieBtn');
    
    /** @type {HTMLSelectElement} */
    const filterSelect = document.getElementById('filterSelect');

    /**
     * Affiche les films dans le tableau HTML.
     */
    function displayMovies() {
        moviesTable.innerHTML = '';
        movies.forEach(movie => {
            const newRow = moviesTable.insertRow();
            Object.values(movie).forEach(value => {
                const newCell = newRow.insertCell();
                newCell.textContent = value;
            });

            // Création d'un bouton de suppression pour chaque film
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Supprimer';
            deleteBtn.onclick = function () {
                // Confirmation avant la suppression du film
                Swal.fire({
                    title: 'Êtes-vous sûr de vouloir supprimer ce film ?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Oui, supprimez-le!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Suppression du film de la liste et réaffichage des films
                        const index = movies.indexOf(movie);
                        if (index > -1) {
                            movies.splice(index, 1);
                            displayMovies();
                        }
                    }
                });
            };
            const actionCell = newRow.insertCell();
            actionCell.appendChild(deleteBtn);
        });
    }

    /**
     * Ajoute un nouveau film à la liste.
     * @param {string} title - Le titre du film.
     * @param {string} year - L'année de sortie du film.
     * @param {string} author - Le réalisateur du film.
     */
    function addMovie(title, year, author) {
        const newMovie = {
            // Met en majuscule la première lettre du titre et de l'auteur, normalise l'année
            title: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
            year: year,
            author: author.charAt(0).toUpperCase() + author.slice(1).toLowerCase()
        };
        movies.push(newMovie);
        displayMovies();
    }

    /**
     * Gestionnaire d'événements pour soumission du formulaire d'ajout de film.
     * @param {Event} event - L'événement de soumission du formulaire.
     */
    addMovieForm.onsubmit = function (event) {
        event.preventDefault();
        const title = addMovieForm.title.value.trim();
        const year = addMovieForm.year.value.trim();
        const author = addMovieForm.author.value.trim();
        const currentYear = new Date().getFullYear();
        let errorMessages = '';

        // Vérification des données du formulaire
        if (title.length < 2) {
            errorMessages += 'Le titre doit contenir au moins 2 caractères.<br>';
        }
        if (isNaN(year) || year < 1900 || year > currentYear) {
            errorMessages += 'L\'année doit être un nombre compris entre 1900 et l\'année en cours.<br>';
        }
        if (author.length < 5) {
            errorMessages += 'L\'auteur doit contenir au moins 5 caractères.<br>';
        }

        if (errorMessages !== '') {
            // Affichage des messages d'erreur sous le formulaire
            const errorSection = document.getElementById('errorSection');
            errorSection.innerHTML = errorMessages;
            Swal.fire({
                title: 'Erreur dans le formulaire',
                text: 'Veuillez vérifier les données saisies.',
                icon: 'error',
                timer: 5000,
                showConfirmButton: false
            });
        } else {
            // Le formulaire est valide, ajoute le film à la liste
            addMovie(title, year, author);
            Swal.fire({
                title: 'Succès!',
                text: 'Film ajouté avec succès',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false
            });
            addMovieForm.reset();
            // Efface les messages d'erreur s'il y en avait
            const errorSection = document.getElementById('errorSection');
            errorSection.innerHTML = '';
        }
    };

    /**
     * Gestionnaire d'événements pour le clic sur le bouton "Ajouter un film".
     */
    addMovieBtn.onclick = function () {
        // Affiche ou masque le formulaire d'ajout de film lors du clic sur le bouton
        addMovieForm.style.display = addMovieForm.style.display === 'none' ? 'block' : 'none';
    };

    /**
     * Gestionnaire d'événements pour le changement de valeur du sélecteur de filtre.
     */
    filterSelect.onchange = function () {
        // Trie les films en fonction de la valeur du sélecteur de filtre
        if (filterSelect.value === 'title') {
            movies.sort((a, b) => a.title.localeCompare(b.title));
        } else if (filterSelect.value === 'year') {
            movies.sort((a, b) => b.year - a.year);
        }
        displayMovies();
    };

    // Affiche les films au chargement de la page
    displayMovies();
});
