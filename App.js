import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { firebase } from './src/firebase/config'
import { LoginScreen, HomeScreen, RegistrationScreen, ProfileScreen, ClassScreen } from './src/screens'
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '009387',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}>
        <HomeStack.Screen name="Home" component={HomeScreen} options={{
          title: 'Overview'
        }} />
  </HomeStack.Navigator>
)

export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)


  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => { 
            const userData = document.data() 
            setUser(userData) 
            setLoading(false) 
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });
  }, []);

  return (

    <NavigationContainer> 
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'}> 
        <Stack.Screen name="Home"> 
          {props => <HomeScreen {...props} extraData={user} />} 
        </Stack.Screen> 
        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />  
        <Stack.Screen name="Class" component={ClassScreen} /> 
      </Stack.Navigator> 
    </NavigationContainer>
  );
}