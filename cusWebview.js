import * as React from 'react';
import {Text, View,StyleSheet, ToastAndroid, BackHandler,Alert,Platform,StatusBar,Linking,SafeAreaView,TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { notifications } from "react-native-firebase-push-notifications"
import { AsyncStorage } from 'react-native';
import Axios from "axios";

// import Icon from 'react-native-vector-icons/FontAwesome';
//import IntentLauncher from 'react-native-intent-launcher';

export default function CusWebview(props){
    const [urls, seTurls] = React.useState("ss");
    const webViews = React.useRef();
    const baasUrl = "https://dmonster926.cafe24.com/"; //base url

    // React.useEffect(()=>{
    //     seTurls("https://dmonster926.cafe24.com");
    // },[]);
    function onShouldStartLoadWithRequest(e){
        let wurl = e.url;
        //console.log("url:"+e.url);
        let rs = true;
        var SendIntentAndroid = require('react-native-send-intent');
        if (!wurl.startsWith("http://")&& !wurl.startsWith("https://")&& !wurl.startsWith("javascript:")){
            if(Platform.OS=="android"){
                webViews.current.stopLoading();
                SendIntentAndroid.openChromeIntent(wurl)
                    .then(isOpened => {
                    if(!isOpened){ToastAndroid.show('어플을 설치해주세요.', ToastAndroid.SHORT);}
                });      
            }else{
                const supported = Linking.canOpenURL(wurl);
                if(supported){
                    Linking.openURL(wurl);
                }else{
                    alert("어플을 설치해주세요");
                }
            }
            rs = false;
        }
        if ( e.url.indexOf("/mobile/shop/kcp/exit.php") !== -1){
            webViews.current.injectJavaScript("window.location.href = '/';");
            rs = false;
        }
        if ( e.url.indexOf("/mobile/shop/kcp/order_com.php") !== -1){
            webViews.current.injectJavaScript("window.location.href = '/';");
            rs = false;
        }
        return rs;
    }

    const onMessaged = async (e) =>{
        let mb_id =e.nativeEvent.data;
        console.log(mb_id);
        if(mb_id.indexOf('@@') === -1){
            console.log(mb_id); 
            const form = new FormData();
            const mb_token = await notifications.getToken();
            console.log(mb_token);
            form.append("mb_token",mb_token);   
            form.append("mb_id",mb_id);   
            form.append("work_mode","update_token");   
            const urls = baasUrl+"/theme/cookie/mobile/app/proc.php";
            Axios.post(urls,form);
        }else{
            mb_id = mb_id.substr(0, mb_id.length -2);
            Alert.alert(mb_id);
        }
        
        
        //await AsyncStorage.setItem(mb_token);
    }

    const onNavigationStateChange = (e)=>{
        console.log("urls:"+e.url);
        let wurl = e.url;
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    }
    //let injectedJavaScript = '(function() { window.postMessage = function(data) {window.ReactNativeWebView.postMessage(data);};})()';
    
    let injectedJavaScript = 'setTimeout (function(){window.open = function(data){alert(data)} }, 1000)';

    
    const handleBackButton = () => {
        if(urls == props.url || urls == props.url+"?ck_rn=react_native"){
            Alert.alert(
                '어플을 종료할까요?','',
                [
                { text: '네', onPress: () =>  BackHandler.exitApp()},
                {text: '아니요'}
                ]
            );
        }else {
            webViews.current.goBack();
        }
        return true;
    }
 
    return (
        <SafeAreaView style={styles.container}>
            {Platform.OS === 'ios' && 
              <StatusBar backgroundColor="#f5ac4f" translucent={false}/>
            }
            {Platform.OS === 'android' && 
                <StatusBar backgroundColor="#eee" barStyle="dark-content" translucent={false}/>
            }
            <View style={styles.webView}>
                <WebView
                    injectedJavaScript = {injectedJavaScript}
                    ref={webViews}
                    source={{uri: props.url+"?ck_rn=react_native"}}
                    onMessage={(event)=>onMessaged(event)}
                    onShouldStartLoadWithRequest= {onShouldStartLoadWithRequest}
                    onNavigationStateChange={onNavigationStateChange}
                    allowFileAccess={true}
                    renderLoading={true}
                    mediaPlaybackRequiresUserAction={false}
                    javaScriptEnabled = {true}
                    scalesPageToFit={false}
                    originWhitelist={['*']}
                />
            </View>
        </SafeAreaView>
    );
}
const marginH = getStatusBarHeight(true);
const styles = StyleSheet.create({
  container: {
    borderTopWidth:1,
    borderColor:"#eee",
    marginTop:marginH,
    flex: 1,
    backgroundColor: 'white',
  },
  webView: {
    flex: 12,
  },
  nav: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  nav_bnt: {
    width:"25%",
    height:"100%",
    backgroundColor: '#eee',
    textAlign:'center',
    justifyContent: 'center',
    alignItems:'center',
    lineHeight:50,
  },
  fonts:{
      fontSize:25,
  }

});