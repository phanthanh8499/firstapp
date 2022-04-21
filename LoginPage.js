import React, {useState} from 'react';
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
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomePage from './HomePage';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const LoginPage = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const SignInScreen = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hidePass, setHidePass] = useState(true);
    const [uError, setUError] = useState(false);
    const [pError, setPError] = useState(false);

    const handleSubmit = async () => {
      const dataSend = {
        username: username,
        password: password,
      };
      try {
        if (!username) {
          setUError(true);
          return false;
        } else {
          setUError(false);
        }
        if (!password) {
          setPError(true);
          return false;
        } else {
          setPError(false);
        }
        const {data} = await axios.post(
          'https://qlsc.maysoft.io/server/api/auth/login',
          dataSend,
        );
        if (data.status === true) {
          const jsonValue = JSON.stringify(data);
          await AsyncStorage.setItem('@authStorage', jsonValue);
          dispatch({type: 'SIGN_IN', token: data.data.access_token});
        } else {
          setModalVisible(!modalVisible);
          //       Alert.alert(
          // "Alert Title",
          // "My Alert Msg")
        }
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Image
            style={styles.image}
            source={{
              uri: 'https://is4-ssl.mzstatic.com/image/thumb/Purple114/v4/1b/41/e4/1b41e4ea-1840-1404-6e4c-6c3e10c09b9f/source/512x512bb.jpg',
            }}></Image>
        </View>
        <View style={styles.inputBox}>
          <View style={styles.box}>
            <Text style={styles.title}>Tên tài khoản</Text>
            <TextInput
              style={uError ? styles.inputError : styles.input}
              onChangeText={text => {
                const temp = text;
                if (text.length === 0) {
                  setUError(true);
                  setUsername('');
                } else {
                  setUsername(temp);
                  setUError(false);
                }
              }}
              value={username}
              placeholder="Nhập tên tài khoản"></TextInput>
            {uError ? (
              <Text style={styles.textError}>Vui lòng nhập tên tài khoản</Text>
            ) : null}
          </View>
          <View style={styles.box}>
            <Text style={styles.title}>Mật khẩu</Text>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={pError ? styles.inputError : styles.input}
                onChangeText={text => {
                  const temp = text;
                  if (text.length === 0) {
                    setPError(true);
                    setPassword('');
                  } else {
                    setPassword(temp);
                    setPError(false);
                  }
                }}
                value={password}
                password={true}
                error={pError}
                secureTextEntry={hidePass ? true : false}
                placeholder="Nhập mật khẩu"></TextInput>

              <Icon
                name={hidePass ? 'eye-slash' : 'eye'}
                size={25}
                color="blue"
                onPress={() => setHidePass(!hidePass)}
                style={{paddingTop: 12, right: 35}}
              />
            </View>
            {pError ? (
              <Text style={styles.textError}>Vui lòng nhập tên mật khẩu</Text>
            ) : null}
          </View>
        </View>

        <View>
          {/* <Button title="Đăng nhập" style={styles.button}></Button> */}
          <TouchableOpacity
            style={uError || pError ? styles.buttonError : styles.button}
            onPress={handleSubmit}
            disabled={uError || pError ? true : false}>
            <Text style={styles.btnText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Icon name="times-circle-o" size={80} color="red"></Icon>
                <Text style={styles.modalText}>
                  Đăng nhập không thành công!
                </Text>
                <Pressable
                  style={[styles.button]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={[styles.btnText, {fontWeight: 'bold'}]}>OK</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  };

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const getToken = async () => {
      let userToken;
      // AsyncStorage.removeItem('@authStorage')
      try {
        const data = await AsyncStorage.getItem('@authStorage');
        userToken = JSON.parse(data).data.access_token;
      } catch (e) {
        console.log(e);
      }
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    getToken();
  }, []);

  return (
    <Stack.Navigator
      useLegacyImplementation
      initialRouteName="Root"
      screenOptions={{headerShown: false}}>
      {state.userToken == null ? (
        <Stack.Screen name="SignIn" component={SignInScreen} />
      ) : (
        <Stack.Screen name="Home" component={HomePage} />
      )}
    </Stack.Navigator>
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
  textError: {
    color: 'red',
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
    width: '100%',
  },
  inputError: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'red',
    paddingHorizontal: 10,
    width: '100%',
  },
  button: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#3D80AE',
    borderWidth: 1,
    borderColor: '#3D80AE',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonError: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#939FF9',
    borderWidth: 1,
    borderColor: '#939FF9',
  },
  btnText: {
    textAlign: 'center',
    color: '#ffffff',
  },
  modalView: {
    margin: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  modalText: {
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 20,
    fontSize: 20,
  },
});

export default LoginPage;
