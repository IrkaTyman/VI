import React,{useState, useEffect} from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from "react-hook-form";
import firebase from 'firebase'

//REDUX
import {connect,useSelector,useDispatch} from 'react-redux'
import {addPerson} from '../redux/action'

//COMPONENTS
import { Platform, Text, View, Image,Pressable,TouchableWithoutFeedback, Keyboard } from 'react-native';
import {styles} from '../components/Style'
import {FormInput} from '../components/FormInput';
import {Button} from '../components/Button'

//VALID FORM REGEX
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const TEL_REGEX =/^((8|\+?7)[\- ]?)(\(?\d{3}\)?[\- ]?)[\d\- ]{7}$/;

const Edit = (props) => {
  const [image, setImage] = useState(null);
  const { control, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();

   useEffect(() => {
     (async () => {
       if (Platform.OS !== 'web') {
         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
         if (status !== 'granted') {
           alert('Sorry, we need camera roll permissions to make this work!');
         }
       }
     })();
   }, []);

   const submitEditBtn = (data) => {
     const dataUser = data

     for(let key in props.user){
       if(!dataUser[key] || (dataUser[key] == '' && props.user[key] != '')){
         dataUser[key] = props.user[key]
       }
     }
     if(image){
       dataUser.img = image
     }
     let emailStr = dataUser.email.replace('.','')
     dispatch(addPerson(dataUser))
     firebase.database().ref('users/' + emailStr).set(dataUser);
   }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);    
    }
  };
 return (

     <View style={[styles.container,styles.containerWithoutBlock,]}>
       <View style={styles.editNameOrSurnameOrImgWrapper}>
         <View style={{position:'relative'}}>
           <Image source = {{uri:image || props.user.img}} style={[styles.avaImg,{width:100,height:100}]}/>
           <Pressable
               onPress={pickImage}
               style={({ pressed }) => [
                 {
                   backgroundColor: pressed
                     ? 'rgba(0,0,0,0.6)'
                     : 'rgba(0,0,0,0.3)'
                 },styles.editImageWrapperAdd,styles.avaImg]}
            >
             <Ionicons name="camera-outline" size={30} color="white" />
           </Pressable>
         </View>
         <View style={styles.editNameOrSurnameWrapper}>
           <Controller
             name="username"
             defaultValue=''
             control={control}
             render={({ field: { onChange, value } }) => (
               <FormInput
                  options={{
                    maxLength:15,
                    placeholder:props.user.username,
                    onChangeText:(text) => onChange(text),
                    value:value
                  }}
                  label=""
                  styleLabel = {[styles.all,styles.labelEdit]}
                  styleInput = {[styles.all,styles.input,styles.editNameInput,styles.editNameOrSurnameInput]}


                />
             )}
           />
           <Controller
             name="surname"
             defaultValue=""
             control={control}
             render={({ field: { onChange, value } }) => (
               <FormInput
                  options={{
                     maxLength:15,
                     placeholder:props.user.surname || 'Фамилия',
                     onChangeText:(text) => onChange(text),
                     value:value
                  }}
                  label=""
                  styleLabel = {[styles.all,styles.labelEdit]}
                  styleInput = {[styles.all,styles.input,styles.editNameOrSurnameInput,styles.editSurnameInput]}
                />
             )}
           />
         </View>
       </View>
       <Controller
         name="email"
         defaultValue=""
         control={control}
         rules={{
           pattern: {
             value: EMAIL_REGEX,
             message: 'Некорректный адрес'
           }
         }}
         render={({ field: { onChange, value } }) => (
           <FormInput
               options={{
                  maxLength:15,
                  placeholder:props.user.email || '',
                  onChangeText:(text) => onChange(text),
                  value:value
               }}
              label="Электронная почта"
              styleLabel = {[styles.all,styles.labelEdit]}
              styleInput = {[styles.all,styles.input]}
              onChangeText={(text) => onChange(text)}
              value={value}
              placeholder={props.user.email || ''}
              error={errors.email}
              errorText={errors?.email?.message}
            />
         )}
       />
       <Controller
         name="tel"
         defaultValue=""
         control={control}
         rules={{
           pattern: {
             value: TEL_REGEX,
             message: 'Некорректный номер телефона'
           }
         }}
         render={({ field: { onChange, value } }) => (
           <FormInput
               options={{
                  placeholder:props.user.tel || '',
                  onChangeText:(text) => onChange(text),
                  value:value
               }}
              label="Телефон, например +79126547852"
              styleLabel = {[styles.all,styles.labelEdit]}
              styleInput = {[styles.all,styles.input,styles.editTelInput]}
              onChangeText={(text) => onChange(text)}
              value={value}
              name='tel'
              placeholder={props.user.tel || ''}
              error={errors.tel}
              errorText={errors?.tel?.message}
            />
         )}
       />
       <Controller
         name="password"
         defaultValue=""
         control={control}
         render={({ field: { onChange, value } }) => (
           <FormInput
              options = {{
                secureTextEntry:true,
                onChangeText:(text) => onChange(text),
                value:value
              }}
              label="Пароль"
              styleLabel = {[styles.all,styles.labelEdit]}
              styleInput = {[styles.all,styles.input]}
              onChangeText={(text) => onChange(text)}
              value={value}
              error={errors.password}
              errorText={errors?.password?.message}
            />
         )}
       />
       <Button onPress={handleSubmit(submitEditBtn)} title="Сохранить" />
     </View>


)};

Edit.navigationOptions = {
    title: 'Edit'
};

let mapStoreToProps = (store) => ({
  user:store.register.user
})

export default connect(mapStoreToProps)(Edit)
