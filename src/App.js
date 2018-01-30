import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


let defaulTextColor = '#fff';
let defaultStyle = {
  color: defaulTextColor

};


class Aggregate extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block' }}>
        <h2>Number Text</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div>
        <img src="" alt="" />
        <input type="text" />
        <span style={defaultStyle }>Filter</span>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    return (
      <div style={{...defaultStyle, display:'inline-block', width:'25%'}}>
        <img src="" alt="" />
        <h3>Playlist Name</h3>
        <ul>
          <li>Song 1</li>
          <li>Song 2</li>
          <li>Song 3</li>
        </ul>
      </div>

    );
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 style={{ color: defaulTextColor }}>Title</h1>
        <Aggregate />
        <Aggregate />
        <Filter />
        <Playlist />
        <Playlist />
        <Playlist />
        <Playlist />
        
      </div>
    );
  }
}

export default App;
