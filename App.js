import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Alert, TextInput, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite'

export default function App() {
  const [product, setProduct] = useState('')
  const [amount, setAmount] = useState('')
  const [items, setItems] = useState([])

  const db = SQLite.openDatabase('shoppinglist.db')

  useEffect(() => {
      db.transaction(tx => {    
      tx.executeSql('create table if not exists shoppinglist (id integer primary key    not null, product text, amount text);');  }, 
      //Alert.alert('Table not created'), 
      null,
      updateList);}, []);

  const saveItem = () => {
      db.transaction(tx => {   
      tx.executeSql('insert into shoppinglist (product, amount) values (?, ?);',[product, amount]);    },
      //Alert.alert('Item not saved'), 
      null,
      updateList)}
  
  const updateList = () => { 
      db.transaction(tx => { 
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) => 
           setItems(rows._array)    );   },
           //Alert.alert('Can not update list'),
           null,
           null);}
  
  const deleteItem = (id) => { 
      db.transaction(tx => {
      tx.executeSql('delete from shoppinglist where id = ?;',
       [id]);},
       //Alert.alert('item not deleted'),
       null,
       updateList
       ) }
  

   const listSeparator = () => {
        return (
          <View
            style={{
              height: 5,
              width: "80%",
              backgroundColor: "#fff",
              marginLeft: "10%"
            }}
          />
        );
      };


    return (
    <View style={styles.container}>
      <TextInput style={{ marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1 }}
         placeholder='Product' 
         onChangeText={product => setProduct(product)}
         value={product}/>
      <TextInput style={{ marginTop: 5, marginBottom: 5, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1 }}
         placeholder='Amount'
         onChangeText={amount => setAmount(amount)} 
         value={amount}/>
      <Button onPress={saveItem}title="Save" />
      <Text style={{ marginTop: 30, fontSize: 20 }}>Shopping list</Text>
      <FlatList style={{marginLeft : "5%"}} 
         keyExtractor={item => item.id.toString()} 
         renderItem={({item}) =>
        <View style={styles.listcontainer}>
        <Text style={{ fontSize: 18 }}>{item.product},{item.amount} </Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}>done</Text></View>}    
        ItemSeparatorComponent={listSeparator} 
        data={items} /> 


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
});
