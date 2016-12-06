# schedule-me

Schedule-me is a schedule management application for service-oriented businesses that allows them to streamline their schedules, plan their employees' weekly schedules and allow clients to make appointments with employees. As an admin, manage multiple business and employee schedules in one place and set customizable appointment options. As an employee, manage multiple work schedules and make appointments with clients.

Visit live demo [here](http://ec2-54-183-97-115.us-west-1.compute.amazonaws.com:8000)!

![alt text](/../readme/scheduleme_screenshot.png?raw=true)

## Built with

Angular 2</br>
Node.js</br>
Express.js</br>
PostgreSQL/Sequelize</br>
Bootstrap</br>

## Local setup

### Pre-requisites

This repo uses node's package manager. To check if node is installed, type ```node -v``` from the terminal, and the version number should appear if node is available. To install node on Mac OS, run:
```
$ brew install node
```
Note, this app with built with the Angular 2 CLI, to install globally, run:
```
$ npm install -g angular-cli
```
### Run application

Create a local copy of this repo on your desktop:
```
$ git clone https://github.com/schedule-me/schedule-me.git
```
cd into root directory and install dependencies:
```
$ npm install
```
Find sample.env file and rename/create a copy to .env and change appropriate config variables.</br>
From the root directory run:
```
$ ng build
$ npm start
```
In browser, navigate to localhost:8000
 
## Team
[Lucy Ji](https://github.com/lucyji1000)</br>
[Christopher Phan](https://github.com/cpp6d)</br>
[Sergey Sarkisyan](https://github.com/sergysurge)


