# Washington Post News Scraper

Please visit https://nameless-retreat-61091.herokuapp.com/ for a demo.

This application is a web scraper which scrapes news articles from the Washington Post website using MongoDB,
and is deployed using Heroku. This application also used the following NPM packages:
- Express
- Axios
- Request
- Body-Parser
- Cheerio

When the user visits the application's <b>home page</b> they will see the following web page:

![Scraper](/public/assets/images/homePage.png)

When the user clicks on the Scrape New Articles button, the website will be scraped to determine
if there are any new articles to view. If articles are available the user will receive an alert 
indicating how many articles were scraped.

![Scraper](/public/assets/images/scraped.png)

Once the user clicks the Save Article button the article will be moved to the Saved Article page.
The user can view the saved articles by clicking the Saved Article button in the navigation bar.

![Scraper](/public/assets/images/saved.png)

From the Saved Article page, the user can either add an article note, or delete the article
from the list of saved articles. The article notes remain until the user chooses to delete them.

![Scraper](/public/assets/images/notes.png)

When all articles have been deleted from the Saved Article page the user will receive a message
indicating there are no saved articles and provide a button for the user to navigate back to the 
home page to review any articles they would like to save. 

![Scraper](/public/assets/images/deleted.png)

Lastly there is also space for testimonials and contact information at the bottom of the home page.



This application was deployed using Heroku and the dotenv npm package was used to protect
sensitive information. 

This project is useful because it bridges a gap between those in need who are often unable
to obtain the services they need due to outdated information. Agencies who choose to participate
in our application will be inputting their data in real-time which will decrease or eliminate an
already frustrated population with coming face-to-face with dead-ends and more quickly connecting 
them with the services they need. 

