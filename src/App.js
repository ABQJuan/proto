import React, { Component } from 'react';

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
            duration: 90
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
      return Math.round((sum + eachSong.duration) / 60);
    }, 0);
    return (
      <div style={{ ...defaultStyle, width: "40%", display: 'inline-block' }}>
        <h2>{totalDuration} hours</h2>
      </div>

    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div>
        <img src="" alt="" />
        <input type="text" onKeyUp={e=>this.props.onTextChange(e.target.value)}/>
        <span style={defaultStyle}>Filter</span>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist= this.props.playlist;
    
    return (
      <div style={{ ...defaultStyle, display: 'inline-block', width: '25%' }}>
        <img src="" alt="" />
        
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map((song,i)=>{
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
    setTimeout(() => {
      this.setState({ serverData: fakeServerData })
    }, 1000);
  }

  render() {
    return (
      <div className="App">
        {this.state.serverData.user ?
          <div>
            <h1 style={{ ...defaultStyle, 'fontSize': '54px' }}>
              {this.state.serverData.user.name}&rsquo;s Playlist
            </h1>

            <PlayListCounter playlists={this.state.serverData.user.playlists} />
            
            <HoursCounter playlists={this.state.serverData.user.playlists} />
            
            <Filter onTextChange={text=> {
              this.setState({filterString: text})}
            }/>
           
            {this.state.serverData.user.playlists.filter(playlist => 
              playlist.name.toLowerCase().includes(this.state.filterString.toLowerCase())
            ).map((playlist,i) => {
              return <Playlist playlist = {playlist} key={i} />}
            )}
                         
          </div> : <h1 style={{ ...defaultStyle, 'fontSize': '25px' }}>Loading...</h1>
        }
      </div>
    );
  }
}

export default App;
