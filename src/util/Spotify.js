
let userAccessToken = '';
const authorizeuUrl = 'https://accounts.spotify.com/authorize';
const queryParams = {
    clientId: 'a673e7762f36462db87b097a403c2f83',
    responseType: 'token',
    redirectUri: 'http://localhost:3000/',
    scope: 'playlist-modify-public'
}

const endpoint = `${authorizeuUrl}?client_id=${queryParams.clientId}&response_type=${queryParams.responseType}
&scope=${queryParams.scope}&redirect_uri=${queryParams.redirectUri}`

const Spotify = {
    
    getAccessToken(){
        const tokenFromUrl = window.location.href.match((/access_token=([^&]*)/));
        const expireTimeMatch = window.location.href.match(/expires_in=([^&]*)/);
        if(userAccessToken !== ''){
            return userAccessToken;
        }
        else if(tokenFromUrl && expireTimeMatch){
            userAccessToken = tokenFromUrl[1];
            const expiresIn = Number(expireTimeMatch[1]);
            window.setTimeout(() => userAccessToken = '' , expiresIn*1000);
            window.history.pushState('Access Token', null, '/');
            console.log(userAccessToken);
            return userAccessToken;
        }
        else{
            window.location = endpoint;
        }
    },
    search(term){
        const accessToken = this.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
            headers: {Authorization: `Bearer ${accessToken}`}
          }).then(response => {
              return response.json();
          }).then(jsonResponse => {
              if(!jsonResponse.tracks){
                  return [];
              }else{
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                  }));
                //   let results = [];
                //   for (let track in jsonResponse.tracks.items){
                //       results.push({id: track.id, name:track.name, 
                //         album:track.album, uri:track.uri })
                //         console.log({id: track.id, name:track.name, 
                //             album:track.album, uri:track.uri })
                //   }
                //   return results;
              }
          })
    },

    savePlaylist(playlistName,trackUris){
        if(playlistName === '' && trackUris === ''){
            return;
        }
        
        let accessToken = this.getAccessToken();
        let headers = {Authorization: `Bearer ${accessToken}`}
        let userId = '';
        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        ).then(jsonResponse => {
          userId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({name: playlistName})
          }).then(response => response.json()
          ).then(jsonResponse => {
            const playlistId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({uris: trackUris})
            });
          });
        });
        // userId = fetch('https://api.spotify.com/v1/me',{headers : headers}).then(response => {
        //     return response.json();
        // }).then(jsonResponse => {
        //     return jsonResponse.id;
        // });

        // let playlistId = '';
        // playlistId = fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
        //     headers : headers,
        //     method: 'POST',
        //     body: JSON.stringify({
        //         name: playlistName,
        //         description: "My Jammming Playlist",
        //         public: false
        //       })
        // }).then(response => response.json()).then(jsonResponse =>{
        //     return jsonResponse.playlistId;
        // });

        // fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,{
        //     headers : headers,
        //     method: 'POST',
        //     body: JSON.stringify({uris: trackUris})
        // });
    }

}


export default Spotify;