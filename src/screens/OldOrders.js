import React from 'react';
import {Image, Text, View, ScrollView} from 'react-native';
import {Button} from '../components/Button'
import OrderInfoOld from '../components/OrderInfoOld'
import firebase from 'firebase/app'
import 'firebase/database'

import {connect,useSelector,useDispatch} from 'react-redux'
import {addOldOrders} from '../redux/action'
import {styles} from '../components/Style'
import {reloadOrders} from '../function/reloadOrders'

 const OldOrders = ({user,navigation,oldOrders}) => {
   let dispatch = useDispatch()
   const setSeeThisOrder = (idOrder,keyOrder) => {
     firebase.database().ref(`orders/${idOrder}/`).update({[`seeThisOrder${user.status}`]:true})
     let oldOrdersDub = oldOrders
     oldOrdersDub[keyOrder][`seeThisOrder${user.status}`] = true
     dispatch(addOldOrders(oldOrdersDub))
   }
    return (
      <ScrollView style={[styles.container,styles.profileWrapper]}>
        <View style={styles.p_fsm}>
          <Button title='Обновить' onPress={()=>reloadOrders(user.orders,dispatch,user)}/>
        </View>
        <View style={oldOrders[0] ? styles.p_fsm : ''}>
          {oldOrders[0] ? oldOrders.map((item,id) => {
            return <OrderInfoOld setSee={setSeeThisOrder} data={item} id ={id} key={id}/>
          }) :
            <View style={[styles.notOrder,styles.flex,styles.ai_c,styles.jc_c]}>
              <Text style={[styles.all,styles.bold,styles.darkPinkColor]}>
                Пока здесь ничего нет
              </Text>
            </View>}
        </View>
      </ScrollView>
    );
};

OldOrders.navigationOptions = {
    title: 'Orders'
};

let mapStoreToProps = (store) => ({
  user:store.register.user,
  oldOrders:store.register.oldOrders
})

export default connect(mapStoreToProps)(OldOrders)
