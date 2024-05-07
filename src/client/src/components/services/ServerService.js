const { HTTPMethod } = require('http-method-enum')

const BASE_URL = 'http://localhost:3001'

class ServerService {

	// Private function
	static #getData(endPoint, httpMethod, callbackSuccess, callbackError) {

		fetch(`${BASE_URL}/${endPoint}`, {
			headers: { 'Content-Type': 'application/json' },
			"method": httpMethod,
			"credentials": 'include',
			mode: 'cors'
		})
			.then(response => {
				if (!response.ok) {
					callbackError(response)
					throw new Error('Failed to fetch data');
				}
				return response.json();
			})
			.then(data => {
				console.log(data)
				callbackSuccess(data)
			})
			.catch(error => {
				callbackError(error)
			});
	}
	// Private function
	static #postData(endPoint, httpMethod, body, callbackSuccess, callbackError) {

		fetch(`${BASE_URL}/${endPoint}`, {
			headers: { 'Content-Type': 'application/json' },
			"method": httpMethod,
			"credentials": 'include',
			"body": JSON.stringify(body),
			mode: 'cors'
		})
			.then(response => {
				console.log(response)
				//				callbackError(response)
				if (!response.ok) {
					callbackError("error")
					throw new Error('Failed to fetch data');
				}
				return response.json();
			})
			.then(data => {
				console.log(data)
				callbackSuccess(data)
			})
			.catch(error => {
				callbackError(error)
			});
	}

	static fetchPlaylists = (callbackSuccess, callbackError) => {
		ServerService.#getData('api/v1/playlists', HTTPMethod.GET, callbackSuccess, callbackError)
	}

	static lancerPlaylist(selectedDevice, selectedPlaylist, callbackSuccess, callbackError) {
		let endPoint = 'api/v1/launch_song/?id_device=' + selectedDevice + '&playlist_uri=' + selectedPlaylist
		ServerService.#getData(endPoint, HTTPMethod.GET, callbackSuccess, callbackError)
	}


	static fetchDevices = (callbackSuccess, callbackError) => {
		ServerService.#getData('api/v1/devices', HTTPMethod.GET, callbackSuccess, callbackError)
	}

	static fetchUserInfos = (callbackSuccess, callbackError) => {
		ServerService.#getData('getSession', HTTPMethod.GET, callbackSuccess, callbackError)
	}

	static sendLogin = (username, password, callbackSuccess, callbackError) => {
		let body = {
			username: username,
			password: password
		}
		ServerService.#postData('login', HTTPMethod.POST, body, callbackSuccess, callbackError)
	}

}

export default ServerService;