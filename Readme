### Prerequisites

  Configuración de enviroment para correr apps react native en Windows:
  https://reactnative.dev/docs/environment-setup

```
  npm install
  npx react-native run-android
```

### usefull commands

Start Metro

```
  npx react-native start
  npx react-native start --reset-cache // <--- clear metro cacje
```

Start your application

```
  npx react-native run-android
```

#### Go to Settings -> Debug server host & port for device (in normal behavior this step is not required)

- Set ip of host server (you can take it from `ipconfig` commad).
- Set port 8081
  e.g 192.168.1.1:8081

### Setup app to point to local firebase server  (in normal behavior this step is not required)

- Change 192.168.1.9 to ip of host server

```
// Use a local emulator in development
if (__DEV__) {
functions().useFunctionsEmulator('http://192.168.1.9:5000');
}
```

#### troubleshooting running app

- Clean android project, repeat after sucessfull clean
  ```
  cd android
  .\gradlew.bat clean
  ```

### Generate APK (Windows)

#### Generate bundle js

```
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```


#### Generate debug APK (win)


```
cd android
.\gradlew.bat assembleRelease
```

#### Errores generando APK


- **Duplicated Resources**: Borrar las imagenes dentro de las carpetas android/app/src/res/drawable* y volver a ejectuar el comando .\gradlew.bat assembleRelease