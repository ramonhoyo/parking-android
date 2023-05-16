## Uppita Parking
---

Showcase react-native application, for allowing parking operation such as.

- Register vehicules.
- Get into a parking.
- Select a parking slot.
- Confirm slot.
- Compute payment based on entry date and hourly rate price.
- Perform a payment (Testing) using Stripe platform.
- Documentation: In spanish (requested by client).


This application is meant to work with a rasberry device installed on the parking, but the application has options to emulate those functions.

### Implementations:
---

  - **react-native**: This application is a react-native project written in Javascript.
  - **Firebase**:   This application uses Firebase services (Firestore, Functions, Autentication).
  - **Google signin**   This application allows signin with Google Account.
  - **Stripe**:   This application has an Stripe integration.
  - **Google Maps**: This application used google maps, as well **Directions API**.


### Prerequisites
---

  - setup react-native enviroment: https://reactnative.dev/docs/environment-setup
  - Put a valid google-services.json at android/app/ directory


### Install and start application
---

```
  npm install
  npx react-native run-android
```

### Generate APK (Windows)
---

Generate release bundle
```
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

Generate release apk
```
cd android
.\gradlew.bat assembleRelease
```

### Troubleshooting
---

#### **Unable to run aplication**
try to clean android project, repeat until get a sucessfull clean

  ```
  cd android
  .\gradlew.bat clean
  ```

#### **Duplicated Resources** 
when building final release apk: delete all images in **android/app/src/res/drawable\*** and repeat step "Generate APK"


### Screenshots

<img src="screenshots/1.jpg" width="200" />
<img src="screenshots/2.jpg" width="200" />
<img src="screenshots/3.jpg" width="200" />
<img src="screenshots/4.jpg" width="200" />
<img src="screenshots/5.jpg" width="200" />
<img src="screenshots/6.jpg" width="200" />
<img src="screenshots/7.jpg" width="200" />
<img src="screenshots/8.jpg" width="200" />
<img src="screenshots/9.jpg" width="200" />
<img src="screenshots/10.jpg" width="200" />
<img src="screenshots/11.jpg" width="200" />
<img src="screenshots/12.jpg" width="200" />
<img src="screenshots/13.jpg" width="200" />
<img src="screenshots/14.jpg" width="200" />
<img src="screenshots/15.jpg" width="200" />
<img src="screenshots/16.jpg" width="200" />
<img src="screenshots/17.jpg" width="200" />
<img src="screenshots/18.jpg" width="200" />
<img src="screenshots/19.jpg" width="200" />
<img src="screenshots/20.jpg" width="200" />
<img src="screenshots/21.jpg" width="200" />
<img src="screenshots/22.jpg" width="200" />
<img src="screenshots/23.jpg" width="200" />
<img src="screenshots/24.jpg" width="200" />
<img src="screenshots/25.jpg" width="200" />
