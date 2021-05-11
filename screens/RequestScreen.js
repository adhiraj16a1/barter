import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Alert,Image} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import {RFValue} from 'react-native-responsive-fontsize';
import MyHeader from '../components/MyHeader'
import {SearchBar,ListItem} from 'react-native-elements'

export default class RequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userID : firebase.auth().currentUser.email,
      itemName:"",
      reasonToRequest:"",
      isItemRequestActive : "",
      requesteditemName: "",
      itemStatus:"",
      requestID:"",
      userdocID: '',
      docID :'',
      Imagelink: '',
      dataSource:"",
      showFlatlist: false
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (itemName,reasonToRequest)=>{
    var userID = this.state.userID
    var randomrequestID = this.createUniqueId()
    db.collection('requestedItems').add({
        "userID": userID,
        "itemName":itemName,
        "reasonToRequest":reasonToRequest,
        "requestID"  : randomrequestID,
        "itemStatus" : "requested",
         "date"       : firebase.firestore.FieldValue.serverTimestamp(),
    })

    await  this.getitemRequest();
    db.collection('users').where("emailID","==",userID).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
            isItemRequestActive: true
      })
    })
  })

    this.setState({
        itemName :'',
        reasonToRequest : '',
        requestID: randomrequestID
    })

    return Alert.alert("item Requested Successfully")
  }

receiveditems=(itemName)=>{
  var userID = this.state.userID
  var requestID = this.state.requestID
  db.collection('receivedItems').add({
      "userID": userID,
      "itemName":itemName,
      "requestID"  : requestID,
      "itemStatus"  : "received",

  })
}

getRequestStatus(){
  db.collection('users').where('emailID','==',this.state.userID)
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
      this.setState({
        isItemRequestActive:doc.data().isItemRequestActive,
        userdocID : doc.id
      })
    })
  })
}

getitemRequest =()=>{
var itemRequest=  db.collection('requestedItems').where('userID','==',this.state.userID)
  .get().then((snapshot)=>{
    snapshot.forEach((doc)=>{
      if(doc.data().itemStatus !== "received"){
        this.setState({
          requestID : doc.data().requestID,
          requesteditemName: doc.data().itemName,
          itemStatus:doc.data().itemStatus,
          docID     : doc.id
        })
      }
    })
})}

sendNotification=()=>{
  db.collection('users').where('emailID','==',this.state.userID).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().firstName
      var lastName = doc.data().lastName

      db.collection('allNotifications').where('requestID','==',this.state.requestID).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var donorID  = doc.data().donorID
          var itemName =  doc.data().itemName

          db.collection('allNotifications').add({
            "receiverID" : donorID,
            "message" : name +" " + lastName + " received the item " + itemName ,
            "notificationStatus" : "unread",
            "itemName" : itemName
          })
        })
      })
    })
  })
}

componentDidMount(){
  this.getitemRequest()
  this.getRequestStatus()


}

updateitemRequestStatus=()=>{

  db.collection('requestedItems').doc(this.state.docID)
  .update({
    itemStatus : 'received'
  })

  db.collection('users').where('emailID','==',this.state.userID).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      db.collection('users').doc(doc.id).update({
        isItemRequestActive: false
      })
    })
  })
}

 render(){
    if(this.state.isItemRequestActive === true){
      return(
        <View style = {{flex:1,justifyContent:'center'}}>
          <View 
          style={styles.view}>
          <Text>Item Name</Text>
          <Text>{this.state.requesteditemName}</Text>
          </View>
          <View style={styles.view}>
          <Text>Item Status </Text>

          <Text>{this.state.itemStatus}</Text>
          </View>

          <TouchableOpacity style={styles.button}
          onPress={()=>{
            this.sendNotification()
            this.updateitemRequestStatus();
            this.receiveditems(this.state.requesteditemName)
          }}>
          <Text>I received the item </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
    {
    return(
        <View style={{flex:1}}>
          <MyHeader title="Request an Item" navigation ={this.props.navigation}/>

          <TextInput
            style ={styles.formTextInput}
            placeholder={"enter item name"}
            onChangeText={text => this.getitemsFromApi(text)}
            onClear={text => this.getitemsFromApi('')}
            value={this.state.itemName}
          />

      {  this.state.showFlatlist ?

        (  <FlatList
        data={this.state.dataSource}
        renderItem={this.renderItem}
        enableEmptySections={true}
        style={{ marginTop: 10 }}
        keyExtractor={(item, index) => index.toString()}
      /> )
      :(
        <View style={{alignItems:'center'}}>
        <TextInput
          style ={[styles.formTextInput,{height:300}]}
          multiline
          numberOfLines ={8}
          placeholder={"Why do you need the item"}
          onChangeText ={(text)=>{
              this.setState({
                  reasonToRequest:text
              })
          }}
          value ={this.state.reasonToRequest}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={()=>{ 
              this.addRequest(this.state.itemName,this.state.reasonToRequest);
          }}
          >
          <Text>Request</Text>
        </TouchableOpacity>
        </View>
      )
    }
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    },
    view: {
        borderColor:"orange",
        borderWidth:2,
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        margin:10
    }
  }
)
