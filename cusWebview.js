import * as React from 'react';
import {Text, View,StyleSheet, ToastAndroid, BackHandler,Alert,Platform,StatusBar,Linking,SafeAreaView,TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import { getStatusBarHeight } from 'react-native-status-bar-height';
// import Icon from 'react-native-vector-icons/FontAwesome';
//import IntentLauncher from 'react-native-intent-launcher';

export default function CusWebview(props){
    
    const [urls, seTurls] = React.useState("ss");
    const webViews = React.useRef();

    const page_goBack = () =>{
        webViews.current.goBack();
    }
    
    const page_goForward = () =>{
        webViews.current.goForward();
    }
    const page_home = () =>{
        webViews.current.injectJavaScript("window.location.href = '/';");
    }
    const category = () =>{
        webViews.current.injectJavaScript("$('#category').show();");
    }
    function onShouldStartLoadWithRequest(e){
        let wurl = e.url;
        console.log(e.url);
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


    const onNavigationStateChange = (webViewState)=>{
        let wurl = webViewState.url;
        //IntentLauncher.startActivityAsync()
        //console.log(wurl);
        seTurls(webViewState.url);
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    }

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
                    ref={webViews}
                    //http://xn--220bl3b6vm2qev0b.com?ck_rn=react_native
                    source={{uri: props.url+"?ck_rn=react_native"}}
                    onMessage={(event)=> Alert.alert(event.nativeEvent.data, ToastAndroid.SHORT) }
                    onShouldStartLoadWithRequest= {onShouldStartLoadWithRequest}
                    onNavigationStateChange={onNavigationStateChange}
                    javaScriptEnabledAndroid={true}
                    allowFileAccess={true}
                    renderLoading={true}
                    mediaPlaybackRequiresUserAction={false}
                    setJavaScriptEnabled = {false}
                    scalesPageToFit={false}
                    originWhitelist={['*']}
                />
            </View>
            {/* <View style={styles.nav}>
                <TouchableOpacity style={styles.nav_bnt} onPress={page_goBack}>
                    <Text>  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nav_bnt} onPress={page_home}>
                     <Text> > </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nav_bnt} onPress={page_goForward}>
                    <Text> > </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nav_bnt} onPress={category}>
                    <Text> > </Text>
                </TouchableOpacity> 
            </View> */}
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