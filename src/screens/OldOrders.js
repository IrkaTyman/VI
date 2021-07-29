import React from 'react';
import {Image, Text, View, ScrollView} from 'react-native';
import {Button} from '../components/Button'
import OrderInfoOld from '../components/OrderInfoOld'
import {ordersGot} from '../static/data'

import {connect,useSelector,useDispatch} from 'react-redux'
import {actionCreators as actions,addPerson} from '../redux/action'
import {styles} from '../components/Style'

 const OldOrders = ({user,navigation}) => {
    return (
      <ScrollView style={[styles.container,styles.profileWrapper]}>
        <View style={ordersGot[0] ? styles.ordersBlock : ''}>
          {ordersGot[0] ? ordersGot.map((item,id) => {
            return <OrderInfoOld data={item} id={id} key={id}/>
          }) :
            <View style={styles.notOrder}>
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
  user:store.register.user
})

export default connect(mapStoreToProps)(OldOrders)
