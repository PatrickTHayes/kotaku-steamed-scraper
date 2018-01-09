# kotaku-steamed-scraper
utilizing nodejs, cheerio, express, handlebars, request, body-parser, and mongoose; This app will scrape articles from the front page of kotaku's steamed section and store to a database. It also allows users to leave a comment and update that comment on each article.

Notes: Kotaku steamed only has links to images on first two articles before dynamically loading the rest. 
So only the top articles scrape will have an image included on their card.

Options to view in JSON format: notes, articles, or articles with notes.

cards hide content outside of the title until clicked to reveal content, note field input, fixed action button, and the current note on the article if it exists
