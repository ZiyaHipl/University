import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Fonts from "../Component/Fonts";
import images from "../Theam/Images";
import NetInfo from "@react-native-community/netinfo";
import Helper from '../Lib/Helper'
import AlertMsg from '../Lib/AlertMsg'
import ApiUrl from "../Lib/ApiUrl";

export default class OtpForgote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            one: '',
            two: '',
            three: '',
            four: '',
            count: 59,
            resend: false,
            userId: this.props.route.params.userId,
            email: this.props.route.params.email
        }
    }

    componentDidMount() {
        this.countingStart()
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    countingStart = () => {
        this.timeCounter = setInterval(() => this.onStartCounting(), 1000);
        setTimeout(() => {
            clearInterval(this.timeCounter)
            this.setState({ resend: true })
        }, 60000);
    }

    onStartCounting = () => {
        if (this.state.count > 0) { this.setState({ count: this.state.count - 1 }) }
    }

    otpVerficition() {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    var data = {
                        user_id: this.state.userId,
                        otp: this.state.one + this.state.two + this.state.three + this.state.four
                    }
                    const Otp = this.state.one + this.state.two + this.state.three + this.state.four
                    Helper.globalLoader.showLoader()
                    Helper.makeRequest({ url: ApiUrl.forgotOtpMatch, method: "POST", data: data }).then((response) => {
                        if (response.status == 200) {
                            this.props.navigation.navigate('SetPassword', { userId: this.state.userId, Otp: Otp })
                            Helper.globalLoader.hideLoader()
                        }
                        else {
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

    resendOtp() {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    var data = {
                        email: this.state.email,
                    }
                    Helper.globalLoader.showLoader()
                    Helper.makeRequest({ url: ApiUrl.forgotOtpResend, method: "POST", data: data }).then((response) => {
                        if (response.status == 200) {
                            Helper.globalLoader.hideLoader()
                        }
                        else {
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
                    <View style={{ flex: 0.65, }}>
                        <TouchableOpacity onPress={() => { this.goBack() }} style={{ width: 40 }}>
                            <Image style={styles.menuIcon} source={images.left_arrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <Text style={styles.topText}>OTP</Text>
                    </View>
                </View>
                <KeyboardAwareScrollView>
                    <Image style={styles.icons} source={images.otpIcon} />
                    <Text style={styles.otpText}>OTP has been sent on your Email.</Text>
                    <View style={styles.otpMainView}>
                        <View style={styles.inputView}>
                            <TextInput style={{ textAlign: 'center' }}
                                placeholder="1"
                                onChangeText={(text) => { this.setState({ one: text }), this.two.focus(); }}
                                value={this.state.one}
                                maxLength={1}
                                keyboardType='number-pad'
                                returnKeyType='next'
                                ref={(input) => { this.one = input; }}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput style={{ textAlign: 'center' }}
                                placeholder="2"
                                onChangeText={(text) => { this.setState({ two: text }), this.three.focus(); }}
                                value={this.state.two}
                                maxLength={1}
                                keyboardType='number-pad'
                                returnKeyType='next'
                                ref={(input) => { this.two = input; }}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput style={{ textAlign: 'center' }}
                                placeholder="3"
                                onChangeText={(text) => { this.setState({ three: text }), this.four.focus(); }}
                                value={this.state.three}
                                maxLength={1}
                                keyboardType='number-pad'
                                returnKeyType='next'
                                ref={(input) => { this.three = input; }}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput style={{ textAlign: 'center' }}
                                placeholder="4"
                                onChangeText={(text) => { this.setState({ four: text }) }}
                                value={this.state.four}
                                maxLength={1}
                                keyboardType='number-pad'
                                returnKeyType='done'
                                ref={(input) => { this.four = input; }}
                            />
                        </View>
                    </View>
                    <Text style={styles.countingText}>00:{this.state.count}</Text>
                    <View style={styles.resendView}>
                        <Text style={styles.ifText}>if you didn't receive a code!</Text>
                        <TouchableOpacity onPress={() => { this.resendOtp() }}>
                            <Text style={styles.resendText}>Resend OTP?</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => { this.otpVerficition() }} style={styles.buttonView}>
                        <Text style={styles.buttonText}>VERIFY</Text>
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
    inputView: { width: 60, alignItems: 'center', justifyContent: 'center', borderWidth: 1, margin: 5, borderRadius: 10, height:60 },
    buttonView: { backgroundColor: '#113562', marginHorizontal: 70, paddingVertical: 15, borderRadius: 28, marginTop: '20%' },
    buttonText: { fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, color: 'white', textAlign: 'center' },
    icons: { height: 170, width: 200, resizeMode: 'contain', alignSelf: 'center' },
    otpText: { fontSize: 16, fontFamily: Fonts.Poppins_Regular, color: '#092B13', textAlign: 'center' },
    otpMainView: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', top: 10 },
    resendText: { fontSize: 16, fontFamily: Fonts.Poppins_Bold, color: '#EC0D33', marginLeft: 4 },
    ifText: { fontSize: 14, fontFamily: Fonts.Poppins_Regular },
    resendView: { marginHorizontal: 60, marginTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    countingText: { textAlign: 'center', fontSize: 19, fontFamily: Fonts.Poppins_SemiBold, color: '#979B98', top: 15 }
});