import React , {Component } from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';
import firebase from 'firebase';
import { render } from 'react-dom';
import {Avatar,Icon} from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';
import db from '../config';
import {RFValue} from 'react-native-responsive-fontsize';

export default class CustomSideBarMenu extends Component{
    state = {
      userID: firebase.auth().currentUser.email,
      image: "#",
      name: "",
      docID: "",
    };

    selectPicture = async () => {
      const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!cancelled) {
        this.setState({image: uri})
        this.uploadImage(uri, this.state.userID);
      }
    };

    uploadImage = async (uri, imageName) => {
      var response = await fetch(uri);
      var blob = await response.blob();
  
      var ref = firebase
        .storage()
        .ref()
        .child("userProfiles/" + imageName);
  
      return ref.put(blob).then((response) => {
        this.fetchImage(imageName);
      });
    };

    fetchImage = (imageName) => {
      var storageRef = firebase
        .storage()
        .ref()
        .child("userProfiles/" + imageName);

      storageRef
        .getDownloadURL()
        .then((url) => {
          this.setState({ image: url });
        })
        .catch((error) => {
          this.setState({ image: "#" });
        });
    };
  
    getUserProfile() {
      db.collection("users").where("emailID", "==", this.state.userID)
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.setState({
              name: doc.data().firstName + " " + doc.data().lastName,
              docID: doc.id,
              image: doc.data().image,
            });
          });
        });
    }
  
    componentDidMount() {
      this.fetchImage(this.state.userID);
      this.getUserProfile();
    }

    render(){
        return(
            <View style = {styles.container}>
              <View style={{flex:0.3, alignItems:"center", backgroundColor:"turquoise"}}>
              <Avatar
                rounded
                source={{
                  uri: this.state.image,
                }}
                size="large"
                onPress={() => this.selectPicture()}
                containerStyle={styles.imageContainer}
                showEditButton/>
              <Text style={{ fontWeight: "bold", fontSize: RFValue(20), paddingTop: 10 }}>
                {this.state.name}
              </Text>
              </View>
                <View style = {styles.drawerItemsContainer}>
                    <DrawerItems {...this.props} />
                </View>
                <View style={styles.logOutContainer}>
                    <TouchableOpacity style = {styles.logOutButton}
                        onPress={()=>{
                            this.props.navigation.navigate('SignUpLoginScreen');
                            firebase.auth().signOut();
                        }}>
                            <Icon
                             name="logout" type="antdesign" size={RFValue(20)}
                             iconStyle={{paddingLeft: RFValue(10)}}/>
                            <Text 
                            style={{fontSize: RFValue(15), fontWeight: "bold", marginLeft: RFValue(30)}}>
                              Log Out
                              </Text>
                        </TouchableOpacity>

                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  logOutButton: {
    height: 30,
    width: "100%",
    justifyContent: "center",
    padding: 10,
  },
  imageContainer: {
    flex: 0.75,
    width: "40%",
    height: "20%",
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
  logOutText: {
    fontSize: 30,
    fontWeight: "bold",
  },
});