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
    let promise = new Promise((resolve, reject)=>{
      fetch('https://fv3md359db.execute-api.ap-south-1.amazonaws.com/final/readrecords')
      .then((response) => response.json())
      .then((responseJson) => {
        global.myData = responseJson
        this.setState({
          dataSource: responseJson,
        }, function(){
        });
        resolve();
      }
      
      )
      .catch((error) =>{
        console.error(error);
      });
    });

    promise.then(()=>{
      fetch('https://ep5hg5y2u0.execute-api.ap-south-1.amazonaws.com/final/dealers')
          .then((response) => response.json())
          .then((responseJson) => {
            global.people = [];
            for(var i=0;i<responseJson.length;i++)
            global.people[responseJson[i]["rfid"]] = responseJson[i]["RegNo"]
            this.setState({isLoading:false});
      });
    });
  }


showIssued(data){
      var BookNames = Object.keys(data)
      var content = [];
      var tableHead = ["Issuer", "Quantity"];
      var tableData = [];
      var qty = data["Tags"].length;

      var issued = "";
      if(data.hasOwnProperty('Issued'))
        {
          var temp = Object.keys(data["Issued"]);
          for(var i=0; i<temp.length; i++ )
              issued +=  global.people[data["Issued"][temp[i]]]  + " - " + temp[i] + "\n";
        }
      else
        issued = "None"
      tableData.push([issued,qty])
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
getKeyByValue(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}
 renderTable(){
  const data = global.myData;
  const ppl = global.people;
  const myjson = global.myData.filter(function(item, index, array){
    if(this.state.search=='')
        return true;
    else if(item["Name"].toUpperCase().indexOf(this.state.search.toUpperCase()) > -1)
        return true;
    else if(item.hasOwnProperty('Issued'))
       if(Object.values(item["Issued"]).indexOf(this.getKeyByValue(ppl,this.state.search)) > -1)
       return true;
    else
        return false;
  }.bind(this));

  var table = [];

  for (let i=0; i < myjson.length; i++){
    table.push(
        <View style={styles.BookContainer}>
        <Text style={styles.bookText} >Book Name - {myjson[i]["Name"]}</Text>
        {this.showIssued(myjson[i])}
      </View>
    )
  }

  return table;
 }
 _onRefresh = () => {
  this.setState({refreshing: true});
  setTimeout(() => {
    fetch('https://fv3md359db.execute-api.ap-south-1.amazonaws.com/final/readrecords')
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
        <Text style={styles.heading}>Admin Record - Smart Library</Text>
        <TextInput
      style={styles.searchBar}
      value={this.state.searchText}
      onChange={this.setSearchText.bind(this)}
      placeholder="Search Name or FULL REGNO" />
      <Text></Text>
        {this.renderTable()}
      </View>
      </ScrollView>
    );
  }
}