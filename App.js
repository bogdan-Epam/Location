/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict'

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AppState,
  TouchableOpacity
} from 'react-native';
import Geocoder from 'react-native-geocoder';
import BackgroundGeolocation from "react-native-background-geolocation";

Geocoder.fallbackToGoogle('AIzaSyBnVItCRS6tWjppa8K5tJ2wHrh5B-KJRyE')

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
})

export default class App extends Component {
  
  constructor(props) {
      super(props)
      
      this.state ={
          
      }
    }
    componentDidMount() {
        this.setState({rate:5})
        //console.log(JSON.stringify(ret))
    } 
    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
      BackgroundGeolocation.un('location', this.onLocation);
      BackgroundGeolocation.un('error', this.onError);
      BackgroundGeolocation.un('motionchange', this.onMotionChange);
      BackgroundGeolocation.un('activitychange', this.onActivityChange);
      BackgroundGeolocation.un('providerchange', this.onProviderChange);
    }

  onCapture(){
    var DeviceInfo = require('react-native-device-info');
    this.uuid=DeviceInfo.getUniqueID();
    alert(this.uuid);
  }
  
  /*updateLoadLocationRequest(responseData){
    
      //this._getLatlng(()=>{});
      console.log("updateloadlocationrequest")
      this.tokenId=responseData.authToken
      if(responseData.error==null)
      {
        alert("Login Successful!")
      }
      else
        alert(responseData.error)
      this._getLatlng(responseData,() => this.onLocation(responseData));
     

  }*/
  onLogin(){
    var data = {
      "deviceId": "1111111111",
      "token": "1111",
      "udid": "1111111111"
    }
    fetch("https://api.uat.track.loadtap.com/api/v1/app/login", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:  JSON.stringify(data)
     })
     .then(response => response.json())
     .then(responseData => {if(responseData.error==null){
        alert("login successful")
        this.tokenId=responseData.authToken
        //getLocation function 
        this.getLocation(
          (res) => {
            this.data = { 
              "city":res[0].adminArea,
              "road":res[0].streetName,
              "state":res[0].locality,
              "country":res[0].country,
              "lat":this.state.latitude,
              "lng":this.state.longitude        
            }
            this.setState({location:this.data})
            
            BackgroundGeolocation.configure({
              desiredAccuracy: 0,
              distanceFilter: 10,
              // Activity Recognition
              stopTimeout: 1,
              heartbeatInterval: 5,
              preventSuspend: true,
              // Application config
              debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
              logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
              stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
              // HTTP / SQLite config
              batchSync: true,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
              autoSync: true,         // <-
              url: 'https://api.uat.track.loadtap.com/api/v1/app/update-location',
              headers: {             
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization':this.tokenId
              },
              params: this.data
            }, (state) => {
              console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
        
              if (!state.enabled) {
                // 3. Start tracking!
                BackgroundGeolocation.start(function() {
                  console.log("- Start success");
                });
              }
            });
          }
        )
        BackgroundGeolocation.on('location', this.onLocation);
        BackgroundGeolocation.on('error', this.onError);
        BackgroundGeolocation.on('motionchange', this.onMotionChange);
        BackgroundGeolocation.on('activitychange', this.onActivityChange);
        BackgroundGeolocation.on('providerchange', this.onProviderChange);
        BackgroundGeolocation.on('http', function(response) {
          console.log('onHttp ' + JSON.stringify(response));
          let next = JSON.parse(response.responseText).nextFrequency
          
            
            BackgroundGeolocation.setConfig({
              heartbeatInterval: next
            }, function() {
              console.log('heartbeatInterval changed!');
            }, function() {
              console.log('failed to setConfig');
            });
        });
        BackgroundGeolocation.on('heartbeat', function(params) {
          var lastKnownLocation = params.location;
          console.log('- heartbeat: ', lastKnownLocation);
          // Or you could request a new location
          BackgroundGeolocation.getCurrentPosition(function(location) {
            console.log('- current position: ', location);
          });
        });
        

     }
     else 
        console.log(responseData.error)
    })
     .catch((error) => {
      console.error(error);
    });
  }

  
  getLocation(callback){
    
    this.watchID = navigator.geolocation.watchPosition((position) => {
      let lat = position.coords.latitude
      let lng = position.coords.longitude
      this.setState({latitude:lat,longitude:lng})
      Geocoder.geocodePosition({lat,lng}).then(res=>{
        callback(res)
      })
    })
  }

  onLocation(location) {
    console.log('- [js]location: ', JSON.stringify(location));
  }
  onError(error) {
    var type = error.type;
    var code = error.code;
    alert(type + " Error: " + code);
  }
  onActivityChange(activityName) {
    console.log('- Current motion activity: ', activityName);  // eg: 'on_foot', 'still', 'in_vehicle'
  }
  onProviderChange(provider) {
    console.log('- Location provider changed: ', provider.enabled);    
  }
  onMotionChange(location) {
    console.log('- [js]motionchanged: ', JSON.stringify(location));
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{width:200,height:50}} onPress={()=> this.onCapture()}>
          <Text>
            Capture UDID
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{width:200,height:50}} onPress={()=> this.onLogin()}>
          <Text>
            Login
          </Text>
        </TouchableOpacity>
        { this.state.location &&
          <View>
            <Text>Country: {this.state.location.country}</Text>
            <Text>city: {this.state.location.city}</Text>
            <Text>State: {this.state.location.state}</Text>
            <Text>Street: {this.state.location.road}</Text>
            <Text>latitude: {this.state.location.lat}</Text>
            <Text>longitude: {this.state.location.lng}</Text>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
function newFunction() {
    return this;
}
