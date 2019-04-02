import React from 'react';
import {  TextInput, RefreshControl,ScrollView, ActivityIndicator, StyleSheet, Text, View  } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const styles = StyleSheet.create({
  heading: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#114466',
    fontSize: 30,
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center'
  },
  BookContainer: {
    backgroundColor: '#114466',
    color: 'white',
    padding: 5,
    paddingBottom:9,
    marginBottom: 2
  },
  bookText : {
    color:'white',
    fontWeight: 'bold',
  },
  container: { padding: 12, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
  whiteText : {color:'white'},

  searchBar: {
    paddingLeft: 30,
    fontSize: 22,
    height: 50,
    borderWidth: 9,
    borderColor: '#112266',
  },
});

export default class FetchExample extends React.Component {

  constructor(props){
    super(props);
    this.state =
    { 
      isLoading: true,
      refreshing: false,
      search: '',
    }
  }

  componentDidMount(){
    return fetch('https://fv3md359db.execute-api.ap-south-1.amazonaws.com/final/readallposition')
      .then((response) => response.json())
      .then((responseJson) => {
        global.myData = responseJson
        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }


 BookLocation(data){
      var BookNames = Object.keys(data)
      var content = [];
      var tableHead = ["Book Location", "Quantity"];
      var tableData = [];
      for(let i=0; i<BookNames.length;i++)
      {
          var qty = data[BookNames[i]].length;
          if(qty>0)
          {  var row = [BookNames[i], qty];
            tableData.push(row);
          }
      }
      content.push(
        <View style = {styles.container} >
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
          <Rows data={tableData} textStyle={styles.text}/>
        </Table>
        </View>
      )
      return content;
    }

 renderTable(){
  const data = global.myData;
  const myjson = global.myData.filter(function(item, index, array){
    if(this.state.search=='')
        return true;
    else if(data[index]["Name"].indexOf(this.state.search) > -1)
        return true;
    else
        return false;
  }.bind(this));

  var table = [];

  for (let i=0; i < myjson.length; i++){
    table.push(
      <View style={styles.BookContainer}>
        <Text style={styles.bookText} >Book Name - {myjson[i]["Name"]}</Text>
        <Text style={styles.whiteText} >Position of Book</Text>
        {this.BookLocation(myjson[i]["Location"])}
      </View>
    )
  }

  return table;
 }
 _onRefresh = () => {
  this.setState({refreshing: true});
  setTimeout(() => {
    fetch('https://fv3md359db.execute-api.ap-south-1.amazonaws.com/final/readallposition')
        .then((response) => response.json())
        .then((responseJson) => {
          global.myData = responseJson;
          this.setState({refreshing: false})
        })
        .catch((error) =>{
          console.error(error);
        });
      },2000);
}

setSearchText(event) {
  let searchText = event.nativeEvent.text;
  this.setState({search : searchText});
  return searchText;
}

  render(){
    
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
    
    return(
      <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />

      }
      >
        <View style={{flex: 1, paddingTop:40, backgroundColor:"white"}}>
        <Text style={styles.heading}>Smart Library Prototype</Text>
        <TextInput
      style={styles.searchBar}
      value={this.state.searchText}
      onChange={this.setSearchText.bind(this)}
      placeholder="Search" />
        {this.renderTable()}
      </View>
      </ScrollView>
    );
  }
}