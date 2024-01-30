import React, { useState, useEffect } from 'react';
import { Platform, Image, SafeAreaView, Text, View, StyleSheet } from 'react-native';
//import Device from 'expo-device';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loaded, setLoaded] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const API_KEY = "365d512b61c1fb87de60b375b3c59d20";
 
 
  // useEffect(() => {
  //   (async () => {
  //     if (Platform.OS === 'android' && !Device.isDevice) {
  //       setErrorMsg(
  //         'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
  //       );
  //       return;
  //     }
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied');
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   })();
  // }, []);

  useEffect(() => {
    const DataLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location, "lyon");
    };
    DataLocation();
  }, []);

  // let text = 'Waiting..';
  // if (errorMsg) {
  //   text = errorMsg;
  // } else if (location) {
  //   text = JSON.stringify(location);
  // }

  async function fetchWeatherData(location) {
    let lat = location.coords.latitude;
    let long = location.coords.longitude;
    console.log(lat, long);
    setLoaded(false);
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`;
    const forestAPI = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_KEY}`;

    console.log(weatherAPI);
    console.log(forestAPI);


    try {
      const response = await fetch(weatherAPI, forestAPI);
      if (response.status == 200) {
        const weatherData = await response.json();
        console.log("data:", weatherData);
        setWeatherData(weatherData);
      } else {
        setWeatherData(null);
      }
      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchWeatherData(location);
    console.log("weatherData:", weatherData);
  }, [location]);
      
  
  if (weatherData !== null) {

    // let imageUrl = "https://openweathermap.org/img/wn/01d@2x.png";
    
    let temp = Math.round(weatherData.main.temp);
    console.log(temp);
    let weather = weatherData.weather[0].icon;
    console.log(weather);
    let imageUrl = `https://openweathermap.org/img/wn/${weather}@2x.png`;
    console.log(imageUrl);

    return (
      <SafeAreaView style={styles.weatherContainer}>
        <Text style={styles.location}>{weatherData.name}</Text>
         <Image
          style={styles.tinyLogo}
          source={{ uri: imageUrl }}
         />
        <Text style={styles.temperature}>{temp} °C</Text>
        <Text style={styles.description}> {weatherData.weather[0].description} </Text>
      </SafeAreaView>
    );
  } else {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.text}>The site is loading</Text>
      </View>
    )
  }
}

  const styles = StyleSheet.create({
    weatherContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    location: {
      fontSize: 18,
      textAlign: 'center',
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    text: {
      fontSize: 18,
      textAlign: 'center',
    },
    tinyLogo: {
        width: 80,
        height: 80,
      },
  });

