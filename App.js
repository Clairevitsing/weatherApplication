import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ImageBackground, Image, SafeAreaView, Text, View, StyleSheet, ActivityIndicator, ScrollView  } from 'react-native';
import * as Location from 'expo-location';
import Axios from "axios";


export default function App() {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const API_KEY = "365d512b61c1fb87de60b375b3c59d20";


  useEffect(() => {
    const getCoordinates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location, "lyon");
      getForecastData(location);
      
    };
    getCoordinates();
  }, []);

 

  async function fetchWeatherData(location) {
    let lat = location.coords.latitude;
    let long = location.coords.longitude;
    console.log(lat, long);
    setLoading(false);
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&lang=fr&units=metric`;
    console.log(weatherAPI);


    try {
      const weatherResponse = await fetch(weatherAPI);
      if (weatherResponse.status == 200) {
        const weatherData = await weatherResponse.json();
        console.log("weatherData:", weatherData);
        setWeatherData(weatherData);
      } else {
        setWeatherData(null);
      }
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  }

  
  useEffect(() => {
   location !== null &&   fetchWeatherData(location);
    console.log("weatherData:", weatherData);
  }, [location]);


 function changeTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
}

  const getForecastData = async (location) => {

    try {
      const forecastReponse = await Axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=365d512b61c1fb87de60b375b3c59d20&lang=fr&units=metric`);
      setForecastData(forecastReponse.data.list);
      console.log("forecastData:", forecastData);
      setLoading(false);
    } catch (e) {
      console.log("error getting forecast data");
      setForecastData(null); 
      setLoading(true);
    }
  }

  if (!weatherData || !forecastData) {
    return (
      <View style={[styles.loadingContainer,  styles.horizontal]}>
        <ActivityIndicator size="large" color="#0000ff"/>
      </View>
    );
  }

  
  let temp = Math.round(weatherData.main.temp);
  console.log(temp);
  let weather = weatherData.weather[0].icon;
  console.log(weather);
  let imageUrl = `https://openweathermap.org/img/wn/${weather}@4x.png`;
  console.log(imageUrl);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('./assets/images/home.webp')} resizeMode='cover' style={styles.backgroundImage}>
      <View style={styles.weatherContainer}>
        <Text style={styles.location}>{weatherData.name}</Text>
        <Image
          style={styles.logo}
          source={{ uri: imageUrl }}
        />
        <Text style={styles.temperature}>{temp} °C</Text>
        <Text style={styles.description}>{weatherData.weather[0].description}</Text>
      </View>

      {forecastData && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
          {forecastData.map((forecast, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastTime}>{changeTimestamp(forecast.dt)}</Text>
              <Image
                source={{ uri: `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png` }}
                style={styles.forecastIcon}
                resizeMode="contain"
              />
              <Text style={styles.forecastTemp}>{Math.round(forecast.main.temp)}°C</Text>
            </View>
          ))}
            
        </ScrollView>
      )}

        <StatusBar style="auto" />
        </ImageBackground>
    </SafeAreaView>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    weatherContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      height: "65%",
    },
    location: {
      fontSize: 28,
      textAlign: 'center',
      color: '#fff',
      paddingHorizontal: 10,
    },
    loadingContainer:{
      flex: 1,
      justifyContent: 'center',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
    text: {
      fontSize: 18,
      textAlign: 'center',
    },
    logo: {
        width: 180,
        height: 160,
    },
    temperature: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
    },
    description: {
      marginTop: 10,
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
    },
    verticalView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },

    scroll: {
      width: "100%",
      height:"35%",
    },

    forecastItem: {
      backgroundColor: "white",
      height: 200, 
      width: 120,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
      borderRadius: 50
    },

    forecastIcon: {
      width: 50,
      height: 50
    },

    forecastTime: {
      fontSize: 18,
    },
    
    forecastTemp: {
      fontSize: 18,
    }
    
  });

