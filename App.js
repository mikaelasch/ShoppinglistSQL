import React, { useState, useEffect } from 'react'
import { StyleSheet,View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite'
import { Header, Input, Button, ListItem } from 'react-native-elements';


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
  


    return (
    <View style={styles.container}>
      <Header
          centerComponent={{ 
            text: 'SHOPPING LIST',
            style: { color: '#fff' } }}/>
      <Input 
        label="Product"
         placeholder='Product' 
         onChangeText={product => setProduct(product)}
         value={product}/>
      <Input 
        label="Amount"
         placeholder='Amount'
         onChangeText={amount => setAmount(amount)} 
         value={amount}/>
      <Button 
        title="Save" 
        type="outline"
        onPress={saveItem}/>
      
      <FlatList 
         keyExtractor={item => item.id.toString()} 
         renderItem={({item}) =>
        <ListItem>
        <ListItem.Content>
         <ListItem.Title>{item.product}</ListItem.Title>
         <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
        </ListItem.Content>
        </ListItem>}
       
        //<Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}>done</Text>}    
       
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
