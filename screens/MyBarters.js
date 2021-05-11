import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert} from 'react-native';
import {Card,ListItem,Icon} from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';
import {RFValue} from 'react-native-responsive-fontsize';

export default class MyBarters extends Component {
    static navigationOptions = {header: null}

    constructor(){
        super();
        this.state = {
            donorId: firebase.auth().currentUser.email,
            allDonations: [],
            donorName: "",
        }
        this.requestRef = null;
    }

    getDonorDetails=(donorId)=>{
      db.collection("users").where("emailID","==", donorId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          this.setState({
            "donorName" : doc.data().firstName + " " + doc.data().lastName
          })
        });
      })
    }

    getAllDonations =()=>{
      this.requestRef = db.collection("allBarters").where("donorID" ,'==', this.state.donorId)
      .onSnapshot((snapshot)=>{
        var allDonations = []
        snapshot.docs.map((doc) =>{
          var donation = doc.data()
          donation["docID"] = doc.id
          allDonations.push(donation)
        });
        this.setState({
          allDonations : allDonations
        });
      })
    }
 

    sendItem=(itemDetails)=>{
      if(itemDetails.requestStatus === "Item Sent"){
        console.log(itemDetails)
        var requestStatus = "Donor Interested"
        db.collection("allBarters").doc(itemDetails.docID).update({
          "requestStatus" : "Donor Interested"
        })
        this.sendNotification(itemDetails,requestStatus)
      }
      else{
        console.log(itemDetails)
        var requestStatus = "Item Sent"
        db.collection("allBarters").doc(itemDetails.docID).update({
          "requestStatus" : "Item Sent"
        })
        this.sendNotification(itemDetails,requestStatus)
      }
    }

    sendNotification=(itemDetails,requestStatus)=>{
      var requestId = itemDetails.requestID
      var donorId = itemDetails.donorID
      db.collection("allNotifications")
      .where("requestID","==", requestId)
      .where("donorID","==",donorId)
      .get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var message = ""
          if(requestStatus === "Item Sent"){
            message = this.state.donorName + " sent you item"
          }else{
             message =  this.state.donorName  + " has shown interest in donating the item"
          }
          db.collection("allNotifications").doc(doc.id).update({
            "message": message,
            "notificationStatus" : "unread",
            "date"                : firebase.firestore.FieldValue.serverTimestamp()
          })
        });
      })
    }

    componentDidMount(){
        this.getDonorDetails(this.state.donorId)
        this.getAllDonations();
    }

    componentWillUnmount(){
      this.requestRef();
    }

    keyExtractor =(item,index)=> index.toString();

    renderItem=({item,i})=>(
        <ListItem 
        key={i}
        title={item.itemName}
        subtitle = {"Requested by: " + item.requestedBy + "\nStatus:" + item.requestStatus}
        leftElement={<Icon icon name="list" color="#696969"
        titleStyle={{color: "black", fontWeight: "bold"}}/>}
        rightElement={
          <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor : item.requestStatus === "Item Sent" ? "green" : "#ff5722"
            }
          ]}
          onPress = {()=>{
            this.sendItem(item)
          }}
         >
           <Text style={{color:'#ffff'}}>{
             item.requestStatus === "Item Sent" ? "Item Sent" : "Send item"
           }</Text>
         </TouchableOpacity>
        }
        bottomDivider />
    )

    render(){
        return(
          <View style={{flex:1}}>
            <MyHeader navigation={this.props.navigation} title="My Donations"/>
            <View style={{flex:1}}>
              {
                this.state.allDonations.length === 0
                ?(
                  <View style={styles.subtitle}>
                    <Text style={{ fontSize: RFValue(20)}}>List of all item Donations</Text>
                  </View>
                )
                :(
                  <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.allDonations}
                    renderItem={this.renderItem}
                  />
                )
              }
            </View>
          </View>
        )
      }   
}



const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: RFValue(20),
    justifyContent:'center',
    alignItems:'center'
  }
})