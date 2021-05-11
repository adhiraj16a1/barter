import * as React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingsScreen from '../screens/SettingsScreen';
import MyBarters from '../screens/MyBarters';
import NotificationScreen from '../screens/NotificationScreen';

export const AppDrawerNavigator = createDrawerNavigator({
    Home : {
      screen : AppTabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="home" type="font-awesome"/>
      }
    },
    MyBarters : {
      screen : MyBarters,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="font-awesome"/>,
        drawerLabel: "My Donations"
      }
    },
    Notification : {
      screen : NotificationScreen,
      navigationOptions: {
        drawerIcon: <Icon name="bell" type="font-awesome"/>,
        drawerLabel: "Notifications"
      }
    },
    MyReceivedItems :{
      screen: MyReceivedItemsScreen,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="font-awesome"/>,
        drawerLabel: "My Received Items"
      }
    },
    Setting : {
      screen : SettingsScreen,
      navigationOptions: {
        drawerIcon: <Icon name="settings" type="fontawesome"/>,
        drawerLabel: "Settings"
      }
    }
  },
    {
      contentComponent:CustomSideBarMenu
    },
    {
      initialRouteName : 'Home'
    })