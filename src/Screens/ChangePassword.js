import React, { Component } from "react";
import { Text, View, StyleSheet, ImageBackground, Image, TouchableOpacity, TextInput, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Fonts from "../Component/Fonts";
import images from "../Theam/Images";
import NetInfo from "@react-native-community/netinfo";
import { validators } from '../Lib/validationFunctions'
import Helper from '../Lib/Helper'
import AlertMsg from '../Lib/AlertMsg'
import ApiUrl from "../Lib/ApiUrl";

export default class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            oldPassword: '',
            newPassword: '',
            conPassword: '',
            oldPass: false,
            newPass: false,
            conPass: false
        }
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    changePassword() {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                if (
                    validators.checkPassword("OldPassword ", 7, 15, Helper.setTrim(this.state.oldPassword)) &&
                    validators.checkPassword("NewPassword", 7, 15, Helper.setTrim(this.state.newPassword)) &&
                    validators.checkPassword("Confirm password", 7, 15, Helper.setTrim(this.state.conPassword))
                ) {
                    if (this.state.newPassword.trim() != this.state.conPassword.trim()) {
                        Helper.showToast(AlertMsg.error.PASSWORD_NOT_MATCH)
                        return false;
                    }
                    Helper.getData('userdata').then(async (responseData) => {
                        var data = {
                            current_password: this.state.oldPassword.trim(),
                            password: this.state.newPassword.trim(),
                            password_confirmation: this.state.conPassword.trim(),
                            token: responseData.token,
                        }

                        Helper.globalLoader.showLoader()
                        Helper.makeRequest({ url: ApiUrl.ChangePassword, method: "POST", data: data }).then((response) => {
                            console.log('===>CHANGEPASSWORD', JSON.stringify(response))
                            if (response.status == 200) {
                                Helper.showToast(response.message)
                                Helper.globalLoader.hideLoader()
                                this.goBack()
                            }
                            else {
                                Helper.globalLoader.hideLoader()
                                Helper.showToast(response.message);
                            }
                        }).catch(err => {
                            Helper.globalLoader.hideLoader()
                        })
                    });
                }
            }
        })
    }

    onShowPassword = (value) => {
        if (value == 'oldPassword') {
            this.setState({ oldPass: !this.state.oldPass })
        }
        if (value == 'newPassword') {
            this.setState({ newPass: !this.state.newPass })
            return
        }
        if (value == 'conPassword') {
            this.setState({ conPass: !this.state.conPass })
            return
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, }}>
                <ImageBackground resizeMode={'stretch'} style={{ flex: 1 }} source={images.TopImage}>
                    <TouchableOpacity onPress={() => { this.goBack() }} style={styles.backClicki}>
                        <Image style={styles.backButton} source={images.left_arrow} />
                    </TouchableOpacity>
                    <KeyboardAwareScrollView>
                        <View style={{ marginHorizontal: 45, marginTop: '20%' }}>
                            <Text style={styles.changeText}>Change Password</Text>
                            <View style={[styles.inputView, { marginTop: 40, }]}>
                                <Text style={[styles.lableText, { top: this.state.oldPassword ? 10 : 30, }]}>Password</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={styles.inputIcon} source={this.state.oldPassword ? images.passwordAct : images.Password} />
                                    <TextInput style={styles.inputStyle}
                                        placeholder=""
                                        onChangeText={(text) => { this.setState({ oldPassword: text }) }}
                                        value={this.state.oldPassword}
                                        maxLength={15}
                                        underlineColorAndroid="transparent"
                                        returnKeyType='next'
                                        secureTextEntry={this.state.oldPass == true ? false : true}
                                        ref={(input) => { this.oldPassword = input; }}
                                        onSubmitEditing={() => { this.newPassword.focus(); }}
                                    />
                                    <TouchableOpacity onPress={() => { this.onShowPassword('oldPassword') }}>
                                        <Image style={styles.eyeIcon} source={this.state.oldPass ? images.passHide : images.passShow} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.inputView, { marginTop: 40, }]}>
                                <Text style={[styles.lableText, { top: this.state.newPassword ? 10 : 30, }]}>New Password</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={styles.inputIcon} source={this.state.newPassword ? images.passwordAct : images.Password} />
                                    <TextInput style={styles.inputStyle}
                                        placeholder=""
                                        onChangeText={(text) => { this.setState({ newPassword: text }) }}
                                        value={this.state.newPassword}
                                        maxLength={15}
                                        underlineColorAndroid="transparent"
                                        returnKeyType='next'
                                        secureTextEntry={this.state.newPass == true ? false : true}
                                        ref={(input) => { this.newPassword = input; }}
                                        onSubmitEditing={() => { this.conPassword.focus(); }}
                                    />
                                    <TouchableOpacity onPress={() => { this.onShowPassword('newPassword') }}>
                                        <Image style={styles.eyeIcon} source={this.state.newPass ? images.passHide : images.passShow} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.inputView, { marginTop: 40, }]}>
                                <Text style={[styles.lableText, { top: this.state.conPassword ? 10 : 30, }]}>Confirm password</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={styles.inputIcon} source={this.state.conPassword ? images.passwordAct : images.Password} />
                                    <TextInput style={styles.inputStyle}
                                        placeholder=""
                                        onChangeText={(text) => { this.setState({ conPassword: text }) }}
                                        value={this.state.conPassword}
                                        maxLength={15}
                                        underlineColorAndroid="transparent"
                                        secureTextEntry={this.state.conPass == true ? false : true}
                                        returnKeyType='done'
                                        ref={(input) => { this.conPassword = input; }}
                                    />
                                    <TouchableOpacity onPress={() => { this.onShowPassword('conPassword') }}>
                                        <Image style={styles.eyeIcon} source={this.state.conPass ? images.passHide : images.passShow} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => { this.changePassword() }} style={styles.buttonView}>
                                <Text style={styles.buttonText}>SAVE</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                </ImageBackground>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    backClicki: { marginHorizontal: 13, marginTop: 30, width: 40, padding: 10 },
    backButton: { height: 25, width: 25, resizeMode: 'contain', tintColor: 'hsla(0, 0%, 78%, 1)', },
    inputView: { height: 50, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#D4D4D4' },
    lableText: { color: '#CFCFCF', fontSize: 16, marginLeft: 30 },
    inputStyle: { color: '#11345F', fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, width: '85%', marginLeft: 10, height:50, bottom:10 },
    inputIcon: { height: 16, width: 20, resizeMode: 'contain', marginTop: 13 },
    buttonView: { backgroundColor: '#113562', marginHorizontal: 40, paddingVertical: 15, borderRadius: 28, marginTop: 50 },
    buttonText: { fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, color: 'white', textAlign: 'center' },
    changeText: { fontSize: 22, fontFamily: Fonts.Poppins_SemiBold, color: '#123460' },
    eyeIcon: { height: 20, width: 20, resizeMode: 'contain', top: 5 }
});