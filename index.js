/**
 * Script to post an image to instagram with Puppeteer
 * Author: James Grams
 * Date: 3/6/2019
 */

 /************* Set Up *************/

// Require Puppeteer
const puppeteer = require('puppeteer');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');

// iPhone 6 user agent
const USER_AGENT = "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25";
const REQUIRED_ARGS = ['username', 'password', 'image'];
const INSTAGRAM_LOGIN_URL = "https://instagram.com/accounts/login";
const INSTAGRAM_URL = "https://instagram.com";

/************* Main Program *************/

// Make sure we have the required arguments
for( let arg of REQUIRED_ARGS ) {
    if( !(arg in argv) ) {
        console.log("Please specify a " + arg);
        fail();
    }
}

// Make sure the image exists and is a jpeg/jpg
if( ! (argv.image.toLowerCase().endsWith("jpg") || argv.image.toLowerCase().endsWith("jpeg")) ) {
    console.log("Instagram only accepts jpeg/jpg images.");
    fail();
}

// Make sure the image exists on the user's computer
if (! fs.existsSync(argv.image)) {
    console.log("The image you specified does not exist.");
    fail();
}

// We are good to go
run();

/************* Functions *************/

/**
 * Run the program.
 */
async function run() {

    console.debug("launching puppeteer");

    // Configure puppeteer options
    let options = {
        defaultViewport: {
            width: 320,
            height: 570 
        }
    };
    if( argv.executablePath ) {
        options.executablePath = argv.executablePath;
    }

    // Get the browser
    let browser = await puppeteer.launch( options );

    // Get the page
    let page  = await browser.newPage();

    // Instagram only allows posting on their mobile site, so we have to pretend to be on mobile
    page.setUserAgent(USER_AGENT);

    console.debug("visiting the instagram login page");

    // Go to instagram.com
    await page.goto(INSTAGRAM_LOGIN_URL);

    console.debug("waiting for the username input");

    // Wait for the username input
    await page.waitForSelector("input[name='username']");
    await page.waitFor(250);

    console.debug("typing in the username and password");

    // Get the inputs on the page
    let usernameInput = await page.$("input[name='username']");
    let passwordInput = await page.$("input[name='password']");

    // Type the username in the username input
    await usernameInput.click();
    await page.keyboard.type(argv.username);

    // Type the password in the password input
    await passwordInput.click();
    await page.keyboard.type(argv.password);

    console.debug("clicking log in");

    // Click the login button
    let button = await page.$x("//div[contains(text(),'Log in')]//..");
    await button[0].click();

    // Make sure we are signed in
    await page.waitForNavigation();

    console.debug("going to instagram home");

    // They may try to show us something but just go straight to instagram.com
    await page.goto(INSTAGRAM_URL);

    console.debug("waiting for the file inputs");

    // Wait until everything is loaded
    await page.waitForSelector("input[type='file']");

    // Set the value for the correct file input (last on the page is new post)
    let fileInputs = await page.$$('input[type="file"]');
    let input = fileInputs[fileInputs.length-1];

    console.debug("clicking new post");

    // Upload the file
    // Note: Instagram seems to have a check in place to make sure you've viewed the file upload dialog, 
    // so we have to open it here.
    await page.click("span[aria-label='New Post']"); 
    await page.waitFor(250);

    console.debug("uploading the image");

    await input.uploadFile(argv.image);
    await page.waitFor(250);

    console.debug("waiting for next");

    // Wait for the next button
    await page.waitForXPath("//button[contains(text(),'Next')]");

    console.debug("clicking next");

    // Get the next button
    let next = await page.$x("//button[contains(text(),'Next')]");
    await next[0].click();

    console.debug("adding the caption");

    if(argv.caption) {
        // Wait for the caption option
        await page.waitForSelector("textarea[aria-label='Write a caption…']");

        // Click the caption option
        await page.click("textarea[aria-label='Write a caption…']");

        // Type
        await page.keyboard.type(argv.caption);
    }

    console.debug("waiting for share");

    // Get the share button and click it
    let share = await page.$x("//button[contains(text(),'Share')]");

    console.debug("clicking share");

    await share[0].click();

    console.debug("finishing up");

    // Wait for a little while before finishing
    await page.waitFor(5000);

    // Close
    await browser.close();

    console.log("the post was made successfully");
}

/**
 * Print the correct usage of this program.
 */
function usage() {
    console.log("Usage: node index.js --username <username> --password <password> --image <image_path (jpeg/jpg only)> [-caption <caption>]");
}

/**
 * Exit the program with an error
 */
function fail() {
    usage();
    process.exit(1);
}