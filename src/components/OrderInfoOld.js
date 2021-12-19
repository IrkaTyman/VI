import React, { Component} from "react";
import { View,Image, TouchableOpacity, Text, Platform,LayoutAnimation,UIManager} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import {styles,fontSizeMain,sliderBAWidth,colors,SCREEN_WIDTH} from './Style';
import {SliderBA} from '../components/SliderBA'
import {currencySpelling} from '../function/currencySpelling'
import {getNormalDate} from '../function/getNormalDate'
import {localeStatusOrder} from '../function/localeStatusOrder'
import {BeforeAfterSlider} from './BeforeAfterSlider'

//REDUX
import {connect,useSelector,useDispatch} from 'react-redux'

class OrderInfoOld extends Component {
  state = {
    expanded:false,
    height:this.props.data.height,
    id:this.props.id,
  }

  componentDidMount(){
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  toggleExpand = () => {
    this.props.setSee(this.props.data.id,this.state.id)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({...this.state,expanded:!this.state.expanded})
  }
  render(){
    return (
      <View>
        <TouchableOpacity
          style={[styles.orderRow,styles.p_fsm,styles.fd_r,
                  styles.ai_c,styles.jc_sb,
                  {borderBottomLeftRadius:!this.state.expanded ? 10 : 0,
                    borderBottomRightRadius:!this.state.expanded ? 10 : 0},
                  this.props.data[`seeThisOrder${this.props.user.status}`] ? styles.orderRowSee : null]}
          onPress={()=>this.toggleExpand()}>
          <Image
            source={{uri:this.props.data.afterImg}}
            style={[styles.headerAvaImg,styles.avaImg]}/>
          <Text style={[styles.all,this.props.data[`seeThisOrder${this.props.user.status}`] ? styles.darkPinkColor : styles.whiteColor]}>
            {getNormalDate(this.props.data.dateCreate,false,true)}
          </Text>
          {SCREEN_WIDTH > 600
            ? <View style={[styles.starsRow,styles.fd_r,styles.ai_c,styles.jc_sb]}>
                  {[...Array(5)].map((item,id) => {
                    return(
                      <AntDesign key={id} name="star" size={fontSizeMain*1.8} color={this.props.data.rating > id ? "#ffc36d" : '#B8B8B8'} />
                    )}
                  )}
              </View>
            : <View style={[styles.fd_r,styles.ai_c]}>
                <Text style={[styles.all,this.props.data[`seeThisOrder${this.props.user.status}`] ? styles.darkPinkColor : styles.whiteColor,{marginRight:fontSizeMain*0.3}]}>{this.props.data.rating}</Text>
                <AntDesign name="star" size={fontSizeMain*1.1} color="#ffc36d" />
              </View>
          }
          <AntDesign name={this.state.expanded ? 'up' :  'down'} size={fontSizeMain} color={this.props.data[`seeThisOrder${this.props.user.status}`] ? colors.darkPink : "#fff"}/>
        </TouchableOpacity>
        <View style={styles.orderParentHr}/>
      {
        this.state.expanded &&
        <View style={styles.orderChild}>
          <BeforeAfterSlider width={sliderBAWidth} height={this.state.height*sliderBAWidth} photo={[this.props.data.beforeImg,this.props.data.afterImg]}/>
          <View style={styles.orderDescriptGroup}>
            <Text style={[styles.all,styles.orderDescript]}><Text style={[styles.all,styles.bold]}>Взят в работу:</Text> {getNormalDate(this.props.data.dateTake)}</Text>
            <Text style={[styles.all,styles.orderDescript]}><Text style={[styles.all,styles.bold]}>Завершен:</Text> {getNormalDate(this.props.data.dateCompleteDesigner)}</Text>
            <Text style={[styles.all,styles.orderDescript,styles.bold]}>Статус:<Text style={{color:'green'}}> {localeStatusOrder(this.props.data.status)}</Text></Text>
          </View>
          <View style={styles.orderDescriptGroup}>
            <Text style={[styles.all,styles.orderDescript,styles.bold]}>Задание:</Text>
            {this.props.data.param.map((item,id) => <Text key={id} style={[styles.all,styles.orderDescript]}>{item}</Text>)}
          </View>
          <Text style={[styles.all,styles.orderDescript,styles.bold]}>Ваша оценка:</Text>
          <View style={[styles.starsRow,styles.fd_r,styles.ai_c,styles.jc_sb,{marginBottom:fontSizeMain*1.5}]}>
                {[...Array(5)].map((item,id) => {
                  return(
                    <AntDesign key={id} name="star" size={fontSizeMain*1.8} color={this.props.data.rating > id ? "#ffc36d" : '#B8B8B8'} />
                  )}
                )}
          </View>
          {this.props.data.comment != ''
            ? <View>
                <Text style={[styles.all,styles.orderDescript,styles.bold]}>Комментарий к заказу</Text>
                <Text style={[styles.all,{marginBottom:fontSizeMain*1.5}]}>{this.props.data.comment}</Text>
              </View>
            : null
          }
          <View style={styles.orderDescriptGroup}>
            <Text style={[styles.all,styles.orderDescript]}><Text style={[styles.all,styles.orderDescript,styles.bold]}>{this.props.user.status == 'client' ? 'Вы заплатили: ' : 'Вы заработали: '} </Text>{currencySpelling(this.props.user.status == 'client' ? this.props.data.amount : this.props.data.amountDesigner)}</Text>
          </View>
        </View>
      }
      </View>
    )
  }}

  let mapStoreToProps = (store) => ({
    user:store.register.user
  })

  export default connect(mapStoreToProps)(OrderInfoOld)
