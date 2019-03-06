# instagram-poster
CLI to post images to Instagram using Puppeteer.  
The goal of this project is to make it easy to programatically post an image to Instagram with a caption.

## Example
```
node index.js -username myemail@mydomain.com -password mysecurepassword -image /Users/me/Desktop/mypic.jpg -caption "Check out my picture"
```

## Usage
```
node index.js --username <username> --password <password> --image <image_path (jpeg/jpg only)> [-caption <caption>]
```

## Setup
1. Make sure you have node and npm installed
2. Clone this repository
3. `cd` to this repository
4. run `npm install`
5. You should be able to run the program now

## Notes
* The image path will be relative to the directory you are in when you run the program.
* Instagram only allows jpeg/jpg images
* The only way to upload an image to instagram outside of their app is on their mobile site. This program simulates the mobile experience on your computer.
