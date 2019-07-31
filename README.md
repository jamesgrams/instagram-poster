# instagram-poster
CLI to post images to Instagram using Puppeteer.  
The goal of this project is to make it easy to programatically post an image to Instagram with a caption.

## Example
```
node index.js -username myemail@mydomain.com -password mysecurepassword -image /Users/me/Desktop/mypic.jpg -caption "Check out my picture"
```

## Usage
```
node index.js --username <username> --password <password> --image <image_path (jpeg/jpg only)> [-caption <caption>] [-executablePath <chrome_path>] [-agent <user_agent>]
```

## Setup
1. Make sure you have node and npm installed
2. Clone this repository
3. `cd` to this repository
4. If you already have Chrome/Chromium installed, and you want to use that version, run `export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`
5. run `npm install`
6. You should be able to run the program now
7. If you opted to use your previously installed version of Chrome in step 4, make sure you specify your path to Chrome when you run the program

## Notes
* The image path will be relative to the directory you are in when you run the program.
* Instagram only allows jpeg/jpg images
* The only way to upload an image to instagram outside of their app is on their mobile site. This program simulates the mobile experience on your computer.
* If you are running on a Raspberry Pi, change the puppeteer version in package.json to 1.2.0 to work with the Chromium Browser for Raspbian. You should also use a custom executable path to point to Chromium Browser, since the Chromium that comes with Puppeteer does not work on Raspbian.
