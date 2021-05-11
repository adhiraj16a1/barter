import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class MyReceivedItemsScreen extends Component{
  constructor(){
    super()
    this.state = {
      userID  : firebase.auth().currentUser.email,
      receivedItemsList : []
    }
  this.requestRef= null
  }

  getreceivedItemsList =()=>{
    this.requestRef = db.collection("requestedItems")
    .where('userID','==',this.state.userID)
    .where("itemStatus", '==','received')
    .onSnapshot((snapshot)=>{
      var receivedItemsList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        receivedItemsList : receivedItemsList
      });
    })
  }

  componentDidMount(){
    this.getreceivedItemsList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    console.log(item.item_name);
    return (
      <ListItem
        key={i}
        title={item.itemName}
        subtitle={item.itemStatus}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Received items" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.receivedItemsList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>You haven't received any items yet</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.receivedItemsList}
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
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})