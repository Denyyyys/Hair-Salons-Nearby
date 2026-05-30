# general setup
create .env file - for fast testing - copy everything from .env.dev to that file
you have to have docker installed on your machine with docker compose


# data collection
if you want to collect data using scraper on your own - you should have python installed firstly. 

then inside `data-collection` folder run:

```bash
python -m venv venv - create venv
```

.\venv\Scripts\Activate.ps1
.\venv\Scripts\activate
source venv/bin/activate

Common PowerShell issue

Sometimes PowerShell blocks scripts with an error like:

running scripts is disabled on this system

Fix (current user only):

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser


pip install -r requirements.txt


scraping booksy is better that google maps - i can get more data about each salon, also it would be faster than creating grid over google maps and then make request for each "cell" since this approach would take less time meaning that i can focus more on frontend or backend

decided to store to json since info about salons is usually very nested and json is good for storing this kind of data

## scraping process
so I manually navigated through booksy page and checked hair salons and detected that the URL for this is: https://booksy.com/pl-pl/s/fryzjer/3_warszawa. I also figured out that there is pagination (each page only lists up to 20 results), so i have to go to next pages for scraping all data - i noticed that when i go to the next page, URL parameter with name businessesPage is added, so if i go to the 4th page i go to the URL:
https://booksy.com/pl-pl/s/fryzjer/3_warszawa?businessesPage=4

also i inspected HTML, noticed that results are stored inside the div with id search-results, and each element is <li> elements inside of it, i inspected more html in order to understand how to get data which i need:
image URL - 
name - (sometimes from scraped items it has part of address, sometimes not - decided to leave it as it is, since i guess that bussiness owners want to have it in their URL)
address 

but it's not full data - i noticed that for exmaple there is no phone number, but after going to specific page for each salon, for example for Beauty Spot Ursynów URL looks like this:
https://booksy.com/pl-pl/82394_beauty-spot-ursynow_fryzjer_3_warszawa#ba_s=sr_1

I see more info, but they don't appear immediately after getting page - firstly it's only visible for logged in users (for not logged in users it showed message "Zaloguj się lub załóż konto na Booksy, aby skontaktować się z usługodawcą") and is rendered with a bit of delay, which was, as my suggestion, caused since frontend of Booksy is written in a way, that it fetches some resources using JS - so I used chrome developer tools to see what kind of requests are done when page was loading and after inspection one specific catched my eye - the one having structure like this https://pl.booksy.com/core/v2/customer_api/businesses/{business_id} - in the response i noticed that there is JSON object with structured data of business data, full_address, district (referred in document as neighborhood), phone number, and others - i also noticed trying to fetching this endpoint in postman that i get response if providing X-Api-Key header, but if i don't add X-Access-Token header - then i don't get all info (like phone number is absent), so after this analysis I could start writing my scrapper. So the final process would be following:
1. go to main page for hair salons in Warsaw and get list of results
2. 


## run scraper

cd .\data-collection\salons_scraper\

scrapy crawl booksy -a session_cookie=abc123

scrapy crawl booksy -a start_page=1 -a end_page=5

scrapy crawl booksy -a all_pages=true


scrapy crawl booksy_warsaw -a x_access_token="kHJEKBG6vwTtQEN8KivFvVHRcc9E5SEo" -a x_api_key="web-e3d812bf-d7a2-445d-ab38-55589ae6a121"

## what would add
more scraped data
more 


# backend


## what would add
possibility for bussiness owners to edit info about their own businesses or at least possibility for them to send admin a request about changing data about their business (for example email or contact phone number changed). 


## add info
only user with role admin can modify info about salon - when every user registers, it automatically gets role = "USER", so admin manually has to update his / her record in db and update its role to "ADMIN" - it requires manual actions, but it's made intentionally for security - this action is not frequent and allowing doing it from some API makes potential "loophole" for some hacker to escalate their permissions

modification of salon - can modify each property besides rating and reviewsCount (supposingly that it would be updated automatically via some other API which gathers reviews)

I added endpoints for registering and loggin in because i assume that we don't want any user to be able to modify our records - only authenticated ones. for simplicity, only users who has role "ADMIN" can do it - in the future I would add possibility for business owner to modify info about their salons but it would require extra verification if person who claims to be business owner is actually that owner, but for this project this approach is enough. For authentication/authorization i use JWT.

if you would like to modify backend and see results you can do it, but after changing you have to generate JAR from the level of folder `backend` using this command:
```sh
./gradlew bootJar
```

and then you have to force Docker to rebuild containers:
```sh
docker compose up --build
```

# frontend
So Next.js was suggested technology, so I used it on frontend.


## if used locally
inside `frontend` folder:
```sh
npm i
```

## to show
responsivness of frontend

## to delete
npx create-next-app@latest frontend --typescript

