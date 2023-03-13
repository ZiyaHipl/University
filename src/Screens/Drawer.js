import React, { Component } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, ImageBackground, SafeAreaView, DeviceEventEmitter } from "react-native";
import images from "../Theam/Images";
import NetInfo from "@react-native-community/netinfo";
import Helper from '../Lib/Helper'
import AlertMsg from '../Lib/AlertMsg'
import ApiUrl from "../Lib/ApiUrl";
import AsyncStorage from "@react-native-community/async-storage";
import Config from "../Lib/Config";

export default class Drawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            ProfileData: {},
            profile_imageupdate: ''
        }
    }

    onCommanFunction = (value) => {
        this.props.navigation.closeDrawer();
        this.props.navigation.navigate(value)
    }

    logoutClick = () => {
        this.props.navigation.closeDrawer();
        Helper.confirmPopUp("Are you sure want logout?", (status) => {
            if (status) {
                this.appLogout()

            }
        });
    }

    appLogout = () => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.getData('userdata').then(async (responseData) => {
                    var data = {
                        token: responseData.token
                    }
                    Helper.globalLoader.showLoader()
                    Helper.makeRequest({ url: ApiUrl.Logout, method: "POST", data: data }).then((response) => {
                        if (response.status == 200) {
                            AsyncStorage.removeItem("token");
                            AsyncStorage.removeItem('userdata')
                            Helper.user_id = ''
                            Helper.UserInfo = ''
                            this.props.navigation.reset({
                                routes: [{ name: "Login" }],
                            });
                            Helper.globalLoader.hideLoader()
                        }
                        else {
                            Helper.globalLoader.hideLoader()
                        }
                    }).catch(err => {
                        Helper.globalLoader.hideLoader()
                    })
                });
            }
        })
    }

    componentDidMount() {
        DeviceEventEmitter.addListener('ShowProfileData', ProfileData => this.SetProfileData(ProfileData));
    }


    SetProfileData = (ProfileData) => {
        console.log(JSON.stringify(ProfileData), 'JSON.stringify(ProfileData)');
        this.setState({
            ProfileData: ProfileData,
            name: ProfileData.data.name,
            profile_imageupdate: ProfileData.data.profile_image,

        })
    }
    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('ShowProfileData');
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <ImageBackground resizeMode={'cover'} style={{ height: 136, width: '100%' }} source={images.drawer}>
                    <View style={styles.mainView}>
                        <View style={styles.userIconMainView}>
                            <Image style={styles.userIcon}
                                resizeMode={'cover'} source={this.state.profile_imageupdate ? { uri: Config.imageurl + this.state.profile_imageupdate } : images.user} />
                        </View>
                        <Text style={styles.nameText}>{this.state.name}</Text>
                    </View>
                </ImageBackground>
                <View style={{ marginTop: 20, marginHorizontal: 15 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { this.onCommanFunction('HomePage') }}>
                        <Image style={styles.textIcon} source={images.home} />
                        <Text style={styles.textStyle}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => { this.onCommanFunction('TermsAndCondition') }}>
                        <Image style={[styles.textIcon, { marginTop: 20 }]} source={images.terma}
                        />
                        <Text style={[styles.textStyle, { marginTop: 20 }]}>Terms and Conditions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => { this.onCommanFunction('PrivacyPolicy') }}>
                        <Image style={[styles.textIcon, { marginTop: 20 }]} source={images.polici} />
                        <Text style={[styles.textStyle, { marginTop: 20 }]}>PrivacyPolicy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => { this.onCommanFunction('ProfileSetting') }}>
                        <Image style={[styles.textIcon, { marginTop: 20 }]} source={images.profileSetting} />
                        <Text style={[styles.textStyle, { marginTop: 20 }]}>Profile Setting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => { this.onCommanFunction('Notification') }}>
                        <Image style={[styles.textIcon, { marginTop: 20 }]} source={images.notification} />
                        <Text style={[styles.textStyle, { marginTop: 20 }]}>Notification</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => { this.onCommanFunction('ChangePassword') }}>
                        <Image style={[styles.textIcon, { marginTop: 20 }]} source={images.changePass} />
                        <Text style={[styles.textStyle, { marginTop: 20 }]}>Change Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => { this.logoutClick() }}>
                        <Image style={[styles.textIcon, { marginTop: 20 }]} source={images.logout} />
                        <Text style={[styles.textStyle, { marginTop: 20 }]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    userIconMainView: { height: 80, width: 80, borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderRadius: 60, borderColor: 'white' },
    userIcon: { height: 70, width: 70, borderRadius: 35 },
    textStyle: { fontSize: 18, fontWeight: 'normal', marginLeft: 5 },
    nameText: { marginLeft: 10, fontSize: 18, fontWeight: 'bold', color: 'white' },
    mainView: { alignItems: 'center', marginTop: 20, flexDirection: 'row', marginHorizontal: 10 },
    textIcon: { height: 17, width: 20, resizeMode: 'contain' }
});