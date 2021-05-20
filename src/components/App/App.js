import React from 'react';
import Playlist from '../Playlist/Playlist.js';
import SearchBar from '../SearchBar/SearchBar.js'
import SearchResults from '../SearchResults/SearchResults.js';
import Spotify from '../../util/Spotify.js'
import './App.css';


class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
    searchResults: [],
    playlistName : 'My Playlist',
    playlistTracks : []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  
  addTrack(track){
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }
  
  removeTrack(track){
    var filteredPlaylist = this.state.playlistTracks.filter(item => {
      return item.id !== track.id;
    })
    this.setState({playlistTracks : filteredPlaylist});
  }

  updatePlaylistName(name){
    this.setState({playlistName:name});
  }

  savePlaylist(){
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    console.log(trackUris,this.playlistName);
    Spotify.savePlaylist(this.state.playlistName,trackUris);
    this.setState({playlistTracks: [], playlistName: ''});
    
  }

  search(term){
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }

  render(){
    return (<div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={this.search}/>
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
          <Playlist playlistName={this.state.playlistName}
                    playlistTracks={this.state.playlistTracks}
                    onRemove = {this.removeTrack}
                    onNameChange = {this.updatePlaylistName}
                    onSave = {this.savePlaylist}
          />
        </div>
      </div>
    </div>);
  }
}

export default App;
