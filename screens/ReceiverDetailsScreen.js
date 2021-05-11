import * as React from 'react';
import {Text, View, StyleSheet, TextInput, 
TouchableOpacity,KeyboardAvoidingView, Alert} from 'react-native';
import db from '../config';
import {Header,Icon,Card} from 'react-native-elements';
import firebase from 'firebase';
import {RFValue} from 'react-native-responsive-fontsize';

export default class ReceiverDetailsScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId: firebase.auth().currentUser.email,
            receiverId: this.props.navigation.getParam("details")["userID"],
            requestId: this.props.navigation.getParam("details")["requestID"],
            itemName: this.props.navigation.getParam("details")["itemName"],
            reasonForRequesting: this.props.navigation.getParam("details")["reasonToRequest"],
            receiverName: "",
            receiverContact: "",
            receiverAddress: "",
            receiverRequestDocId: "",
            userName: ""
        }
    }

    getDonorDetails=(userId)=>{
        db.collection("users").where("emailID","==", userId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            this.setState({
              "userName" : doc.data().firstName + " " + doc.data().lastName
            })
          });
        })
      }

    getReceiverDetails(){
        db.collection("users").where("emailID","==",this.state.receiverId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiverName: doc.data().firstName,
                    receiverContact: doc.data().contact,
                    receiverAddress: doc.data().address,
                })
            })
        })
        db.collection("requestedItems").where("requestID","==",this.state.requestId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({receiverRequestDocId: doc.id});
            })
        })
    }

    componentDidMount(){
        this.getReceiverDetails();        
        this.getDonorDetails(this.state.userId);
    }

    updateItemStatus=()=>{
        db.collection("allBarters").add({
            itemName: this.state.itemName,
            requestID: this.state.requestId,
            requestedBy: this.state.receiverName,
            donorID: this.state.userId,
            requestStatus: "Donor Interested"
        })
    }

    addNotification=()=>{
        var message = this.state.userName + " has shown interest in donating the item"
        db.collection("allNotifications").add({
          "receiverID"    : this.state.receiverId,
          "donorID"            : this.state.userId,
          "requestID"          : this.state.requestId,
          "itemName"           : this.state.itemName,
          "date"                : firebase.firestore.FieldValue.serverTimestamp(),
          "notificationStatus" : "unread",
          "message"             : message
        })
      }

    render(){
        return (
            <View style={styles.container}>
                <View style={{flex: 0.1}}>
                    <Header 
                    leftComponent={<Icon name="arrow-left" type="feather"
                                    color="#696969" 
                                    onPress={()=>this.props.navigation.goBack()}/>}
                    centerComponent={{text: "DONATE ITEMS",
                                    style: {color: "white", fontSize: RFValue(20), fontWeight: "bold"}}}
                    backgroundColor = "darkblue"/>
                </View>

                <View style={{flex: 0.8, 
                                marginTop: 80, 
                                backgroundColor: "lightblue", 
                                borderWidth: 3,
                                margin: 10,
                                borderRadius: 10}}>
                    <Text style={{fontWeight: "bold", fontSize: RFValue(18), textAlign: "center"}}>
                        ITEM DESCRIPTION
                    </Text>
                    <Card>
                        <Text style={{fontWeight: "bold"}}>NAME: {this.state.itemName}</Text>
                    </Card>
                    <Card>
                        <Text style={{fontWeight: "bold"}}>REASON: {this.state.reasonForRequesting}</Text>
                    </Card>
                </View>

                <View 
                style={styles.box}>
                    <Text 
                    style={{fontWeight: "bold", fontSize: RFValue(18), textAlign: "center"}}>
                        RECEIVER INFORMATION
                    </Text>
                    <Card>
                            <Text style={{fontWeight: "bold"}}>NAME: {this.state.receiverName}</Text>
                        </Card>
                        <Card>
                            <Text style={{fontWeight: "bold"}}>CONTACT: {this.state.receiverContact}</Text>
                        </Card>
                        <Card>
                            <Text style={{fontWeight: "bold"}}>ADDRESS: {this.state.receiverAddress}</Text>
                        </Card>
                </View>

                <View style={styles.buttonContainer}>
                    {
                        this.state.receiverId !== this.state.userId
                        ? (
                            <TouchableOpacity style={styles.button}
                            onPress={()=>{
                            this.updateItemStatus()
                            this.addNotification()
                            this.props.navigation.navigate("MyBarters")
                            }}>
                                <Text style={{fontWeight: "bold", color: "white", textAlign: "center"}}>
                                    I WANT TO DONATE THIS
                                </Text>
                            </TouchableOpacity>
                        )
                        : null
                    }
                    
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
    },
    buttonContainer : {
      flex:0.3,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:200,
      height:50,
      marginTop: 5,
      justifyContent:'center',
      alignItems : 'center',
      borderRadius: 15,
      backgroundColor: 'darkblue',
    },
    box: {
        flex: 1, 
        marginTop: 40, 
        backgroundColor: "lightblue", 
        borderWidth: 3,
        margin: 10,
        borderRadius: 10}
  })