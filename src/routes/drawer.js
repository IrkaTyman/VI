import React from 'react'
import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator
} from '@react-navigation/drawer';
import {createAppContainer} from 'react-navigation';
import {Text,View,Image} from 'react-native'
import {FontAwesome} from '@expo/vector-icons'
import {connect, useDispatch} from 'react-redux'
import {removePerson,addNowOrder,addOldOrders} from '../redux/action'
import {Svg,Path,Circle} from 'react-native-svg'
import firebase from 'firebase'
import {addOrdersIdToUser} from '../function/addOrdersIdToUser'

//Stack
import HomeStack from './homeStack'
import NewOrdersStack from './newOrdersStack'
import NowOrdersStack from './nowOrdersStack'
import OldOrdersStack from './oldOrdersStack'
import BalanceStack from './balanceStack'
import ReferenceStack from './referenceStack'

import {styles,fontSizeMain} from '../components/Style'
import {Home,Cart,Wallet,Support,Question} from '../components/SVG'


const DrawerContent = (props) => {
  const user = props.user
  const dispatch = useDispatch()
  const db= firebase.database().ref('orders')

  const takeNewOrder = () => {
    if(!props.nowOrder.client){
      db.orderByChild('designer').equalTo('').get().then((snap)=>{
        if(snap.exists()){
          let date = new Date()
          let timeMin = date.setHours(date.getHours() + 9)
          let id
          let order={}
          Object.keys(snap.val()).map((item) => {
            if(snap.val()[item].dateComplete < timeMin){
              timeMin=snap.val()[item].dateComplete
              id = +item
              order = snap.val()[item]
            }
          })
          order.designer = user.email
          order.dateTake = date.getTime()
          console.log(order)
          firebase.database().ref('orders/'+id).set(order)
          addOrdersIdToUser(user,dispatch,id)
          dispatch(addNowOrder(order))
        }
      }).catch((err)=>console.log(err))
      props.navigation.navigate('NowOrders')
    }
  }
  const signOut = () => {
    dispatch(addNowOrder({}))
    dispatch(addOldOrders([]))
    dispatch(removePerson('Log out'))
  }

  return(
    <View style={styles.drawer}>
    <DrawerContentScrollView>
        <View style={styles.drawerInfo}>
        <Image
          source={{uri:user.img}}
          style={[styles.drawerInfo_Ava,styles.avaImg]}/>
          <View>
            <Text style={[styles.all,styles.profileInfoTextName,styles.profileInfoText,styles.darkPinkColor]}>{user.username}</Text>
            <Text style={[styles.all,styles.profileInfoText,styles.darkPinkColor]}>{user.status}</Text>
          </View>
        </View>
      <View>
        <DrawerItem
          label='Профиль'
          icon = { () => <Home width={fontSizeMain} height={fontSizeMain}/>}
          onPress={() => props.navigation.navigate('Home')}
          labelStyle = {styles.all}
        />
        <View style={styles.drawerOrdersWrapper}>
          <View style={{flexDirection:'row'}}>
            <Cart width={fontSizeMain} height={fontSizeMain}/>
            <Text style={[styles.all,{marginLeft:fontSizeMain*2}]}>Заказы</Text>
          </View>
          <DrawerItem
            label='+ Новый заказ'
            onPress={() => user.status=='designer' ? takeNewOrder() : props.navigation.navigate('NewOrders')}
            labelStyle = {[styles.all,styles.drawerOrdersItem]}
          />
          <DrawerItem
            label='Текущие'
            onPress={() => props.navigation.navigate('NowOrders')}
            labelStyle = {[styles.all,styles.drawerOrdersItem]}
          />
          <DrawerItem
            label='Готовые'
            onPress={() => props.navigation.navigate('OldOrders')}
            labelStyle = {[styles.all,styles.drawerOrdersItem]}
          />
        </View>

        <DrawerItem
          label='Баланс'
          icon = { () => <Wallet width={fontSizeMain} height={fontSizeMain}/>}
          onPress={() => props.navigation.navigate('BalanceDesigner')}
          labelStyle = {styles.all}
        />
        <DrawerItem
          label='Поддержка'
          icon = { () => <Support width={fontSizeMain} height={fontSizeMain}/>}
          onPress={() => props.navigation.navigate('Home')}
          labelStyle = {styles.all}
        />
        <DrawerItem
          label='Справка'
          icon = { () => <Question width={fontSizeMain} height={fontSizeMain}/>}
          onPress={() => props.navigation.navigate('Reference')}
          labelStyle = {styles.all}
        />
        <DrawerItem
          label='Выйти'
          icon = {() => <FontAwesome name='sign-out' size={fontSizeMain} color='#D25C5C'/>}
          onPress={signOut}
          labelStyle = {styles.all}
          style = {styles.logOut}
        />

      </View>
      </DrawerContentScrollView>
    </View>
  )
}

let mapStoreToProps = (store) => ({
  user:store.register.user,
  nowOrder:store.register.nowOrder
})

export default connect(mapStoreToProps)(DrawerContent)
