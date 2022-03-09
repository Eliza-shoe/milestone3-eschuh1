import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom'

function App() {

  function handleClick() {
    const new_fact = fetch('/fun_fact').then(response => response.json())
      .then(data => {
        ReactDOM.render(data,
          document.getElementById("fact-of-the-day"));
      });
    return new_fact;
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={handleClick}>Gimme a fact!</button>
        <p id="fact-of-the-day"></p>
      </header>
    </div>
  );
}

export default App;
