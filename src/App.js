
import './App.css';
import { React, useState, useEffect } from 'react';
import ReactDOM from 'react-dom'

function App() {

  function Header() {
    Return(
      <header>
        <h1>{props.title}</h1>
      </header>
    );
  }

  function editComments() {
    const commentList = fetch('/get_comments').then(response => response.json())
      .then(data => {
        ReactDOM.render(data,
          document.getElementById("seeComments"));
      });
    return commentList;
  }

  function listComments() {


  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Backstage</h1>
        <button onClick={seeComments}>Edit Comments</button>
        <p id="commentList"></p>
      </header>
    </div>
  );
}

export default App;
