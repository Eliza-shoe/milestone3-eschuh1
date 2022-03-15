import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

/* help from better.dev and mui.com and pavel pov on discord */

function App() {
  let data = '';
  let deleted = {};

  function reducer(movieReviews, action) {
    switch (action.type) {
      case 'setValue':
        const movie = action.key;//eslint-disable-line
        const review = action.value;//eslint-disable-line
        const setMyReview = review; //eslint-disable-line
        return setMyReview;
      case 'setState':
        const newState = action.payload; //eslint-disable-line
        return newState;
      default:
        throw new Error();
    }
  }

  function initReducer() {
    fetchComments();//eslint-disable-line
    return null;
  }

  const [movieReviews, setReview] = React.useReducer(reducer, null, initReducer);

  async function fetchComments() {
    console.log('fetch here');
    const response = await fetch('/get_comments');//eslint-disable-line
    data = await response.json();
    setReview({ type: 'setState', payload: data });

    await GetComments();//eslint-disable-line
    return null;
  }

  function handleDelete(review) {
    deleted[review] = '';
    ReactDOM.render('Your comment will be deleted after submission', document.getElementById('del'));//eslint-disable-line
    GetComments();//eslint-disable-line
  }

  async function handleSubmit() {
    const deleteFetch = fetch( //eslint-disable-line
      '/delete_reviews',
      { method: 'POST', body: JSON.stringify(deleted) },
    ).then(fetchComments());
    await deleteFetch;
    const updateFetch = fetch(//eslint-disable-line
      '/update_reviews',
      { method: 'POST', body: JSON.stringify(movieReviews) },
    );

    ReactDOM.render('Your reviews have been updated. Press Edit Reviews to see changes', document.getElementById('del'));//eslint-disable-line
    deleted = {};
    return null;
  }

  async function GetComments() {
    const handleRating = (review) => (event) => {
      const newValue = movieReviews[review];
      newValue.rating = Number(event.target.value);
      setReview({ type: 'setValue', key: review, value: newValue });
      GetComments();
    };

    const handleComment = (review) => (event) => {
      const newValue = movieReviews[review];
      newValue.comment = event.target.value;
      setReview({ type: 'setValue', key: review, value: newValue });
      GetComments();
    };

    if (movieReviews === null) {
      const failScreen = (<div><header> Click Edit Reviews</header></div>); //eslint-disable-line
      ReactDOM.render(failScreen, document.getElementById('com'));//eslint-disable-line
      return null;
    }

    const Boxes = Object.keys(movieReviews).map((review) => (

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        {' '}
        <div>
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
            type="number"
            multiline
            maxRows="1"
            value={movieReviews[review].rating}
            onChange={handleRating(review)}
            max="5"
          />
          <Button
            onClick={() => {
              handleDelete(review);
            }}
          >
            Delete
          </Button>

        </div>
      </Box>

    ));

    const submitButton = (
      <button onClick={function () { handleSubmit(); }}> Submit Changes</button>);//eslint-disable-line

    ReactDOM.render(Boxes, document.getElementById('com'));//eslint-disable-line
    ReactDOM.render(submitButton, document.getElementById('submit'));//eslint-disable-line
    return (null);
  }

  return (// cannot disable eslint error on line 143
    <div className="App">
      <h1>My Backstage</h1>
      <div className="Edit Reviews">
        <button type="button" onClick={() => fetchComments()}>Edit Reviews</button>
        <p id="com" />
        <p id="submit" />
        <p id="del" />
      </div>
    </div>
  );//eslint-disable-line
}
export default App;
