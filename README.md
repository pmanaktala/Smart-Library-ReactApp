Steps to make the react native app work on IOS and Android

In Windows(Only Android)
Step 1
Download Chocolatey on your computer
Step 2
Run the followning commnad to install nodejs,jdk and python
choco install -y nodejs.install python2 jdk8
Step 2
Using npm install the react-native cli
npm install -g react-native-cli
Step 3
Make a new React Native Project using
react-native init AwesomeProject
Step 4
Copy the App.js code which is in the given file inside the AwesomeProject Folder
Step 5
Install the required dependencies using NPM
Step 6
Install android studio and android sdk
Step 7
After connecting you device to the system and enabling USB Debugging, run the following command - 
react-native run android

On MacOS(Android and IOS)
Step 1
Install node and watchman using
brew install node
brew install watchman
Step 2
Install react-native cli using
npm install -g react-native-cli
Step 3
Make a new React Native Project using
react-native init AwesomeProject
Step 4
Copy the App.js code which is in the given file inside the AwesomeProject Folder
Step 5
Install the required dependencies using NPM
Step 6
Install Xcode for IOS App and adroid stuido for Android App
Step 7
Run the respective Apps using
react-native run-ios
react-native run-android
