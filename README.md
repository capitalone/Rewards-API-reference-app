# Rewards API Reference Application Code
The Rewards API provides the ability to access a Capital One customer’s Rewards account balance, help them set and track to their savings goals, and enable insights to a customer’s “purchasing power” over a variety of available redemption opportunities.

## Software Requirements Including version
This is version 1.0 of the Rewards API Reference Application Code. 

## Build/Install Instructions
1. Download and install [Node]
2. Run `npm install` at the root folder to download dependencies
3. Update `config/config.js.sample` with the properties received from the developer portal and rename to `config/config.js`
3. Run `node app.js` to start the application
4. Navigate to http://localhost:3000/ in your browser
 
## Best Practices
We recommend you thoroughly review [Express Production Best Practices] for guidelines regarding Express apps. Things that are notably excluded from this reference app are:
* Database store for session cookies
* Use of TLS/HTTPS


## Roadmap
This reference app code is intended as a starting place for developers who want to use the Rewards API. As such, it will be updated with new functionality only when the Rewards API is updated with new functionality.

## Contributors
We welcome your interest in Capital One’s Open Source Projects (the “Project”). Any Contributor to the Project must accept and sign a CLA indicating agreement to the license terms. Except for the license granted in this CLA to Capital One and to recipients of software distributed by Capital One, You reserve all right, title, and interest in and to your Contributions; this CLA does not impact your rights to use your own contributions for any other purpose.

##### [Link to CLA] (https://docs.google.com/forms/d/19LpBBjykHPox18vrZvBbZUcK6gQTj7qv1O5hCduAZFU/viewform)

This project adheres to the [Open Source Code of Conduct][code-of-conduct]. By participating, you are expected to honor this code.

[code-of-conduct]: http://www.capitalone.io/codeofconduct/

### Contribution Guidelines
We encourage any contributions that align with the intent of this project and add more functionality or languages that other developers can make use of. To contribute to the project, please submit a PR for our review. Before contributing any source code, familiarize yourself with the Apache License 2.0 (license.md), which controls the licensing for this project.

[node]:<https://nodejs.org>
[Express Production Best Practices]:<http://expressjs.com/en/advanced/best-practice-security.html>
