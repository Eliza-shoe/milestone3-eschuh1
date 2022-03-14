
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


/*help from better.dev and mui.com and pavel pov on discord*/






function App() {
  let data = "";
  let deleted = {};

  function reducer(movieReviews, action) {

    switch (action.type) {
      case 'setValue':
        console.log("Setting value")
        let movie = action.key
        let review = action.value
        movieReviews[movie] = review
        return movieReviews
      case 'setState':
        console.log("logging payload")
        console.log(action.payload)
        console.log("logging state 1")
        console.log(movieReviews)
        movieReviews = action.payload
        console.log("logging state 2")
        console.log(movieReviews)
        //GetComments()
        return action.payload
      default:
        throw new Error();
    }

  }

  function initReducer() {
    fetchComments()
    return null
  }


  const [movieReviews, setReview] = React.useReducer(reducer, null, initReducer)

  async function fetchComments() {
    console.log("calling fetchComments here")
    const response = await fetch('/get_comments');
    data = await response.json();
    setReview({ type: 'setState', payload: data })

    console.log("logging state")
    console.log(movieReviews)
    await GetComments()
    return null
  }

  async function GetComments() {

    const handleRating = review => (event) => {
      let newValue = movieReviews[review]
      newValue.rating = Number(event.target.value)
      setReview({ type: 'setValue', key: review, value: newValue })
      GetComments()
    };

    const handleComment = review => (event) => {
      let newValue = movieReviews[review]
      newValue.comment = event.target.value
      setReview({ type: 'setValue', key: review, value: newValue })
      GetComments()
    };

    if (movieReviews === null) {
      let failScreen = (
        <div>
          <header> Click Edit Reviews</header>
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
    }}>Submit Changes</button>

    ReactDOM.render(Boxes, document.getElementById('com'));
    ReactDOM.render(submitButton, document.getElementById('submit'));
    return (null)
  }

  function handleDelete(review) {
    deleted[review] = ''
    ReactDOM.render("Your comment will be deleted after submission", document.getElementById('del'));
    GetComments()
  }

  async function handleSubmit() {

    const deleteFetch = fetch('/delete_reviews',
      { method: 'POST', body: JSON.stringify(deleted), }).then(_ => console.log("Deleted reviews")).then(_ => fetchComments())
    await deleteFetch;
    console.log("After returning fetch:")
    const updateFetch = fetch('/update_reviews',
      { method: 'POST', body: JSON.stringify(movieReviews), })


    ReactDOM.render("Your reviews have been updated. Press Edit Reviews to see changes", document.getElementById('del'));
    deleted = {}
    return null;
  }


  return (
    <div className="App">
      <h1>My Backstage</h1>
      <div className="Edit Reviews">
        <button onClick={function () {
          { fetchComments(); }
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
