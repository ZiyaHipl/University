import React, { Component } from "react";
import { Text, View, StyleSheet, ImageBackground, TextInput, Image, TouchableOpacity, Keyboard, SafeAreaView, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Fonts from "../Component/Fonts";
import images from "../Theam/Images";
import NetInfo from "@react-native-community/netinfo";
import { validators } from '../Lib/validationFunctions'
import Helper from '../Lib/Helper'
import AlertMsg from '../Lib/AlertMsg'
import ApiUrl from "../Lib/ApiUrl";

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      passShow: false
    }
  }

  onCreatAccountClick = () => {
    this.props.navigation.navigate('SignUp')
  }

  onTabLogin = () => {
    this.props.navigation.navigate('DrawerStack')
  }

  onShowPassword = () => {
    this.setState({ passShow: !this.state.passShow })
  }


  loginAccount() {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
        return false;
      } else {
        if (
          validators.checkEmail("Email ", Helper.setTrim(this.state.email)) &&
          validators.checkPassword("Password", 7, 15, Helper.setTrim(this.state.password))
        ) {
          var data = {
            email: this.state.email.trim(),
            password: this.state.password.trim(),
            device_token: Helper.device_token,
            device_type: Helper.device_type,
          }
          Helper.globalLoader.showLoader()
          Helper.makeRequest({ url: ApiUrl.Login, method: "POST", data: data }).then((response) => {
            if (response.status == 200) {
              console.log('LOGINDATA', JSON.stringify(response.data));
              let reData = response.data
              Helper.setData('token', reData)
              Helper.UserInfo = reData
              Helper.user_id = response.data.id
              Helper.setData('userdata', reData)
              this.onTabLogin()
              Helper.globalLoader.hideLoader()
            }
            else {
              Helper.globalLoader.hideLoader()
              Helper.showToast(response.message);
            }
          }).catch(err => {
            Helper.globalLoader.hideLoader()
          })
        }
      }
    })
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, }}>
        <ImageBackground resizeMode={'stretch'} style={{ flex: 1 }} source={images.TopImage}>
          <KeyboardAwareScrollView enableOnAndroid={false} bounces={false} showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always">
            <View style={{ marginHorizontal: 45 }}>
              <Text style={styles.loginText}>Login</Text>
              <Text style={styles.pleaseText}>Please sign In to continue.</Text>
              <View style={[styles.inputView, { marginTop: 40, }]}>
                <Text style={[styles.lableText, { top: this.state.email ? 10 : 30, }]}>EMAIL</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Image style={styles.inputIcon} source={this.state.email ? images.MailIcon : images.mailDic} />
                  <TextInput style={styles.inputStyle}
                    placeholder=""
                    onChangeText={(text) => { this.setState({ email: text }) }}
                    value={this.state.email}
                    underlineColorAndroid="transparent"
                    returnKeyType='next'
                    keyboardType='email-address'
                    ref={(input) => { this.email = input; }}
                    onSubmitEditing={() => { this.password.focus(); }}
                  />
                </View>
              </View>
              <View style={[styles.inputView, { marginTop: 40, }]}>
                <Text style={[styles.lableText, { top: this.state.password ? 10 : 30, }]}>PASSWORD</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Image style={styles.inputIcon} source={this.state.password ? images.passwordAct : images.Password} />
                  <TextInput style={styles.inputStyle}
                    placeholder=""
                    onChangeText={(text) => { this.setState({ password: text }) }}
                    value={this.state.password}
                    maxLength={15}
                    underlineColorAndroid="transparent"
                    secureTextEntry={this.state.passShow == true ? false : true}
                    returnKeyType='done'
                    ref={(input) => { this.password = input; }}
                  />
                  <TouchableOpacity onPress={() => { this.onShowPassword() }}>
                    <Image style={styles.eyeIcon} source={this.state.passShow ? images.passHide : images.passShow} />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('ForgotePassword') }}>
                <Text style={styles.forgotText}>FORGOT</Text>
              </TouchableOpacity>
              <View style={{ alignItems: 'flex-end', marginTop: 44 }}>
                <TouchableOpacity onPress={() => { this.loginAccount() }} style={styles.buttonView}>
                  <Text style={styles.buttonText}>LOGIN</Text>
                  <Image style={styles.rightIcon} source={images.RightIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bottomTextView}>
              <Text style={styles.dontText}>Don't have an account?</Text>
              <TouchableOpacity style={{ paddingVertical: 5, paddingRight: 5 }} onPress={() => { this.onCreatAccountClick() }}>
                <Text style={styles.signUpText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  loginText: { fontFamily: Fonts.Poppins_SemiBold, fontSize: 25, color: '#123460', marginTop: '60%' },
  pleaseText: { fontSize: 16, color: '#949494', fontFamily: Fonts.Poppins_Regular },
  inputView: { height: 50, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#D4D4D4' },
  lableText: { color: '#CFCFCF', fontSize: 16, marginLeft: 30 },
  inputStyle: { color: '#11345F', fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, width: '85%', marginLeft: 10, height:50, bottom:10 },
  inputIcon: { height: 16, width: 20, resizeMode: 'contain', marginTop: 13 },
  forgotText: { marginLeft: 'auto', marginTop: 11, color: '#11345F', fontFamily: Fonts.Poppins_Medium },
  buttonView: { backgroundColor: '#113562', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 28, flexDirection: 'row' },
  buttonText: { fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, color: 'white' },
  rightIcon: { height: 16, width: 24, resizeMode: 'contain', alignSelf: 'center', marginLeft: 11 },
  bottomTextView: { alignItems: 'center', justifyContent: 'center', marginTop: 30, flexDirection: 'row' },
  dontText: { color: '#8f8d8d', fontSize: 16, fontFamily: Fonts.Poppins_Regular },
  signUpText: { color: '#113562', fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, marginLeft: 8, },
  eyeIcon: { height: 20, width: 20, resizeMode: 'contain', top: 5 }
});