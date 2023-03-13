import React, { Component } from "react";
import { Text, View, StyleSheet, ImageBackground, Image, TouchableOpacity, TextInput, SafeAreaView, DeviceEventEmitter } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Fonts from "../Component/Fonts";
import images from "../Theam/Images";
import CameraController from '../Lib/CameraController'
import NetInfo from "@react-native-community/netinfo";
import Helper from '../Lib/Helper'
import AlertMsg from '../Lib/AlertMsg'
import ApiUrl from "../Lib/ApiUrl";
import Config from "../Lib/Config";

export default class ProfileSetting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            phone: '',
            selectedAvtar: '',
            profile_image: '',
            userName: '',
            profile_imageupdate: ''
        }
        this.getProfile()
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    changeImage = (type) => {
        CameraController.open((response) => {
            if (response.path) {
                this.setState({ profile_image: response.path });
            }
        });
    }



    getProfile() {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    Helper.getData('userdata').then(async (responseData) => {
                        Helper.globalLoader.showLoader()
                        var data = {
                            token: responseData.token,
                        }
                        Helper.makeRequest({ url: ApiUrl.GATPROFILE, method: "POST", data: data }).then((response) => {
                            if (response.status == 200) {
                                this.setState({ name: response.data.name, })
                                this.setState({ email: response.data.email })
                                this.setState({ phone: response.data.phone_no })
                                this.setState({ userName: response.data.name })
                                this.setState({ profile_imageupdate: response.data.profile_image, })
                                DeviceEventEmitter.emit("ShowProfileData", response)
                                Helper.UpadateUserData = response.data.name
                                Helper.globalLoader.hideLoader()
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

    updateProfile() {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    Helper.getData('userdata').then(async (responseData) => {
                        var tempdata = new FormData();
                        tempdata.append('token', responseData.token);
                        tempdata.append('name', this.state.name);
                        tempdata.append('family_name', responseData.family_name);
                        tempdata.append('mother_name', responseData.mother_name);
                        tempdata.append('phone_no', this.state.phone);
                        tempdata.append('date_of_birth', responseData.date_of_birth);
                        tempdata.append('country_id', responseData.country_id);
                        tempdata.append('specifications_id', responseData.specifications_id);
                        if (this.state.profile_image) {
                            tempdata.append('profile_image', {
                                uri: this.state.profile_image,
                                name: 'profile.jpg',
                                type: 'image/jpeg'
                            })
                        }
                        Helper.globalLoader.showLoader()
                        console.log('--------payload:' + JSON.stringify(tempdata));
                        fetch(Config.baseurl + ApiUrl.UpdateProfile, {
                            method: 'post',
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            body: tempdata
                        }).then(
                            response => response.json()
                        )
                            .then(response => {
                                console.log('-----res:' + JSON.stringify(response))
                                if (response.status == 200) {
                                    Helper.UserInfo = response.data
                                    this.getProfile()
                                    Helper.showToast(response.message)
                                    Helper.globalLoader.hideLoader()
                                    DeviceEventEmitter.emit("ShowProfileData", response)
                                    this.goBack()
                                } else {
                                    Helper.globalLoader.hideLoader()
                                    Helper.showToast(response.message);
                                }
                            })
                            .catch(err => {
                                Helper.globalLoader.hideLoader()
                                console.log(err)
                            })
                    });
                }
            }
        })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, }}>
                <ImageBackground resizeMode={'stretch'} style={{ flex: 1 }} source={images.Student_Profil}>
                    <TouchableOpacity onPress={() => { this.goBack() }} style={styles.backClicki}>
                        <Image style={styles.backButton} source={images.left_arrow} />
                    </TouchableOpacity>
                    <KeyboardAwareScrollView>
                        <View style={{ alignItems: 'center', marginTop: '23%' }}>
                            <View style={styles.profileView}>
                                <Image style={styles.profileImg} source={this.state.profile_image ? { uri: this.state.profile_image } : this.state.profile_imageupdate ? { uri: Config.imageurl + this.state.profile_imageupdate } : images.user} />
                                <TouchableOpacity onPress={() => { this.changeImage() }} style={styles.positionView}  >
                                    <Image style={styles.cameraIcon} source={images.camera} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.nameText,]}>{this.state.userName}</Text>
                        </View>
                        <View style={{ marginHorizontal: 45 }}>
                            <View style={[styles.inputView, { marginTop: 40, }]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.inputIconView}>
                                        <Image style={styles.inputIcon} source={images.userIcon} />
                                        <View style={styles.inputBorderView} />
                                    </View>
                                    <TextInput style={styles.inputStyle}
                                        placeholder=""
                                        onChangeText={(text) => { this.setState({ name: text }) }}
                                        value={this.state.name}
                                        placeholderTextColor={'#11345F'}
                                        underlineColorAndroid="transparent"
                                        returnKeyType='next'
                                        ref={(input) => { this.name = input; }}
                                        onSubmitEditing={() => { this.phone.focus(); }}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputView, { marginTop: 40, }]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.inputIconView}>
                                        <Image style={styles.inputIcon} source={images.MailIcon} />
                                        <View style={styles.inputBorderView} />
                                    </View>
                                    <TextInput style={styles.inputStyle}
                                        placeholder=""
                                        onChangeText={(text) => { this.setState({ email: text }) }}
                                        value={this.state.email}
                                        placeholderTextColor={'#11345F'}
                                        underlineColorAndroid="transparent"
                                        returnKeyType='next'
                                        editable={false}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputView, { marginTop: 40, }]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.inputIconView}>
                                        <Image style={styles.inputIcon} source={images.phoneiconAct} />
                                        <View style={styles.inputBorderView} />
                                    </View>
                                    <TextInput style={styles.inputStyle}
                                        placeholder=""
                                        onChangeText={(text) => { this.setState({ phone: text }) }}
                                        value={this.state.phone}
                                        placeholderTextColor={'#11345F'}
                                        underlineColorAndroid="transparent"
                                        returnKeyType='done'
                                        keyboardType='number-pad'
                                        ref={(input) => { this.phone = input; }}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => { this.updateProfile() }} style={styles.buttonView}>
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
    backButton: { height: 12, width: 18, resizeMode: 'contain', tintColor: 'hsla(0, 0%, 78%, 1)', },
    inputView: { height: 50, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#D4D4D4' },
    lableText: { color: '#CFCFCF', fontSize: 16, marginLeft: 50 },
    inputStyle: { color: '#11345F', fontSize: 15, fontFamily: Fonts.Poppins_SemiBold, width: '90%', marginLeft: 8, top: 10 },
    inputIcon: { height: 16, width: 20, resizeMode: 'contain', },
    buttonView: { backgroundColor: '#113562', marginHorizontal: 40, paddingVertical: 15, borderRadius: 28, marginTop: 50 },
    buttonText: { fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, color: 'white', textAlign: 'center' },
    profileImg: { height: 120, width: 120, resizeMode: 'cover', borderRadius: 100 },
    profileView: { height: 120, width: 120, backgroundColor: 'white', borderRadius: 60, borderWidth: 1, borderColor: 'white' },
    cameraIcon: { height: 18, width: 18, resizeMode: 'contain', },
    positionView: { position: 'absolute', bottom: 8, right: 3, backgroundColor: 'white', height: 30, width: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, borderWidth: 0.5, borderColor: '#113562' },
    nameText: { fontSize: 24, fontFamily: Fonts.Poppins_SemiBold, color: '#11345F', marginTop: 10 },
    inputIconView: { width: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', top: 8 },
    inputBorderView: { width: 0.6, height: 25, backgroundColor: '#F1F1F1', left: 8 }
});