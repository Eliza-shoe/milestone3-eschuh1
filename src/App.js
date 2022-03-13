
import './App.css';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FormControlUnstyled } from '@mui/base';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { selectOptions } from '@testing-library/user-event/dist/select-options';

/*help from better.dev and mui.com*/



function App() {
  let data = "";

  function render() {
    fetchComments().then(jsonData => setReview({ type: 'setState', payload: jsonData })).then(_ => GetComments())
  }

  function reducer(movieReviews, action) {

    switch (action.type) {
      case 'setValue':
        let movie = action.key
        let review = action.value
        movieReviews[movie] = review
        movieReviews = { ...movieReviews }
        console.log(movieReviews)
        return movieReviews
      case 'setState':
        movieReviews = initReducer(action.payload)
        console.log(action)
        return movieReviews
      default:
        console.log(action)
        throw new Error();
    }

  }

  function initReducer(data) {
    return data
  }

  const [movieReviews, setReview] = React.useReducer(reducer, null, initReducer)

  async function fetchComments() {
    const response = await fetch('/get_comments');
    data = await response.json();
    console.log(data)
    console.log("fetch comments")
    return data
  }

  async function GetComments() {

    /*const handleUpdate = (kvpair) => {
      dispatchEvent({ type: 'setValue', key: kvpair[0], value: kvpair[1] }) //maybe need to set target to setReview
    } */

    const handleRating = review => (event) => {
      let newValue = movieReviews[review]
      newValue.rating = Number(event.target.value)
      setReview({ type: 'setValue', key: review, value: newValue })
      render()
    };

    const handleComment = review => (event) => {
      let newValue = movieReviews[review]
      newValue.comment = event.target.value
      setReview({ type: 'setValue', key: review, value: newValue })
      render()
    };

    if (movieReviews === null) {
      let failScreen = (
        <div>
          <header> Please click again</header>
        </div>
      )
      ReactDOM.render(failScreen, document.getElementById('com'));
      return null
    }
    console.log(movieReviews)
    let Boxes = Object.keys(movieReviews).map((review) => (

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      > <div>
          <TextField
            id="CommentBox"
            key={review}
            label={movieReviews[review].movie}
            multiline
            maxRows={4}
            value={movieReviews[review].comment}
            onChange={handleComment(review)}

          />
          <TextField
            id="RatingBox"
            multiline
            maxRows={1}
            value={movieReviews[review].rating}
            onChange={handleRating(review)}

          />
        </div>
      </Box>

    ))

    ReactDOM.render(Boxes, document.getElementById('com'));

    return (null)
  }

  return (
    <div className="App">
      <h1>My Backstage</h1>
      <div className="">
        <button onClick={function () {
          { render() }
        }}
        >Edit Comments</button>
        <p id="com"></p>
      </div>
    </div>
  );
}


export default App;
