
import './App.css';
import { React, useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
//import JsonDataDisplay from './jsonParser';
//import { render } from '@testing-library/react';


/*help from better.dev*/

function App() {
  let data = "";
  const [com, setCom] = useState(data);
  useEffect(() => { }, [com])

  async function getComments() {
    const response = await fetch('/get_comments');
    data = await response.json();
    console.log(Object.keys(data))



    let test_var = Object.keys(data).map((review) => (
      <li>
        {data[review].rating}: {data[review].comment} , {data[review].movie}
      </li>
    ))

    console.log(test_var)
    ReactDOM.render(test_var, document.getElementById('com'));

    return (null)
  }



  return (
    <div className="App">
      <h1>Backstage</h1>
      <div className="">
        <button onClick={getComments}>Edit Comments</button>
        <p id="com"></p>
      </div>
    </div>
  );
}

export default App;
