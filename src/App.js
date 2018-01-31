import React, { Component } from 'react';
import queryString from 'query-string';
import './App.css';


let defaultStyle = {
  color: '#fff',
};



let fakeServerData = {
  user: {
    name: "John",
    playlists: [
      {
        name: "My favorites",
        songs: [
          {
            name: 'Beat It',
            duration: 150
          },
          {
            name: 'Cannilloni Makaroni',
            duration: 123
          },
          {
            name: 'Rosa Helikopter',
            duration: 142
          }
        ]
      },
      {
        name: "60's favorites",
        songs: [
          {
            name: 'Stand By Me',
            duration: 145
          },
          {
            name: 'The Wanderer',
            duration: 154
          },
          {
            name: "I'm a Believer",
            duration: 123
          }
        ]
      },
      {
        name: "Disco Mania",
        songs: [
          {
            name: 'Last Dance',
            duration: 132
          },
          {
            name: 'Dicso Inferno',
            duration: 101
          },
          {
            name: 'We Are Family',
            duration: 99
          }
        ]
      },
      {
        name: "90's Best",
        songs: [
          {
            name: 'Smells Like Teen Spirit',
            duration: 900
          },
          {
            name: 'Wannabe',
            duration: 111
          },
          {
            name: '...Baby One More Time',
            duration: 122
          }
        ]
      }

    ]

  }
}

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
    //console.log(allSongs);
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return (sum + eachSong.duration);
    }, 0);
    //console.log(totalDuration);
    return (
      <div style={{ ...defaultStyle, width: "40%", display: 'inline-block' }}>
        <h2>{Math.round(totalDuration / 60)} minutes</h2>
      </div>

    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div>
        <img src="" alt="" />
        <input type="text" onKeyUp={e => this.props.onTextChange(e.target.value)} />
        {/*<span style={defaultStyle}>Filter</span>*/}
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;

    return (
      <div style={{ ...defaultStyle, display: 'inline-block', width: '25%' }}>
        <img src={playlist.imageUrl} style={{width:'160px',marginTop:'20px'}} />

        <h3>{playlist.name}</h3>
        <ul>
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
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json(
    )).then(data => this.setState({  
        playlists: data.items.map(item=> {
          return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs:[]
          }
        })    
      }))   
  }

  /*setTimeout(() => {
      this.setState({ serverData: fakeServerData })
    }, 1000);*/

  render() {

    let playListToRender = 
      this.state.user && 
      this.state.playlists 
        ? this.state.playlists.filter(playlist =>
          playlist.name.toLowerCase().includes(
          this.state.filterString.toLowerCase())) 
        : [];

    return (
      <div className="App">
        {this.state.user 
          ?
          <div>
            <h1 style={{ ...defaultStyle, 'fontSize': '54px' }}>
              {this.state.user.name}&rsquo;s Playlist
            </h1>
      
            <PlayListCounter playlists={playListToRender} />
            {/*<HoursCounter playlists={playListToRender} />*/}
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
              : 'https://mpjdavid.herokuapp.com/login'           
            } 
              style={{ padding: '20px', fontSize: '50px', marginTop: '10px' }}>Sign in with Spotify</button>  
        }
      </div>
    );
  }
}


export default App;
