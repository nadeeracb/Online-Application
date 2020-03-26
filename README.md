## An ORM framework for Google Apps Script

This framework allows you to easily integrate Google Sheet with your web application (GAS). You just need to add one row top of the all rows in the spreadsheet with relavant column names.
Those columns names will be your object keys. A sample spreadsheet attached herewith [1].

1\. https://docs.google.com/spreadsheets/d/1uM-QIUoCSRJcrhx3THBmDajxUbaxiOdMRYpiBoill-Q/edit?usp=sharing

### How to use this framework ?

This is very easy to use. Only following code you need to use.

```
 DatabaseOperations.cacheEnabled = false;
 DatabaseOperations.initilizeDatabase('1uM-QIUoCSRJcrhx3THBmDajxUbaxiOdMRYpiBoill-Q'); // specify your spreadsheet ID
 DatabaseOperations.openDatabaseConnection('mytable'); // specify your sheet name
 const foundObj = DatabaseOperations.queryDatabase('KEY:NIC === "92165445V" && KEY:RegNo === "S/10/586"'); // this is how you make a query. Make sure to use "KEY:" prefix for all keys
 //const newObject = DatabaseOperations.cloneObject(foundObj); // This is how you clone Object
 // newObject.RegNo = 'S/10/588'; // this is how you change properties
 // DatabaseOperations.updateItem(foundObj, newObject); // this is how you update a row in spreadsheet
 // DatabaseOperations.deleteItem(foundObj); // this is how you delete a row in spreadsheet

 // foundObj.RegNo = 'S/10/587';
 // DatabaseOperations.saveItem(foundObj); // this is how you save a new row in spreadsheet
 console.log(`found item : ${JSON.stringify(foundObj)}`);
```

The MIT License. Developed by **[Lahiru J Ekanayake](https://lk.linkedin.com/in/lahirujekanayake)**. Faculty of Science, University of Peradeniya.
Developed on top of app-script-starter and that credit should go to the original author.

![Google Apps Script Development with ES6](https://digitalinspiration.com/images/google-apps-script-development.png)

## Google Apps Script Development 💯

<img alt="Google Developers Expert - Google Apps Script, GSuite" align="right" height="125" src="https://i.imgur.com/4URbCoDl.png">

Please follow the 👉 **[step-by-step video tutorial](https://www.youtube.com/watch?v=KxdCIbeO4Uk)** 👈 for quickly getting started with Apps Script development inside Visual Studio Code.

You can build GSuite add-ons (for Google Docs, Slides, Gmail and Google Sheets), web applications and workflow automation routines with next-generation JavaScript.

## Build with Google Apps Script 🚀

Setting up a modern development environment for building Google Apps Script projects is easy and quick (**[video tutorial](https://www.youtube.com/watch?v=KxdCIbeO4Uk)**).

You also need to install Node.js which includes the npm package manager.

![Google Apps Script - Setup Development Environment](https://www.labnol.org/media/npm-install.gif)

### :package: Getting Started

1\. Clone the repository and install npm dependencies

```
git clone https://github.com/fosuop/appscript-project-template
cd my-project
npm install
```

2\. Log in to Google clasp and authorize with your Google account.

```
npx clasp login
```

3\. Create a new Google Script bound to a Google Sheet (or set the type as standalone to create a standalone script in your Google Drive)

```
npx clasp create --type sheets --title "My Apps Script Project" --rootDir ./dist
```

4\. Include the necessary [OAuth Scopes](https://github.com/labnol/apps-script-starter/blob/master/scopes.md) in the [appsscript.json](https://github.com/labnol/apps-script-starter/blob/master/appsscript.json) file

5\. Deploy the project

```
npm run deploy
```

The `dist` directory contains the bundled code that is pushed to Google Apps Script.

### The .claspignore file

The `.claspignore` file allows you to specify file and directories that you do not wish to not upload to your Google Apps Script project via `clasp push`.

The default `.claspignore` file of the Apps Script Starter kit will push all the JS and HTML inside the `rootDir` folder and ignore all the other files.

## :beginner: Using Git with Google Apps Script

![Google Apps Script - Github](https://www.labnol.org/media/github-apps-script.png)

Create a new repository in Github and make a note of the URL of the new repository. Next, open the terminal and run the above commands to push your Apps Script project to Github.

### :star2: Credit/Acknowledgment

#### Babel

Write code using ES6 features like arrow functions, destructuring, classes, template literals, and the Babel transpiler will transform your ECMAScript 2015/2017 code to ES5 that Apps Script can understand.

#### Webpack

Webpack is a powerful tool for bundling JavaScript modules. Developers can structure code in directory and Webpack creates a minimized and optimized bundle for pushing to production.

#### ESLint

A popular linting engine that analyzes your JavaScript code for correctness and highlights the errors in real time before you even compile the code, thus reducing the development time.

#### Google CLASP

A command line utility for working with Google Apps Script projects. You can develop code locally and push it to production, manage your manifest file, deploy web apps and publish new versions of apps.

#### Visual Studio Code

This incredibly powerful source code editor from Microsoft provides an integrated development environment and has built-in support for Emmet, Intellisense for code autocompletion, Command Line Terminal, Git integration, Node.js , TypeScript and more.

#### Prettier

A code formatter that will beautify your JavaScript, JSON, HTML and CSS stylesheets according to a set of rules and styles widely accepted by programmers.

#### Airbnb

Developers have their own unique style of writing code. [Airbnb's JavaScript style guide](https://github.com/airbnb/javascript/blob/master/README.md#airbnb-javascript-style-guide-) outlines how JavaScript code should be written and adheres to the rules.
