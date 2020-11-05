import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Button,
  Text,
  StatusBar,
  Alert
} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import { notifications } from "react-native-firebase-push-notifications"
const baasUrl = "https://dmonster926.cafe24.com/json/proc_json.php"; //base url

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import CusWebview from './cusWebview.js';
import Axios from "axios";
function App(){
  
  const askPermission = async () => {
    try {
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (result === RESULTS.GRANTED) {
        console.log("ss");
      }
    } catch (error) {
      console.log('askPermission', error);
    }
    let hp = await notifications.hasPermission();
    if(!hp){
      await notifications.requestPermission();
    }
  };

  const version_ck = () =>{
    let phone_code = '';
    let ver = "2.0"
    if(Platform.OS=="android"){
      phone_code="and";
      ver = "2.0";
    }
    if(Platform.OS=="ios"){
      phone_code="ios";
      ver = "2.0";
    }

    const form = new FormData();
    form.append("method","proc_app_popup");   
    form.append("ver",ver);   
    form.append("phone_code",phone_code);
    
    const urls = baasUrl+"/theme/cookie/mobile/app/proc.php";
    Axios.post(urls,form).then((res)=>{
      if(!res.data.popup_data.app){
        Alert.alert("버전경고"+ver,"앱버전이 낮습니다. 일부기능이 작동하지않을 수 있습니다 앱스토어에서 업데이트바랍니다.");
      }
    }); 
  }
  

  React.useEffect(()=>{
    version_ck();  
    askPermission();
    SplashScreen.hide();
  },[]);
  const url = "https://dmonster926.cafe24.com/bbs/login.php";
  return (
    <>
      {Platform.OS=="android" ? 
      <StatusBar barStyle="dark-content" />:
      <StatusBar barStyle="dark-content" />
      }
      <CusWebview url={url}/>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    flex:1,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;