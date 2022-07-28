import React, {SetStateAction, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  PermissionsAndroid,
  Platform,
  Button,
} from 'react-native';
import {CameraScreen} from 'react-native-camera-kit';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Clipboard from '@react-native-community/clipboard';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(true);
  const [result, setResult] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera permission',
              message: 'App need permission for camera access',
              buttonPositive: 'hello',
            },
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('camera permission granted');
            setCameraPermissionGranted(true);
          } else {
            console.log('camera permission denied');
            setCameraPermissionGranted(false);
          }
        } catch (err) {
          console.log('camera permission err' + err);
          setCameraPermissionGranted(false);
        }
      }

      requestCameraPermission();
    }
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={{
          flex: 1,
        }}>
        {result ? (
          <Result result={result} setResult={setResult} />
        ) : (
          <CameraView
            cameraPermissionGranted={cameraPermissionGranted}
            setResult={setResult}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

function Result({
  result,
  setResult,
}: {
  result: string;
  setResult: React.Dispatch<SetStateAction<string>>;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View 
        style={{
          flexDirection: 'row'
        }}
      >
        <Text
          style={{
            borderWidth: 2,
            borderColor: '#ccc',
            padding: 5,
            textAlign: 'center',
          }}
          selectable={true}>
          {result}
        </Text>
        <Button 
          title='copy'
          onPress={() => [
            Clipboard.setString(result)            
          ]}
        />
      </View>
      <View
        style={{
          marginTop: 20,
        }}>
        <Button title="continue scan" onPress={() => setResult('')} />
      </View>
    </View>
  );
}

function CameraView({
  setResult,
  cameraPermissionGranted,
}: {
  setResult: React.Dispatch<SetStateAction<string>>;
  cameraPermissionGranted: boolean;
}) {
  return (
    <React.Fragment>
      {cameraPermissionGranted ? (
        <View
          style={{
            width: 250,
            height: 250,
            position: 'relative',
          }}>
          <CameraScreen
            showFrame={true}
            scanBarcode={true}
            onReadCode={e => {
              setResult(e.nativeEvent.codeStringValue);
            }}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          <Text>Camera cannot access</Text>
        </View>
      )}
    </React.Fragment>
  );
}

export default App;
