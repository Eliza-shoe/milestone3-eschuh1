# Milestone 2 - Movie Explorer with Database

## Overview
This project allows the user to sign up with a username and password, the second of which will be hashed. 
They are added into a database, so each user can have a session of their own. Then, a random movie from a list is shown, 
and the user may leave a comment and ratings which will be displayed when the movie is reloaded.

## Running Requirements:

For this project, one needs an installation of python3.
		
		### Libraries needed: 
		
				I used dotenv, Flask, flask-login, flask-alchemy, and wikipedia-api. All dependencies were installed using pip3. 
		
		### Authentication needed:
			
				A TMDB API key is needed to run this project. This can be obtained for free and with a developer account at https://www.themoviedb.org. 
        This is deployed with heroku

## Problems and future improvements:

		What are at least 2 technical issues you encountered with your project? How did you fix them? 
    
    My biggest problem was honestly with the database. I spent hours trying to figure out what was wrong with my code and why it wasn't working when I added a table, but I just needed to fully reset the database as for some reason terminal was not working to clear it. Through spending so long trying to fix my mode, I did end up with a much cleaner class structure of which I am proud.
    
    Another major issue was referencing the current movie when updating the comment list. I don't keep track of the current movie, so I spent awhile trying to figure out how to connect the movie and the comment if the function isn't aware of the movie. After awhile of searching documentation and stack overflow, I learned of hidden form variables, so I could pass my jinja from my html file back to the functions I needed it in.
    
  How did your experience working on this milestone differ from what you pictured while working through the planning process? What was unexpectedly hard? Was anything unexpectedly easy?
  I definitely did not expect so much trouble with the databases, and felt pretty silly after spending so long on something that could've been fixed by a button in my heroku account. 
  
  I actually found the login and form management much more intuitive than I expected, so that went by pretty quickly. 
		
		
