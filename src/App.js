
import './App.css';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FormControlUnstyled } from '@mui/base';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/material/Button';

/*help from better.dev and mui.com and pavel pov on discord*/



function App() {
  let data = "";
  let deleted = {};

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
        return movieReviews
      default:
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
    return data
  }

  async function GetComments() {

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
            label="rating"
            multiline
            maxRows={1}
            value={movieReviews[review].rating}
            onChange={handleRating(review)}

          />
          <Button
            onClick={() => {
              { handleDelete(review) };
            }}>Delete
          </Button>

        </div>
      </Box>

    ))

    let submitButton = <button onClick={function () {
      { handleSubmit() }
    }} endIcon={<SendIcon />}>Submit Changes</button>

    ReactDOM.render(submitButton, document.getElementById('com'));
    ReactDOM.render(Boxes, document.getElementById('submit'));
    ReactDOM.render(submitButton, document.getElementById('com'));
    return (null)
  }

  function handleDelete(review) {
    deleted.push(review);
    console.log(deleted);
    ReactDOM.render("Your comment will be deleted after submission", document.getElementById('del'));
  }

  function handleSubmit() {
    console.log("reviewList1")
    console.log(movieReviews)
    console.log("Stringified")
    console.log(JSON.stringify(movieReviews))
    console.log(deleted)
    fetch('/update_reviews',
      { method: 'POST', body: JSON.stringify(movieReviews), })

    //fetch('/delete_reviews',
    //  { method: 'POST', body: str(deleted), })
    return null;



  }


  return (
    <div className="App">
      <h1>My Backstage</h1>
      <div className="Edit Reviews">
        <button onClick={function () {
          { render() }
        }}
        >Edit Reviews</button>
        <p id="com"></p>
        <p id="submit"></p>
        <p id="del"></p>

      </div>
    </div>
  );
}


export default App;
