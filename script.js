// fetch
// const search = document.querySelector('.search-button');
// search.addEventListener('click', function () {
//   const input = document.querySelector('.input-keyword');
//   fetch(`http://www.omdbapi.com/?apikey=cca42522&s=${input.value}`)
//     .then((response) => response.json())
//     .then((data) => {
//       const { Search } = data;
//       let cards = '';
//       const row = document.querySelector('.movie-container');
//       Search.forEach(({ Poster, Title, Year, imdbID }) => {
//         cards += showCards({ Poster, Title, Year, imdbID });
//       });
//       row.innerHTML = cards;

//       const buttons = document.querySelectorAll('.modal-detail-button');
//       buttons.forEach((button) => {
//         button.addEventListener('click', function () {
//           // const imdbid = this.dataset.imdbid;
//           // console.log(imdbid);
//           fetch(
//             `http://www.omdbapi.com/?apikey=cca42522&i=${button.getAttribute(
//               'data-imdbid'
//             )}`
//           )
//             .then((response) => response.json())
//             .then((data) => {
//               const {
//                 Poster,
//                 Title,
//                 Year,
//                 Director,
//                 Actors,
//                 Writer,
//                 Plot,
//               } = data;
//               let modals = showDetails({
//                 Poster,
//                 Title,
//                 Year,
//                 Director,
//                 Actors,
//                 Writer,
//                 Plot,
//               });
//               const modalBody = document.querySelector('.modal-body');
//               modalBody.innerHTML = modals;
//             })
//             .catch(() => console.log('data tidak ditemukan'));
//         });
//       });
//     })
//     .catch(() => console.log('data tidak ditemukan'));
// });
// end of fetch

// refactoring & aync await
const search = document.querySelector('.search-button');

search.addEventListener('click', async function () {
  try {
    const input = document.querySelector('.input-keyword');
    const movies = await getMovies(input.value);
    updateUI(movies);
  } catch (err) {
    alert(err);
  }
});

function getMovies(input) {
  return fetch('http://www.omdbapi.com/?apikey=cca42522&s=' + input)
    .then((response) => {
      if (response.ok === false) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === 'False') {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

function updateUI(movies) {
  let cards = '';
  const row = document.querySelector('.movie-container');
  movies.forEach(({ Poster, Title, Year, imdbID }) => {
    cards += showCards({ Poster, Title, Year, imdbID });
  });
  row.innerHTML = cards;
}

// async await
document.addEventListener('click', async function (e) {
  // mengambil button yang mengandung modal-detail-button
  if (e.target.classList.contains('modal-detail-button')) {
    try {
      const imdbid = e.target.dataset.imdbid;
      const movieDetail = await getDetailsMovie(imdbid);
      updateUIDetail(movieDetail);
    } catch (error) {
      alert(error);
    }
  }
});

function getDetailsMovie(imdbid) {
  return fetch('http://www.omdbapi.com/?apikey=cca42522&i=' + imdbid)
    .then((response) => {
      if (response.ok === false) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === 'False') {
        throw new Error(response.Error);
      }
      return response;
    });
}

function updateUIDetail(movieDetail) {
  const { Poster, Title, Year, Director, Actors, Writer, Plot } = movieDetail;
  let modals = showDetails({
    Poster,
    Title,
    Year,
    Director,
    Actors,
    Writer,
    Plot,
  });
  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = modals;
}

// event binding

function showCards({ Poster, Title, Year, imdbID }) {
  return `<div class="col-md-4 my-3">
                    <div class="card">
                      <img src="${Poster}" class="card-img-top img-fluid">
                      <div class="card-body">
                        <h5 class="card-title">${Title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${Year}</h6>
                        <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdbid="${imdbID}">Show Details</a>
                      </div>
                    </div>
                  </div>`;
}

function showDetails({ Poster, Title, Year, Director, Actors, Writer, Plot }) {
  return `<div class="container-fluid">
                            <div class="row">
                                <div class="col-md-3">
                                    <img src="${Poster}" class="img-fluid">
                                </div>
                                <div class="col-md">
                                    <ul class="list-group">
                                        <li class="list-group-item">
                                            <h4>${Title} (${Year})</h4>
                                        </li>
                                        <li class="list-group-item"><strong>Director : </strong>${Director}</li>
                                        <li class="list-group-item"><strong>Writer : </strong>${Writer}</li>
                                        <li class="list-group-item"><strong>Actors : </strong>${Actors}</li>
                                        <li class="list-group-item"><strong>Plot : </strong><br>${Plot}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>`;
}
