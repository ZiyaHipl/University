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

export default class SetPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            password: '',
            conPassword: '',
            newPassword: false,
            conPass: false,
            userId: this.props.route.params.userId,
            Otp: this.props.route.params.Otp
        }
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    submitPassword = () => {
        this.props.navigation.navigate('Login')
    }

    onShowPassword = (value) => {
        if (value == 'password') {
            this.setState({ newPassword: !this.state.newPassword })
        }
        if (value == 'Cpassword') {
            this.setState({ conPass: !this.state.conPass })
            return
        }
    }

    setNewPassword() {
        Keyboard.dismiss();
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                if (validators.checkPassword("Password", 7, 15, Helper.setTrim(this.state.password)))
                    if (this.state.password.trim() != this.state.conPassword.trim()) {
                        Helper.showToast(AlertMsg.error.PASSWORD_NOT_MATCH)
                        return false;
                    } else {
                        var data = {
                            user_id: this.state.userId,
                            otp: this.state.Otp,
                            password: this.state.password.trim(),
                        }
                        Helper.globalLoader.showLoader()
                        Helper.makeRequest({ url: ApiUrl.SetNewPassword, method: "POST", data: data }).then((response) => {
                            if (response.status == 200) {
                                Helper.globalLoader.hideLoader()
                                Helper.showToast(response.message);
                                this.submitPassword()
                            } else {
                                Helper.globalLoader.hideLoader()
                                Helper.showToast(response.message);
                            }
                        }).catch(err => {
                            this.globalLoader.hideLoader()
                        })
                    }
            }
        })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.headerView}>
                    <View style={{ flex: 0.4, }}>
                        <TouchableOpacity onPress={() => { this.goBack() }} style={{ width: 40 }}>
                            <Image style={styles.menuIcon} source={images.left_arrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <Text style={styles.topText}>Set Password</Text>
                    </View>
                </View>
                <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                    <View style={{ marginHorizontal: 45 }}>
                        <View style={[styles.inputView, { marginTop: 40, }]}>
                            <Text style={[styles.lableText, { top: this.state.password ? 10 : 30, }]}>New Password</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Image style={styles.inputIcon} source={this.state.password ? images.passwordAct : images.Password} />
                                <TextInput style={styles.inputStyle}
                                    placeholder=""
                                    onChangeText={(text) => { this.setState({ password: text }) }}
                                    value={this.state.password}
                                    underlineColorAndroid="transparent"
                                    returnKeyType='next'
                                    secureTextEntry={this.state.newPassword == true ? false : true}
                                    ref={(input) => { this.password = input; }}
                                    onSubmitEditing={() => { this.conPassword.focus(); }}
                                />
                                <TouchableOpacity onPress={() => { this.onShowPassword('password') }}>
                                    <Image style={styles.eyeIcon} source={this.state.newPassword ? images.passHide : images.passShow} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.inputView, { marginTop: 40, }]}>
                            <Text style={[styles.lableText, { top: this.state.conPassword ? 15 : 30, }]}>Confirm Password</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Image style={styles.inputIcon} source={this.state.conPassword ? images.passwordAct : images.Password} />
                                <TextInput style={styles.inputStyle}
                                    placeholder=""
                                    onChangeText={(text) => { this.setState({ conPassword: text }) }}
                                    value={this.state.conPassword}
                                    underlineColorAndroid="transparent"
                                    returnKeyType='done'
                                    secureTextEntry={this.state.conPass == true ? false : true}
                                    ref={(input) => { this.conPassword = input; }}
                                />
                                <TouchableOpacity onPress={() => { this.onShowPassword('Cpassword') }}>
                                    <Image style={styles.eyeIcon} source={this.state.conPass ? images.passHide : images.passShow} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => { this.setNewPassword() }} style={styles.buttonView}>
                        <Text style={styles.buttonText}>SUBMIT</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    headerView: { flexDirection: 'row', marginTop: 20, alignItems: 'center', marginHorizontal: 15 },
    menuIcon: { height: 20, width: 20, resizeMode: 'contain' },
    topText: { fontSize: 22, color: '#123460', fontFamily: Fonts.Poppins_SemiBold },
    buttonView: { backgroundColor: '#113562', marginHorizontal: 70, paddingVertical: 15, borderRadius: 28, marginTop: '20%' },
    buttonText: { fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, color: 'white', textAlign: 'center' },
    inputView: { height: 50, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#D4D4D4' },
    lableText: { color: '#CFCFCF', fontSize: 16, marginLeft: 30 },
    inputStyle: { color: '#11345F', fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, width: '85%', marginLeft: 10, height:50, bottom:5 },
    inputIcon: { height: 16, width: 20, resizeMode: 'contain', marginTop: 13 },
    eyeIcon: { height: 20, width: 20, resizeMode: 'contain', top: 5 }
});