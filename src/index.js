import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_nHFCtRCXEHoxdoOexwvc6nseyCJvEJW44qn0NJEH9brXeDtqKsZHCwxKjRSxkLeZ';

// Función para hacer una petición HTTP para obtener las razas
export function fetchBreeds() {
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => response.data)
    .catch(error => {
      showError();
      throw error;
    });
}

// Función para hacer una petición HTTP para obtener la información del gato por su raza
export function fetchCatByBreed(breedId) {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => response.data)
    .catch(error => {
      showError();
      throw error;
    });
}

// Función para mostrar el cargador
function showLoader() {
  document.querySelector('.loader').style.display = 'block';
}

// Función para ocultar el cargador
function hideLoader() {
  document.querySelector('.loader').style.display = 'none';
}

// Función para mostrar el mensaje de error
function showError() {
  document.querySelector('.error').style.display = 'block';
}

// Función para ocultar el mensaje de error
function hideError() {
  document.querySelector('.error').style.display = 'none';
}

// Función para actualizar la interfaz de usuario con la información del gato
function updateCatInfo(catData) {
  const catInfoElement = document.querySelector('.cat-info');
  catInfoElement.innerHTML = `
    <h2>${catData.breeds[0].name}</h2>
    <img src="${catData.url}" alt="${catData.breeds[0].name}"style="max-width: 50%; height: auto;" />
    <p><strong>Description:</strong> ${catData.breeds[0].description}</p>
    <p><strong>Temperament:</strong> ${catData.breeds[0].temperament}</p>
   
  `;
}

// Evento al cambiar la selección de raza
document
  .querySelector('.breed-select')
  .addEventListener('change', async event => {
    const selectedBreedId = event.target.value;
    showLoader();
    hideError();
    try {
      const catData = await fetchCatByBreed(selectedBreedId);
      updateCatInfo(catData[0]);
    } catch (error) {
      showError();
    } finally {
      hideLoader();
    }
  });

// Cargar las razas al cargar la página
window.addEventListener('load', async () => {
  showLoader();
  hideError();
  try {
    const breeds = await fetchBreeds();
    const breedSelectElement = document.querySelector('.breed-select');
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelectElement.appendChild(option);
    });
  } catch (error) {
    showError();
  } finally {
    hideLoader();
  }
});
