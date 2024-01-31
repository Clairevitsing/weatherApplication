import React, { useState, useEffect } from 'react';
import { Platform, Image, SafeAreaView, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function App() {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loaded, setLoaded] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const API_KEY = "365d512b61c1fb87de60b375b3c59d20";


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


  async function fetchWeatherData(location) {
    let lat = location.coords.latitude;
    let long = location.coords.longitude;
    console.log(lat, long);
    setLoaded(false);
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`;
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
      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchForecastData(location) {
    let lat = location.coords.latitude;
    let long = location.coords.longitude;
    console.log(lat, long);
    setLoaded(false);
    const forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_KEY}`;
    console.log("function fetch forecast :",forecastAPI);

  //   try {
  //     const forecastResponse = await fetch(forecastAPI);
  //     if (forecastResponse.status == 200) {
  //       const forecastDataJson = await forecastResponse.json();
  //       const forecastData = json_decode(forecastDataJson);
  //       console.log("forecastData:", forecastData);
  //       setForecastData(forecastData);
  //     } else {
  //       setForecastData(null);
  //     }
  //     setLoaded(true);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  try {
    const forecastResponse = await fetch(forecastAPI);
    if (forecastResponse.status === 200) {
      const forecastDataJson = await forecastResponse.json();
      const forecastData = Object.values(forecastDataJson);
      console.log("forecastDataArray:", forecastData);
      setForecastData(forecastData);
    } else {
      setForecastData(null);
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


  useEffect(() => {
     
    fetchForecastData(location);
  
    if (forecastData !== null ) { 
      console.log("FormatForecastData:", forecastData);
      // console.log("FormatForecastDataList:", forecastData.list);
      
      const formatForecastData = forecastData[3]?.map(forecast => {
        console.log(" forecastData[3]:", forecastData[3]);
        console.log(" forecastData.dt:", forecastData[3][0].dt_txt);
        const date = new Date(forecast.dt * 1000);
        
        console.log(" date:", date);
        console.log("hour:", date.getHours())
        console.log("temp:", Math.round(forecast.main.temp))
         console.log("icon:", forecast.weather[0].icon)
      return {
        date: date,
        hour: date.getHours(),
        temp: Math.round(forecast.main.temp),
        icon: forecast.weather[0].icon,
        name: format(date,"EEEE",{locale:fr})
      };
    });
      console.log("FormatForecastData:", formatForecastData);
      setForecastData(formatForecastData);
   }
}, [location]);


  

  // useEffect(() => {
  //   fetchForecastData(location);
  //   console.log("weatherData:", forecastData);
  // }, [location]);
      
  
  if (weatherData !== null && forecastData !== null) {

    // let imageUrl = "https://openweathermap.org/img/wn/01d@4x.png";
    
    let temp = Math.round(weatherData.main.temp);
    console.log(temp);
    let weather = weatherData.weather[0].icon;
    console.log(weather);
    let imageUrl = `https://openweathermap.org/img/wn/${weather}@4x.png`;
    console.log(imageUrl);

    return (
      <SafeAreaView style={styles.weatherContainer}>
        <View>
        <Text style={styles.location}>{weatherData.name}</Text>
         <Image
          style={styles.tinyLogo}
          source={{ uri: imageUrl }}
         />
        <Text style={styles.temperature}>{temp} °C</Text>
          <Text style={styles.description}> {weatherData.weather[0].description} </Text>
        </View>
        
        <View>
          <Text style={styles.forecast}> les Forecast</Text>
          <View>
            {
              forecastData?.map((forecast, index) => (
                <View key={index} style={styles.forecastItem}>

                  <Text>{forecast.name}</Text>
                  <Text>{forecast.hour}</Text>
                  <Text>{forecast.icon}</Text>
                </View>
              ))
            }           
          </View>
        </View>
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

