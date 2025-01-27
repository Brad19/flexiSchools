# Flexischools

## React native template created via npx create-expo-app

### pre-requesites
- node version -> 18.18.0
- JAVA 11.0
- Android Studio Giraffe | 2022.3.1 or above and emulator should have been configured.
- Xcode 15.2 or above with simulator IPhone 17.2 downloaded and working

### Install
- git clone <Repo>
- npm install (or) npm i

### Run ios
- npm run ios

### Run android
- npm run android

### Assumptions:

- Xcode 15.2 and Android studio with the above spec should be available
- Above pre-requisites should be met.
- API key should be working without any issues. Otherwise new api key should be created. In my case, I've created another one as I found that the first one reached its limit during debugging and testing.
- API_KEY will nornally be as part of env variables files which will not be uploaded to GIT repo.  But for testing purpose, I've hard coded the key to get it working.
- There is a MAX_LIMIT of the numbef of GIFs that can be accessed with the Trending and Search GIFs end point.
- The Gifs are presended in a rows of 2 columns similar to how GIFs are used in WhatApp or imessage


# Reasoning
- I've used the latest template from react-native with typescript to make it simple.
- I've used Async storage library to save the data to the local storage to make the data persistance. It is reliable and maintainable as well. In case we want to save sensitive data like token to persist, I would have chosen a different library for better encryption and security.
- I've used react-hook-form as the validations are not complex.
- I've left few default assets as such as it might be out of scope from the requirement point of view.
- There are few nitty gritties that need to be taken care of, to make sure that the app is performant as expected which consumes little more time that expected.


### Features
- Upon loading the page, on initial load the Trendings GIFs are loaded with the load limit of 15 and upon reaching the end of the list if the data is available, it'll display the GIFs based on the offset and the limit applicable.
- User will be able Search GIFs by text.
- User can tap the image, which navigates user to the details page where the user can add comment and rate it which can be saved locally in the device, so next time when the user visits the same image to get more info, the user will be shown the details previously entered details.
- Additionally user can refresh the page as well.

### What can be done better with more time
- Image from react-native does not render the image fast. We need to use something similar to react-native-fast-image as this library is not supported for react-native expo.
- Could not find time to write unit test.

### Total time taken - split up
- Boiler plate - approx 40 mins to find the correct one. Tried few but apparently a clean slate with the latest react native version proves to be valuable.
- Configure api to fetch the data - 20 mins.
- Layout and add a Screen to fetch the Trending info - 2 hours and 15 minsthat includes analysing the correct and optimal solution to fetch the data. And more importantly the data should be fetched upon user reaching the end of the list till the data is available.
- Analysing and include a form library to capture a Star rating form to capture the user preference - 30 mins
- Add the Search functionalkty - 30 mins
- Resolving issus in the template to configure and set the correct navigation - 45 mins
- Clean up and create a README - 30 mins.


-> Total time taken - 5 hours and 30 mins.

### References
 - Referred boiler plates as follows
    - https://github.com/ixartz/React-Native-Boilerplate?utm_source=chatgpt.com 
    - https://github.com/WrathChaos/react-native-typescript-boilerplate?utm_source=chatgpt.com

- Googled to know the beter form validation for react-native - https://dev.to/martygo/the-best-react-forms-validation-libraries-1bgj#:~:text=React%20Hook%20Form&text=The%20best%20React%20form%20library,to%20Formik%2C%20and%20Redux%20Form.

 - Used Google and check the documentation of Expo navigation to correct the navigation routing for our requirements - https://docs.expo.dev/router/create-pages/
 