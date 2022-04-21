import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableNativeFeedback,
  StatusBar,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginPage from './LoginPage';

const App = () => {
  return (
    <NavigationContainer>
      <LoginPage></LoginPage>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 35,
    backgroundColor: 'white',
  },
  inputBox: {
    marginVertical: 25,
  },
  box: {
    marginVertical: 10,
  },
  center: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 5,
    color: '#000000',
  },
  input: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    paddingHorizontal: 10,
  },
  button: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#3D80AE',
    borderWidth: 1,
    borderColor: '#3D80AE',
  },
  btnText: {
    textAlign: 'center',
    color: '#ffffff',
  },
});

export default App;
