const API_URL = "http://localhost:3000/api";

const filmsList = document.getElementById("films");
const addFilmForm = document.getElementById("addFilmForm");

function getFilmPayload() {
  const id = document.getElementById("id").value;
  const title = document.getElementById("title").value;
  const director = document.getElementById("director").value;
  const genre = document.getElementById("genre").value;
  const plotSummary = document.getElementById("plotSummary").value;
  // const posterImage = document.getElementById("posterImage").value;
  const actors = document.getElementById("actors").value;
  const releaseDate = document.getElementById("releaseDate").value;
  const isReleased = document.getElementById("isReleased").value;

  // Crear el objeto de datos que se enviará como JSON
  const data = {
    id,
    title,
    director,
    genre,
    plotSummary,
    // posterImage,
    actors,
    releaseDate,
    isReleased,
  };

  // Eliminar propiedades con valores vacíos
  for (const key in data) {
    if (data[key] === undefined || data[key] === null || data[key] === "") {
      delete data[key];
    }

    if (key === "actors") {
      // Separar actores por comas en un arreglo
      data[key] = data[key].split(",").map(actor => actor.trim());
    } else if (key === "isReleased") {
      // Convertir el valor de checkbox a booleano
      data[key] = addFilmForm.querySelector('#isReleased').checked;
    } else {
      data[key] = data[key];
    }
  }

  return data;
}

// Función para mostrar las películas
function displayFilms() {
  fetch(`${API_URL}/retrieveAllFilms`)
    .then(response => response.json())
    .then(films => {
      filmsList.innerHTML = "";
      films.forEach(film => {
        const filmItem = document.createElement("li");
        filmItem.innerHTML = `
          <h3>${film.title}</h3>
          <p>Director: ${film.director}</p>
          <p>Género: ${film.genre}</p>
          <p>Resumen: ${film.plotSummary ? film.plotSummary : "N/A"}</p>
          <!--<p>Imágen de Cartelera: <img src="${film.posterImage ? film.posterImage : 'N/A'}" alt="Poster Image" /></p>-->
          <p>Actores: ${film.actors.join(", ")}</p>
          <p>Fecha de Estreno: ${film.releaseDate ? film.releaseDate : "N/A"}</p>
          <p>Está Estrenada: ${film.isReleased ? "Sí" : "No"}</p>
          <button onclick="removeFilm('${film._id}')">Borrar</button>
          <button onclick="editFilm('${film._id}')">Editar</button>
        `;

        filmsList.appendChild(filmItem);
      });
    });
}

function saveFilm(event) {
  event.preventDefault();

  const filmData = getFilmPayload();

  const isNewFilm = !filmData.id;

  const url = isNewFilm ? `${API_URL}/addNewFilm` : `${API_URL}/updateFilm/${filmData.id}`;
  const method = isNewFilm ? "POST" : "PUT";
debugger;
  fetch(url, {
      method: method,
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(filmData)
  })
  .then(() => {
      displayFilms();
      addFilmForm.reset();
  });
}

function removeFilm(id) {
  fetch(`${API_URL}/removeFilm/${id}`, {
      method: "DELETE"
  })
  .then(() => {
      displayFilms();
  });
}

function editFilm(id) {
  fetch(`${API_URL}/retrieveFilm/${id}`)
    .then((response) => response.json())
    .then((film) => {
      document.getElementById("id").value = film._id;
      document.getElementById("title").value = film.title;
      document.getElementById("director").value = film.director;
      document.getElementById("genre").value = film.genre;
      document.getElementById("plotSummary").value = film.plotSummary || "";
      // document.getElementById("posterImage").value = film.posterImage || "";
      document.getElementById("actors").value = film.actors || "";
      document.getElementById("releaseDate").value = film.releaseDate || "";
      document.getElementById("isReleased").checked = film.isReleased;
    })
    .then(() => {
      displayFilms();
    });
}

displayFilms();

// Función para crear una nueva película
addFilmForm.addEventListener("submit", saveFilm);
