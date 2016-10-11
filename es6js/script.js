document.addEventListener('DOMContentLoaded', function () {
	// ******************************
	// get JSON from url given
	var getJSON = function (url, successHandler, errorHandler) {

		var xhr = new XMLHttpRequest();

		xhr.open('get', url, true);
		xhr.responseType = "json";
		
		xhr.addEventListener('readystatechange', function () {
			var status;
			// https://xhr.spec.whatwg.org/#23dom-xmlhttprequest-readystate'DONE'
			if (xhr.readyState == 4) {
				status = xhr.status;
				if (status == 200) {
					successHandler && successHandler(xhr.response);
				} else {
					errorHandler && errorHandler(status);
				}
			}
		});

		xhr.send();
	}

	// add function passed from searchKeyword() – create DOM element, add class and content to it
	function add(element, myClass, property, content) {
		let newElement =  document.createElement(element);
		newElement.classList.add(myClass);
		newElement[property] = content;
		return newElement;
	}

	// do on success
	// when search button is clicked
	function clickSearch(response) {
		let pageId = Object.keys(response.query.pages),
			url = response.query.pages[pageId].fullurl;
		
		window.open(url,"_self");
	}
	// with given keyword and search button clicked
	function searchKeyword(response) {
		let section = document.querySelector('.wiki-app__articles');
		
		while (section.firstChild) {
			section.removeChild(section.firstChild);
		}
		if (response[1].length == 0) {
			let title =  add( "h2", "wiki-app__article-title","innerText", "Nothing here" );
			section.appendChild(title);
		} else {
			for (let i = 1, len = response[1].length; i < len; i += 1) {
				// here all DOM elements for article are created
				let article = add( "article", "wiki-app__article", "innerText", "" ),
					title =  add( "h2", "wiki-app__article-title","innerText", response[1][i] ),
					para = add( "p", "wiki-app__snippet", "innerText", response[2][i] ),
					link = add( "a", "wiki-app__link", "innerText", response[3][i] );

				link.setAttribute("href", response[3][i]); //add href attribute to a tag

				// append all elements to article
				article.appendChild(title);
				article.appendChild(para);
				article.appendChild(link);

				section.appendChild(article);

			}
			
		}

		section.addEventListener('click', function(event) {
			let target = event.target;
			if ( target.classList.contains("wiki-app__article") ) {
				window.open( target.querySelector(".wiki-app__link").getAttribute("href"), "_self" );
			} else {
				window.open( target.parentElement.querySelector(".wiki-app__link").getAttribute("href"), "_self" );
			}
			// window.open(event.target.querySelector(".wiki-app__link").getAttribute("href", "_self"));
		});

	}

	// do on failure
	function error(error) {
		console.log(error);
	}


	function check () {
		let	mySearch = document.querySelector('.wiki-app__keyword');
			
		if (mySearch.value) {
			let keyword = mySearch.value,
				query = `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=${keyword}&limit=10&profile=strict&utf8=1&formatversion=2`;
			
			getJSON ( query, searchKeyword, error );

		} else {
			let query = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=info&generator=random&inprop=url&grnnamespace=&grnlimit=1';
			
			getJSON ( query, clickSearch, error );
		}
	}

	// ******************************

	// button, input and query caching
	var myButton = document.querySelector('.wiki-app__icon');
	
	myButton.addEventListener('click', function (event) {
		if (event.preventDefault) {
			event.preventDefault();
			check();
		} else {
			event.returnValue = false;
		}
	})

});