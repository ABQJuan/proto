import React, { Component } from 'react';
import 'reset-css/reset.css';
import queryString from 'query-string';
import './App.css';


const defaultStyle = {
  color: '#fff',
  'fontFamily': "'Lucida Sans Unicode', 'Lucida Grande', sans-serif"
};


class PlayListCounter extends Component {
  render() {
    let playListStyle = {
      ...defaultStyle, 
      width: "40%", 
      display: 'inline-block',
      margin: '0 0 20px 0',
      'fontSize':'24px',
      'lineHeight': '1.5rem'
    }
    return (
      <div style={playListStyle}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let minOrhrs;  
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, []);
   
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return (sum + eachSong.duration);
    }, 0);
    
    let hourCounterStyle = {
      ...defaultStyle, 
      width: "40%", 
      display: 'inline-block',
      margin: '0 0 20px 0',
      'fontSize': '24px'
    }
  
    if (Math.round(totalDuration / 60)>60){
      console.log((totalDuration / 3600).toFixed(2));
      totalDuration=(totalDuration / 3600).toFixed(2);
      minOrhrs = 'hours';
    } else {
      totalDuration = (totalDuration / 60).toFixed(1);
      minOrhrs = 'minutes';
    }
    return (
      <div style={hourCounterStyle}>
        <h2>{totalDuration} {minOrhrs}</h2>
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
      border:"none",
      
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
      /*display: "inline-block",*/
      width: "31%",
      color:"#333",
      background:"#ccc",
      border: "1px #333 solid",
      borderRadius: "5px",
      margin: "20px 10px 5px 10px",
      overflow: "hidden",
      boxShadow: "0 1px 5px rgba(255,255,255,0.6)",
      maxHeight: "auto",
      border:"none"
    }
    let ulStyle = {
      listStyle:'square',
      textAlign:'center',
      fontSize:'0.9rem',
      padding: '3px'

    }

    let imgStyle = {
      width:"100%",
      height:"auto"
    }
    
    
    
    let h3Style = {
      "padding":"2px 0",
      fontWeight:'bold',
      textAlign:'center',
      fontSize:'1.1rem'
    }

    return (
      <div className="playList" style={playlistStyle}>
        <img style={imgStyle} src={playlist.imageUrl}  alt="Test"/>
        <h3 style={h3Style}>{playlist.name}</h3>
        <ul style={ulStyle}>
          {playlist.songs.map((song, i) => {
            return <li key={i}>{(song.name).substring(0,30)}</li>
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

    let h1Style ={ 
      ...defaultStyle, 
      'fontSize': '54px',
      'margin':'2rem 0',
      textAlign:'center',
     }
     let filterStyle={
       
     }

    return (
      <div className="App">
        {this.state.user 
          ?
          <div>
            <h1 style={h1Style}>
              {this.state.user.name}&rsquo;s Playlist
            </h1>
      
            <PlayListCounter playlists={playListToRender} />
            <HoursCounter playlists={playListToRender} />
            <Filter style={filterStyle} onTextChange={text => {
              this.setState({ filterString: text })
            }}/>
            {playListToRender.map((playlist, i) => 
              {return <Playlist className="Playlist" playlist={playlist} key={i}/>}
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
