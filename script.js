const imagesContainer = document.querySelector('.images-container');
const savBtn = document.querySelector('.save-confirmed');
const apiKey = 'DEMO_KEY';
const count = 10;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultArray = [];
let favorites = {};

function createDom(page) {
	// const currentArray = page === 'result' ? resultArray : favorites.values();
	const currentArray = page === 'result' ? resultArray : Object.values(favorites);
	currentArray.forEach((result) => {
		// card container
		const card = document.createElement('div');
		card.classList.add('card');
		// link
		const link = document.createElement('a');
		link.href = result.hdurl;
		link.title = 'View full image';
		link.target = '_blank';
		// img
		const image = document.createElement('img');
		image.src = result.url;
		image.alt = 'NASA image of the day';
		image.loading = 'lazy';
		image.classList.add('card-img-top');
		// card body
		const cardBody = document.createElement('div');
		cardBody.classList.add('card-body');
		// ct
		const header = document.createElement('h5');
		header.classList.add('card-title');
		header.textContent = result.title;
		// add to fav
		const favBtn = document.createElement('p');
		favBtn.classList.add('clickable','addon-1');
		favBtn.textContent = 'Add to favorites';
		// favBtn.onclick = `savedfav(${result.url})`;
		// why above doesn't work?
		favBtn.setAttribute('onclick', `savedfav('${result.url}')`);
		// explain
		const des = document.createElement('p');
		des.textContent = result.explanation;
		des.classList.add('card-text');
		// footer
		const footer = document.createElement('small');
		footer.classList.add('text-muted');
		const dateEl = document.createElement('strong');
		dateEl.textContent = result.date;
		const copyrightResult = result.copyright === undefined ? '' : result.copyright;
		const cr = document.createElement('span');
		cr.textContent = `   ${copyrightResult}`;

		footer.append(dateEl, cr);
		cardBody.append(header, favBtn, des, footer);
		link.appendChild(image);
		card.append(link, cardBody);
		console.log(card);
		imagesContainer.appendChild(card);
	});
	
}


function updateDom(page) {
	if (localStorage.getItem('nasaFav')) {
		favorites = JSON.parse(localStorage.getItem('nasaFav'));	
	}
	createDom(page);
}

// get 10 images from NASA api
async function getNasaImages() {
	try {
		const result = await fetch(apiUrl);
		resultArray = await result.json();
		// console.log(resultArray);
		updateDom('fav');
	} catch(e) {
		// errors please
	}
}

function savedfav(itemUrl) {
	resultArray.forEach((item) => {
		if(item.url.includes(itemUrl) && !favorites[itemUrl]) {
			favorites[itemUrl] = item;
			savBtn.hidden = false;
			setTimeout(() => {
				savBtn.hidden = true;
			}, 2000);
		}
	});
	localStorage.setItem('nasaFav', JSON.stringify(favorites));
}

getNasaImages();