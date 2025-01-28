document.addEventListener('DOMContentLoaded', () => {
    const animeNameInput = document.getElementById('anime-name');
    const searchAnimeButton = document.getElementById('search-anime');
    const animeList = document.getElementById('anime-list');
    const videoPlayer = document.getElementById('video-player');

    // Загрузка данных из movie_shikimori_ids.json
    let kodikIds = {};
    fetch('https://raw.githubusercontent.com/API-Movies/kodik/main/movie_shikimori_ids.json')
        .then(response => response.json())
        .then(data => {
            kodikIds = data;
        })
        .catch(error => console.error('Error:', error));

    searchAnimeButton.addEventListener('click', () => {
        const animeName = animeNameInput.value;
        if (animeName) {
            fetch(`https://shikimori.one/api/animes?search=${animeName}`)
                .then(response => response.json())
                .then(data => {
                    animeList.innerHTML = '';
                    data.forEach(anime => {
                        const animeItem = document.createElement('div');
                        animeItem.innerHTML = `
                            <h3>${anime.name}</h3>
                            <button onclick="playAnime(${anime.id})">Смотреть</button>
                        `;
                        animeList.appendChild(animeItem);
                    });
                })
                .catch(error => console.error('Error:', error));
        }
    });

    function playAnime(shikimoriId) {
        const kodikId = kodikIds[shikimoriId];
        if (kodikId) {
            fetch(`https://api.kodik.cc/serial/${kodikId}?token=YOUR_API_TOKEN`)
                .then(response => response.json())
                .then(data => {
                    const series = data.series;
                    const seasons = Object.keys(series);
                    const season = seasons[0];
                    const episode = series[season][0];
                    const iframeSrc = `https://kodik.cc/embed/${kodikId}/${season}/${episode}`;
                    videoPlayer.src = iframeSrc;
                })
                .catch(error => console.error('Error:', error));
        } else {
            console.error('Kodik ID not found for Shikimori ID:', shikimoriId);
        }
    }
});