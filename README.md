# Milestone 2 - Movie Explorer with Database

## Overview
This project allows the user to sign up with a username and password, the second of which will be hashed. 
They are added into a database, so each user can have a session of their own. Then, a random movie from a list is shown, 
and the user may leave a comment and ratings which will be displayed when the movie is reloaded. In the profile section, it allows the user to change or delete their comments. Sometimes the edit comments button must be double clicked.

## Running Requirements:

For this project, one needs an installation of python3.
		
		### Libraries needed: 
		
				I used dotenv, Flask, flask-login, flask-alchemy, and wikipedia-api. These dependencies were installed using pip3. I also used the 				MUI library for react configuration. This was installed on the website. I installed NPX and React through terminal. 
		
		### Authentication needed:
			
				A TMDB API key is needed to run this project. This can be obtained for free and with a developer account at https://www.themoviedb.org. One also needs a PostGres database
        This is deployed with heroku

## Problems and future improvements:

		What are at least 2 technical issues you encountered with your project? How did you fix them? 
    
   I had a huge issue with my changes not rendering, even though the object was changed. I fixed this through calling the rerendering function. However, when I first did this, my app was incredibly slow. I realized that I was making a call to the python server after every character change, so I changed each render to just work on the front end. 
    
    Another major issue was infinite looping of GetComments. I fixed this by changing the submit button from performing only {handleRating} to {() =>handleRating()}
    
  
  What was the hardest part of the project for you, across all milestones? What is the most useful thing you learned, across all milestones?
  
  Honestly, it's the same for both. I really hated databases at first. They made no sense to me and were very ethereal and hard to grasp. After struggling with them for so long in milestone 2, I feel I understand them fairly well. For my work at DICE lab, now I do a lot of my projects' database management, which I definitely could not have done a few weeks ago.
		
		
