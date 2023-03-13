import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, Keyboard, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Fonts from "../Component/Fonts";
import images from "../Theam/Images";
import NetInfo from "@react-native-community/netinfo";
import { validators } from '../Lib/validationFunctions'
import Helper from '../Lib/Helper'
import AlertMsg from '../Lib/AlertMsg'
import ApiUrl from "../Lib/ApiUrl";

export default class ForgotePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
        }
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    forgotPassword() {
        Keyboard.dismiss();
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                if (
                    validators.checkEmail("Email ", Helper.setTrim(this.state.email))
                ) {
                    var data = {
                        email: this.state.email.trim(),
                    }

                    Helper.globalLoader.showLoader()
                    Helper.makeRequest({ url: ApiUrl.ForgotPassword, method: "POST", data: data }).then((response) => {
                        if (response.status == 200) {
                            Helper.globalLoader.hideLoader()
                            Helper.showToast(response.message);
                            this.props.navigation.navigate('OtpForgote', { userId: response.data, email: this.state.email })
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
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.headerView}>
                    <View style={{ flex: 0.3, }}>
                        <TouchableOpacity onPress={() => { this.goBack() }} style={{ width: 40 }}>
                            <Image style={styles.menuIcon} source={images.left_arrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <Text style={styles.topText}>Forgot Password</Text>
                    </View>
                </View>
                <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                    <View style={{ marginHorizontal: 45, marginTop: '20%' }}>
                        <View style={[styles.inputView, { marginTop: 40, }]}>
                            <Text style={[styles.lableText, { top: this.state.email ? 10 : 30, }]}>EMAIL</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Image style={styles.inputIcon} source={this.state.email ? images.MailIcon : images.mailDic} />
                                <TextInput style={styles.inputStyle}
                                    placeholder=""
                                    onChangeText={(text) => { this.setState({ email: text }) }}
                                    value={this.state.email}
                                    underlineColorAndroid="transparent"
                                    returnKeyType='done'
                                    keyboardType='email-address'
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => { this.forgotPassword() }} style={styles.buttonView}>
                            <Text style={styles.buttonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    inputView: { height: 50, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#D4D4D4' },
    lableText: { color: '#CFCFCF', fontSize: 16, marginLeft: 30 },
    inputStyle: { color: '#11345F', fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, width: '90%', marginLeft: 10,  height:50, bottom:5 },
    inputIcon: { height: 16, width: 20, resizeMode: 'contain', marginTop: 13 },
    buttonText: { fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, color: 'white' },
    buttonView: { backgroundColor: '#113562', marginHorizontal: 25, paddingVertical: 15, borderRadius: 28, alignItems: 'center', marginTop: '20%' },
    headerView: { flexDirection: 'row', marginTop: 20, alignItems: 'center', marginHorizontal: 15 },
    menuIcon: { height: 20, width: 20, resizeMode: 'contain' },
    topText: { fontSize: 22, color: '#123460', fontFamily: Fonts.Poppins_SemiBold },
});