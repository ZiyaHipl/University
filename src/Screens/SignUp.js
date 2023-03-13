import React, { Component } from "react";
import { Text, View, StyleSheet, ImageBackground, TextInput, Image, TouchableOpacity, Dimensions, Keyboard, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import Fonts from "../Component/Fonts";
import images from "../Theam/Images";
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import { validators } from '../Lib/validationFunctions'
import Helper from '../Lib/Helper'
import AlertMsg from '../Lib/AlertMsg'
import ApiUrl from "../Lib/ApiUrl";
import Config from "../Lib/Config";
const { width, height } = Dimensions.get('window');

export default class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            Fname: '',
            mName: '',
            dob: '',
            phone: '',
            spec: '',
            isDatePickerVisible: false,
            startdate: '',
            date: '',
            contry: '',
            email: '',
            password: '',
            Cpassword: '',
            country: [],
            Category: [],
            selectCategory: '',
            flag: '',
            PASSWORD: false,
            CONPASSWORD: false
        }
        this.selectCountry()
        this.Specification()
    }


    onNextClick = () => {
        this.props.navigation.navigate('SelectSpecif')
    }

    handleConfirmStart = (date) => {
        this.setState({
            startdate: moment(date).format("YYYY-MM-DD"),
            startText: moment(date).format("h:mm a"),
            isDatePickerVisible: false,
        });
    };

    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false });
    };

    selectCountry() {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    var data = {
                    }
                    Helper.globalLoader.showLoader()
                    Helper.makeRequest({ url: ApiUrl.Country, method: "GET", data: data }).then((response) => {
                        if (response.status == 200) {
                            let tempArray = [];
                            response.data.forEach(element => {
                                tempArray.push({
                                    label: element.name,
                                    value: element.id,
                                    fleg: element.flag64
                                })
                            });
                            this.setState({ country: tempArray })
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

    Specification() {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    var data = {
                    }
                    Helper.globalLoader.showLoader()
                    Helper.makeRequest({ url: ApiUrl.Specification, method: "GET", data: data }).then((response) => {
                        if (response.status == 200) {
                            let tempArray = [];
                            response.data.forEach(element => {
                                tempArray.push({
                                    label: element.name,
                                    value: element.id,
                                })
                            });
                            this.setState({ Category: tempArray })
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

    signUpAccount() {
        Keyboard.dismiss();
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                if (
                    validators.checkAlphabet("FirstName ", 2, 45, Helper.setTrim(this.state.userName)) &&
                    validators.checkAlphabet("FamilyName", 2, 45, Helper.setTrim(this.state.Fname)) &&
                    validators.checkAlphabet("MotherName", 2, 45, Helper.setTrim(this.state.mName)) &&
                    validators.checkEmail("Email", Helper.setTrim(this.state.email)) &&
                    validators.checkRequire("DOB", this.state.startdate) &&
                    validators.checkNumber("PhoneNo.", 7, 15, Helper.setTrim(this.state.phone)) &&
                    validators.checkRequire("SPECIFICATION.", this.state.Category) &&
                    validators.checkPassword("Password.", 7, 15, Helper.setTrim(this.state.password))
                ) {
                    if (this.state.password.trim() != this.state.Cpassword.trim()) {
                        Helper.showToast(AlertMsg.error.PASSWORD_NOT_MATCH)
                        return false;
                    }
                    const contry = Number(this.state.contry);
                    var data = {
                        name: this.state.userName.trim(),
                        family_name: this.state.Fname.trim(),
                        mother_name: this.state.mName.trim(),
                        email: this.state.email,
                        date_of_birth: this.state.startdate,
                        phone_no: this.state.phone,
                        country_id: contry,
                        specifications_id: 1,
                        password: this.state.password.trim(),
                    }
                    Helper.globalLoader.showLoader()
                    Helper.makeRequest({ url: ApiUrl.SIGNIN, method: "POST", data: data }).then((response) => {
                        if (response.status == 200) {
                            Helper.globalLoader.hideLoader()
                            Helper.showToast(response.message);
                            this.props.navigation.navigate('OtpScreen', { userId: response.data })
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

    goBack = () => {
        this.props.navigation.goBack()
    }

    selectCountryFleg = (val) => {
        this.setState({ contry: val })
        this.state.country.map((userData) => {
            if (userData.value == val) {
                this.setState({ flag: Config.imageurl + userData.fleg })
            }
        });
    }

    onShowPassword = (value) => {
        if (value == 'password') {
            this.setState({ PASSWORD: !this.state.PASSWORD })
        }
        if (value == 'Cpassword') {
            this.setState({ CONPASSWORD: !this.state.CONPASSWORD })
            return
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, }}>
                <ImageBackground resizeMode={'stretch'} style={{ flex: 1 }} source={images.TopImage}>
                    <TouchableOpacity onPress={() => { this.goBack() }} style={styles.backClick}>
                        <Image style={styles.leftIcon} source={images.left_arrow} />
                    </TouchableOpacity>
                    <KeyboardAwareScrollView enableOnAndroid={false} bounces={false} showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                    >
                        <View style={{ marginHorizontal: 45 }}>
                            <Text style={styles.accountText}>Create Account</Text>
                            <Text style={styles.fillText}>Fill all mandatory fields</Text>
                            <View style={[styles.inputView, { marginTop: 40, }]}>
                                <Text style={[styles.lableText, { top: this.state.userName ? 10 : 30, }]}>FIRST NAME</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={styles.inputIcon} source={this.state.userName ? images.userIcon : images.fUser} />
                                    <TextInput style={styles.inputStyle}
                                        placeholder=""
                                        onChangeText={(text) => { this.setState({ userName: text }) }}
                                        value={this.state.userName}
                                        maxLength={20}
                                        underlineColorAndroid="transparent"
                                        returnKeyType='next'
                                        ref={(input) => { this.userName = input; }}
                                        onSubmitEditing={() => { this.Fname.focus(); }}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputView, { marginTop: 40, }]}>
                                <Text style={[styles.lableText, { top: this.state.Fname ? 10 : 30, }]}>FAMILY NAME</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={styles.inputIcon} source={this.state.Fname ? images.userIcon : images.fUser} />
                                    <TextInput style={styles.inputStyle}
                                        placeholder=""
                                        onChangeText={(text) => { this.setState({ Fname: text }) }}
                                        value={this.state.Fname}
                                        maxLength={20}
                                        underlineColorAndroid="transparent"
                                        returnKeyType='next'
                                        ref={(input) => { this.Fname = input; }}
                                        onSubmitEditing={() => { this.mName.focus(); }}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputView, { marginTop: 40, }]}>
                                <Text style={[styles.lableText, { top: this.state.mName ? 10 : 30, }]}>MOTHER NAME</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={styles.inputIcon} source={this.state.mName ? images.woman_withact : images.woman_with} />
                                    <TextInput style={styles.inputStyle}
                                        placeholder=""
                                        onChangeText={(text) => { this.setState({ mName: text }) }}
                                        value={this.state.mName}
                                        maxLength={20}
                                        underlineColorAndroid="transparent"
                                        returnKeyType='next'
                                        ref={(input) => { this.mName = input; }}
                                        onSubmitEditing={() => { this.email.focus(); }}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputView, { marginTop: 40, }]}>
                                <Text style={[styles.lableText, { top: this.state.email ? 10 : 30, }]}>Email</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={styles.inputIcon} source={this.state.email ? images.MailIcon : images.mailDic} />
                                    <TextInput style={styles.inputStyle}
                                        placeholder=""
                                        onChangeText={(text) => { this.setState({ email: text }) }}
                                        value={this.state.email}
                                        underlineColorAndroid="transparent"
                                        keyboardType="email-address"
                                        returnKeyType='next'
                                        ref={(input) => { this.email = input; }}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputView, { marginTop: 40, }]}>
                                <Text style={[styles.lableText, { top: this.state.startdate ? 10 : 30, }]}>DATE OF BIRTH</Text>
                                <TouchableOpacity onPress={() => { this.setState({ isDatePickerVisible: true }) }} style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => { this.setState({ isDatePickerVisible: true }); }}>
                                        <Image style={styles.inputIcon} source={this.state.startdate ? images.Calendaract : images.Calendar} />
                                    </TouchableOpacity>
                                    <TextInput style={styles.inputStyle}
                                        placeholder=""
                                        onChangeText={(text) => { this.setState({ dob: text }) }}
                                        value={this.state.startdate}
                                        underlineColorAndroid="transparent"
                                        editable={false}
                                    />
                                    <DateTimePickerModal
                                        isVisible={this.state.isDatePickerVisible}
                                        mode="date"
                                        maximumDate={new Date()}
                                        onConfirm={this.handleConfirmStart}
                                        onCancel={() => this.hideDatePicker()}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.inputView, { marginTop: 40, }]}>
                                <Text style={[styles.lableText, { top: this.state.phone ? 10 : 30, }]}>PHONE NO.</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={styles.inputIcon} source={this.state.phone ? images.phoneiconAct : images.phoneIcon} />
                                    <TextInput style={styles.inputStyle}
                                        placeholder=""
                                        onChangeText={(text) => { this.setState({ phone: text.replace(/[^0-9]/g, '') }) }}
                                        value={this.state.phone}
                                        maxLength={15}
                                        underlineColorAndroid="transparent"
                                        returnKeyType='next'
                                        keyboardType='numeric'
                                        ref={(input) => { this.phone = input; }}
                                    />
                                </View>
                            </View>
                            <View style={[styles.rowView, { alignItems: 'center' }]}>
                                <Image style={[styles.inputIcon, { marginBottom: 15 }]} source={this.state.flag ? { uri: this.state.flag } : images.couIcon} />
                                <RNPickerSelect style={{}}
                                    placeholder={{ label: "COUNTRY ID", value: null }}
                                    useNativeAndroidPickerStyle={false}
                                    items={this.state.country}
                                    onValueChange={(val) => { this.selectCountryFleg(val) }}
                                    value={this.state.contry}
                                    style={pickerSelectStyles}
                                />
                            </View>
                            <View style={[styles.rowView, { width: '100%' }]}>
                                <Image style={[styles.inputIcon, { marginBottom: 15 }]} source={this.state.selectCategory ? images.houseAct : images.housee} />
                                <RNPickerSelect
                                    placeholder={{ label: "SPECIFICATION", value: null }}
                                    useNativeAndroidPickerStyle={false}
                                    items={this.state.Category}
                                    onValueChange={(val) => { this.setState({ selectCategory: val }) }}
                                    value={this.state.selectCategory}
                                    style={pickerSelectStyles}
                                />
                            </View>
                            <View style={[styles.inputView, { marginTop: 40, }]}>
                                <Text style={[styles.lableText, { top: this.state.password ? 10 : 30, }]}>Password</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={styles.inputIcon} source={this.state.password ? images.passwordAct : images.Password} />
                                    <TextInput style={styles.inputStyle}
                                        placeholder=""
                                        onChangeText={(text) => { this.setState({ password: text }) }}
                                        value={this.state.password}
                                        maxLength={15}
                                        underlineColorAndroid="transparent"
                                        returnKeyType='next'
                                        secureTextEntry={this.state.PASSWORD == true ? false : true}
                                        ref={(input) => { this.password = input; }}
                                        onSubmitEditing={() => { this.Cpassword.focus(); }}
                                    />
                                    <TouchableOpacity onPress={() => { this.onShowPassword('password') }}>
                                        <Image style={styles.eyeIcon} source={this.state.PASSWORD ? images.passHide : images.passShow} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.inputView, { marginTop: 40, }]}>
                                <Text style={[styles.lableText, { top: this.state.Cpassword ? 10 : 30, }]}>Confirm password</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={styles.inputIcon} source={this.state.Cpassword ? images.passwordAct : images.Password} />
                                    <TextInput style={styles.inputStyle}
                                        placeholder=""
                                        onChangeText={(text) => { this.setState({ Cpassword: text }) }}
                                        value={this.state.Cpassword}
                                        maxLength={15}
                                        underlineColorAndroid="transparent"
                                        returnKeyType='done'
                                        secureTextEntry={this.state.CONPASSWORD == true ? false : true}
                                        ref={(input) => { this.Cpassword = input; }}
                                    />
                                    <TouchableOpacity onPress={() => { this.onShowPassword('Cpassword') }}>
                                        <Image style={styles.eyeIcon} source={this.state.CONPASSWORD ? images.passHide : images.passShow} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ alignItems: 'flex-end', marginTop: 44 }}>
                                <TouchableOpacity onPress={() => { this.signUpAccount() }} style={styles.buttonView}>
                                    <Text style={styles.buttonText}>NEXT</Text>
                                    <Image style={styles.rightIcon} source={images.RightIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.bottomTextView}>
                            <Text style={styles.dontText}>Don't have an account?</Text>
                            <TouchableOpacity style={{ paddingVertical: 5, paddingRight: 5 }}
                                onPress={() => { this.props.navigation.goBack() }}>
                                <Text style={styles.signUpText}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 20 }} />
                    </KeyboardAwareScrollView>
                </ImageBackground>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    accountText: { fontSize: 25, fontFamily: Fonts.Poppins_SemiBold, color: '#123460', marginTop: '35%' },
    fillText: { fontSize: 16, fontFamily: Fonts.Poppins_Regular, color: '#949494' },
    inputView: { height: 50, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#D4D4D4' },
    lableText: { color: '#CFCFCF', fontSize: 16, marginLeft: 30 },
    inputStyle: { color: '#11345F', fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, width: '80%', marginLeft: 10, height:50, bottom:10 },
    inputIcon: { height: 16, width: 20, resizeMode: 'contain', top: 10 },
    bottomTextView: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 30 },
    dontText: { color: '#8f8d8d', fontSize: 16, fontFamily: Fonts.Poppins_Regular },
    signUpText: { color: '#113562', fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, marginLeft: 8, },
    buttonView: { backgroundColor: '#113562', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 28, flexDirection: 'row' },
    buttonText: { fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, color: 'white' },
    rightIcon: { height: 16, width: 24, resizeMode: 'contain', alignSelf: 'center', marginLeft: 11 },
    leftIcon: { height: 25, width: 30, resizeMode: 'contain', tintColor: 'hsla(0, 0%, 78%, 1)', },
    backClick: { marginHorizontal: 13, marginTop: 30, width: 40, padding: 10 },
    rowView: { flexDirection: 'row', borderRadius: 2, borderBottomWidth: 0.5, alignItems: 'center', marginTop: 45 },
    imagess: { height: 43, width: 34, resizeMode: 'contain', },
    eyeIcon: { height: 20, width: 20, resizeMode: 'contain', top: 5 }

});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        width: width / 1.4,
        height: 50,
        paddingLeft: 10,
        borderColor: 'black',
    },
    inputAndroid: {
        width: width / 1.4,
        height: 50,
        paddingLeft: 10,
        borderColor: 'red',
        color: '#000',
    },
    // placeholder: { color: '#565656', }
});