import React, { Component } from 'react';
import queryString from 'query-string';
import './App.css';


const defaultStyle = {
  color: '#fff'
};


class PlayListCounter extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, width: "40%", display: 'inline-block' }}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, []);
   
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return (sum + eachSong.duration);
    }, 0);
    
    return (
      <div style={{ ...defaultStyle, width: "40%", display: 'inline-block' }}>
        <h2>{Math.round(totalDuration / 60)} minutes</h2>
      </div>

    );
  }
}

class Filter extends Component {
  render() {
    let inputStyle = {
      padding:"10px",
      width:"33%",
      borderRadius:"5px",
      border:"none"
    }
    return (
      <div className='filter'>
       
        <input style={inputStyle} type="text" placeholder="Type to filter" onKeyUp={e => this.props.onTextChange(e.target.value)} />
        
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;

    let playlistStyle = {
      ...defaultStyle,
      display: "inline-block",
      width: "20%",
      color:"#333",
      background:"#ccc",
      border: "1px #333 solid",
      margin: "20px 10px 5px 10px",
      overflow: "auto"
    }
    let ulStyle = {
      listStyle:'square',
      textAlign:'left'
    }

    let imgStyle = {
      width:"100%"
    }
    
    let inputStyle = {
      padding:"10px",
      width:"33%",
      boderRadius:"5px",
      border:"none"
    }

    return (
      <div className="playList" style={playlistStyle}>
        <img style={imgStyle} src={playlist.imageUrl}  alt="Test"/>
        <h3>{playlist.name}</h3>
        <ul style={ulStyle}>
          {playlist.songs.map((song, i) => {
            return <li key={i}>{song.name}</li>
          })}
        </ul>
      </div>

    );
  }
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: ''
    }
  }



  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    if (!accessToken) return;

    fetch('https://api.spotify.com/v1/me', {
       headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
      .then(data => this.setState({
        user: {
            name: data.display_name 
        }  
    }))
     
    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': 'Bearer ' + accessToken }})
      .then(response => response.json())
      .then(playlistData=>{
        let playlists = playlistData.items;
        let trackDataPromises = playlists.map(playlist => {
          let responsePromise = fetch(playlist.tracks.href, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
          })
          let trackDataPromise = responsePromise
          .then(response=>response.json())
          return trackDataPromise;
        })
        let allTracksDatasPromises = 
         Promise.all(trackDataPromises)
         let playlistsPromise = allTracksDatasPromises.then(trackDatas => {
          trackDatas.forEach((trackData, i) => {
            playlists[i].trackDatas = trackData.items
            .map(item=>item.track)
            .map(trackData => ({
              name: trackData.name,
              duration: trackData.duration_ms /1000
            }))
          })
         
          return playlists;
        })
        return playlistsPromise
      })
      .then(playlists => this.setState({  
        playlists: playlists.map(item=> {
          return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs: item.trackDatas.slice(0,3)
          }
        })    
      }))   
  }

  render() {

    let playListToRender = 
      this.state.user && 
      this.state.playlists 
        ? this.state.playlists.filter(playlist => {
          let matchesPlayList = playlist.name.toLowerCase()
              .includes(this.state.filterString.toLowerCase())
          let matchesSong = playlist.songs.find(song=> song.name.toLowerCase()
            .includes(this.state.filterString.toLowerCase()))
          return matchesPlayList || matchesSong
        }) : [];

    return (
      <div className="App">
        {this.state.user 
          ?
          <div>
            <h1 style={{ ...defaultStyle, 'fontSize': '54px' }}>
              {this.state.user.name}&rsquo;s Playlist
            </h1>
      
            <PlayListCounter playlists={playListToRender} />
            <HoursCounter playlists={playListToRender} />
            <Filter onTextChange={text => {
              this.setState({ filterString: text })
            }}/>
            {playListToRender.map((playlist, i) => 
              {return <Playlist playlist={playlist} key={i}/>}
            )}
            
          </div> 
          : <button onClick={() =>
              window.location = window.location.href.includes('localhost') 
              ? 'http://localhost:8888/login' 
              : 'https://proto-backend.herokuapp.com/login'           
            } 
              style={{ padding: '20px', fontSize: '50px', marginTop: '10px' }}>Sign in with Spotify</button>  
        }
      </div>
    );
  }
}

export default App;
