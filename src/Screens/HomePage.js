import React, { Component } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, SafeAreaView, DeviceEventEmitter, Platform, Modal,  } from "react-native";
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import PushNotification from "react-native-push-notification";
import Fonts from "../Component/Fonts";
import images from "../Theam/Images";
import NetInfo from "@react-native-community/netinfo";
import Helper from '../Lib/Helper'
import AlertMsg from '../Lib/AlertMsg'
import ApiUrl from "../Lib/ApiUrl";
import HTML from "react-native-render-html";
import Config from "../Lib/Config";
import Notificationcustom from "../Lib/Notificationcustom";

export default class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            UniversityData: [],
            modalVisible: false,
            headingText: '',
            message: ''
        }
    }
    menuClick = () => {
        this.props.navigation.openDrawer();
    };

    componentDidMount() {
        this.onNotificationCustom()
        DeviceEventEmitter.addListener('notification', notification => this.SetNotificationData(notification));
        setTimeout(() => {
            this.getProfile()
        }, 200);
        this.filterUniverty()
    }

    SetNotificationData = (notification) => {
        this.setState({
            modalVisible: notification.foreground,
            headingText: notification.title,
            message: notification.message
        })
        setTimeout(() => {
            this.setState({ modalVisible: false })
        }, 3000);
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('notification');
    }

    async requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            this.createNotificationListeners()
        }
    }

    onNotificationCustom = () => {
        PushNotification.configure({
            onRegister: function (token) {
            },
            onNotification: function (notification) {
                DeviceEventEmitter.emit('notification', notification)
            },
            onAction: function (notification) {
                console.log('notificationnotification', notification);
            },
            onRegistrationError: function (err) {
                console.error(err.message, err);
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
    }

    onDetailsPage = () => {
        this.props.navigation.navigate('DetailPage')
    }

    getProfile() {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    Helper.globalLoader.showLoader()
                    Helper.getData('userdata').then(async (responseData) => {
                        var data = {
                            token: responseData.token,
                        }
                        Helper.makeRequest({ url: ApiUrl.GATPROFILE, method: "POST", data: data }).then((response) => {
                            if (response.status == 200) {
                                Helper.globalLoader.hideLoader()
                                Helper.user_id = response.data.id
                                DeviceEventEmitter.emit("ShowProfileData", response)
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

    filterUniverty() {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    Helper.getData('userdata').then(async (responseData) => {
                        var data = {
                            token: responseData.token,
                            country_id: responseData.country_id,
                            specifications_id: responseData.specifications_id,
                            // page: 1
                        }
                        Helper.globalLoader.showLoader()
                        Helper.makeRequest({ url: ApiUrl.FilterUniversity, method: "POST", data: data }).then((response) => {
                            if (response.status == 200) {
                                this.setState({
                                    UniversityData: response.data
                                })
                                Helper.globalLoader.hideLoader()
                            }
                            else {
                                Helper.globalLoader.hideLoader()
                                Helper.showToast(response.message);
                            }
                        }).catch(err => {
                            this.globalLoader.hideLoader()
                        })
                    });
                }
            }
        })
    }

    UniversityList = ({ item }) => {
        return (
            <View>
                <View style={styles.cardView}>
                    <Image style={styles.cardImage} source={{ uri: Config.imageurl + item.banner_image }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, }}>
                        <Image style={styles.Universitylogo} source={{ uri: Config.imageurl + item.logo_image }} />
                        <Text>{item.name}</Text>
                    </View>
                    <View>
                        <HTML style={{ height: 50 }} source={{ html: item.detail }} />
                    </View>
                </View>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('DetailPage', { univerDAta: item.id }) }} style={[styles.buttionView, { backgroundColor: '#A81D28' }]}>
                    <Text style={styles.buttionText}>View Details</Text>
                    <Image style={styles.rightIcon} source={images.RightIcon} />
                </TouchableOpacity>
            </View>
        )
    }

    notificationModal = () => {
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {

                }}
            >
                <View>
                    <Notificationcustom
                        icon={images.ic_launcher}
                        heading={this.state.headingText}
                        details={this.state.message}
                    />
                </View>
            </Modal>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                {this.notificationModal()}
                <View style={styles.headerView}>
                    <View style={{ flex: 0.3, }}>
                        <TouchableOpacity onPress={() => { this.menuClick() }} style={{ width: 40 }}>
                            <Image style={styles.menuIcon} source={images.menu} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <Text style={styles.topText}>Top University List</Text>
                    </View>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Notification') }}>
                        <Image style={styles.menuIcon} source={images.notification} />
                        <View style={styles.countView}>
                            <Text style={styles.messageCount}>10</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={{ marginHorizontal: 28 }}>
                        <FlatList showsVerticalScrollIndicator={false}
                            data={this.state.UniversityData}
                            renderItem={this.UniversityList}
                            scrollEnabled={false}
                        />
                        <View style={{ marginTop: 20 }} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    topText: { fontSize: 22, color: '#123460', fontFamily: Fonts.Poppins_SemiBold },
    cardImage: { height: 150, width: '100%', resizeMode: 'cover' },
    Universitylogo: { height: 43, width: 43, resizeMode: 'cover', },
    cardView: { backgroundColor: 'white', elevation: 2, borderTopRightRadius: 8, borderTopLeftRadius: 8, paddingBottom: 5, marginTop: 10, overflow: 'hidden' },
    detailsText: { fontSize: 13, fontFamily: Fonts.Poppins_Regular, color: '#707070', textAlign: 'center' },
    buttionView: { justifyContent: 'center', flexDirection: 'row', paddingVertical: 8, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
    buttionText: { fontSize: 16, fontFamily: Fonts.Poppins_Medium, color: '#FFFFFF' },
    rightIcon: { height: 12, width: 18, resizeMode: 'contain', alignSelf: 'center', marginLeft: 10 },
    headerView: { flexDirection: 'row', marginTop: 20, alignItems: 'center', marginHorizontal: 15 },
    menuIcon: { height: 30, width: 30, resizeMode: 'contain' },
    messageCount: { fontSize: 8, color: 'white', textAlign: "center", },
    countView:{position: 'absolute', top: 0, right: 0,  borderRadius: 100,  height: 15, width: 15,backgroundColor: 'red', padding: 2}
});