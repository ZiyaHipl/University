import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView, Image, Alert, Modal, TouchableOpacity, SafeAreaView } from "react-native";
import Fonts from "../Component/Fonts";
import images from "../Theam/Images";
import NetInfo from "@react-native-community/netinfo";
import Helper from '../Lib/Helper'
import AlertMsg from '../Lib/AlertMsg'
import ApiUrl from "../Lib/ApiUrl";
import Config from "../Lib/Config";

export default class DetailPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            UniversityData: this.props.route.params.univerDAta,
            UniversityDetail: {
            }
        }
        this.univerData()
    }

    univerData() {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    Helper.getData('userdata').then(async (responseData) => {
                        var data = {
                            token: responseData.token,
                            user_id: responseData.id,
                            specifications_id: responseData.specifications_id,
                            id: this.state.UniversityData
                        }
                        Helper.globalLoader.showLoader()
                        Helper.makeRequest({ url: ApiUrl.UniversityDetails, method: "POST", data: data }).then((response) => {
                            if (response.status == 200) {
                                this.setState({ UniversityDetail: response.data })
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
    gotoBack() {
        this.props.navigation.goBack(null);
    }
    gotoApplynow() {
        Alert.alert(
            Config.app_name,
            Config.requestmessage,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => this.applynowrequest() }
            ]
        )

    }

    applynowrequest() {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    Helper.getData('userdata').then(async (responseData) => {
                        var data = {
                            token: responseData.token,
                            user_id: responseData.id,
                            specifications_id: responseData.specifications_id,
                            university_id: this.state.UniversityData
                        }
                        Helper.globalLoader.showLoader()
                        Helper.makeRequest({ url: ApiUrl.DocumentRequest, method: "POST", data: data }).then((response) => {
                            if (response.status == 200) {
                                Helper.globalLoader.hideLoader()
                                this.successmessage()
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
    successmessage() {
        Alert.alert(
            Config.app_name,
            Config.requestsuccessmessage,
            [
                { text: "Ok", onPress: () => this.gotoHomePage() }
            ]
        )
    }
    gotoHomePage() {
        this.props.navigation.goBack(null);

    }
    gotoDocumentpage() {
        this.props.navigation.navigate('UploadForm', { id: this.state.UniversityData })
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <TouchableOpacity onPress={() => this.gotoBack()}
                    style={{ position: "absolute", zIndex: 1, padding: 20, top:20 }} >
                    <Image source={images.left_arrow}
                        style={{ height: 20, width: 20, resizeMode: "contain", }} />
                </TouchableOpacity>
                <ScrollView>
                    <View style={{ flex: 1, backgroundColor: 'white', marginTop:25 }}>
                        <Image style={styles.detailsImage} source={{ uri: Config.imageurl + this.state.UniversityDetail.banner_image }} />
                        <View style={styles.univerView}>
                            <View style={styles.namelogoView}>
                                <Image style={styles.Universitylogo} source={{ uri: Config.imageurl + this.state.UniversityDetail.logo_image }} />
                                <Text style={styles.univerName}>{this.state.UniversityDetail.name}</Text>
                            </View>
                            <View style={{ borderWidth: 0.3, marginTop: 20 }} />
                            <View style={{ marginTop: 25, flexDirection: 'row', marginHorizontal: 12 }}>
                                <Image style={styles.renderIcon} source={images.location} />
                                <Text style={[styles.locationText, { width: '90%' }]}>{this.state.UniversityDetail.address}</Text>
                            </View>
                            <View style={{ marginTop: 25, flexDirection: 'row', marginHorizontal: 12 }}>
                                <Image style={styles.renderIcon} source={images.city_icon} />
                                <Text style={[styles.locationText, { width: '90%' }]}>{this.state.UniversityDetail.city_name}</Text>
                            </View>
                            <View style={{ marginTop: 25, flexDirection: 'row', marginHorizontal: 12 }}>
                                <Image style={styles.renderIcon} source={images.country_id} />
                                <Text style={[styles.locationText, { width: '90%' }]}>{this.state.UniversityDetail.country_name}</Text>
                            </View>
                            <View style={{ marginTop: 25, flexDirection: 'row', marginHorizontal: 12 }}>
                                <Image style={styles.renderIcon} source={images.email_id} />
                                <Text style={[styles.locationText, { width: '90%' }]}>{this.state.UniversityDetail.email}</Text>
                            </View>
                            <View style={{ marginTop: 25, flexDirection: 'row', marginHorizontal: 12 }}>
                                <Image style={styles.renderIcon} source={images.trophy} />
                                <Text style={[styles.locationText, { textAlign: 'center' }]}>QS World University Rankings</Text>
                                <Text style={styles.numbrikText}>{this.state.UniversityDetail.rank}</Text>
                            </View>
                            <View style={styles.smallCard}>
                                <View style={styles.cardView}>
                                    <Image style={styles.renderIcon} source={images.Status} />
                                    <Text style={styles.locationText}>Status</Text>
                                </View>
                                <View style={{ flex: 0.31, }}>
                                    <Text style={styles.lastText}>{this.state.UniversityDetail.status_university}</Text>
                                </View>
                            </View>
                            <View style={styles.smallCard}>
                                <View style={styles.cardView}>
                                    <Image style={styles.renderIcon} source={images.Research} />
                                    <Text style={styles.locationText}>Research Output</Text>
                                </View>
                                <View style={{ flex: 0.31, }}>
                                    <Text style={styles.lastText}>{this.state.UniversityDetail.research_output}</Text>
                                </View>
                            </View>
                            <View style={styles.smallCard}>
                                <View style={styles.cardView}>
                                    <Image style={styles.renderIcon} source={images.student} />
                                    <Text style={styles.locationText}>Student/Faculty Ratio</Text>
                                </View>
                                <View style={{ flex: 0.31, }}>
                                    <Text style={styles.lastText}>{this.state.UniversityDetail.faculty_ratio}</Text>
                                </View>
                            </View>
                            <View style={styles.smallCard}>
                                <View style={styles.cardView}>
                                    <Image style={styles.renderIcon} source={images.Total} />
                                    <Text style={styles.locationText}>Total Faculty</Text>
                                </View>
                                <View style={{ flex: 0.31, }}>
                                    <Text style={styles.lastText}>{this.state.UniversityDetail.total_faculty}</Text>
                                </View>
                            </View>
                            <View style={styles.smallCard}>
                                <View style={styles.cardView}>
                                    <Image style={styles.renderIcon} source={images.Scholarships} />
                                    <Text style={styles.locationText}>Scholarships</Text>
                                </View>
                                <View style={{ flex: 0.31, }}>
                                    <Text style={styles.lastText}>{this.state.UniversityDetail.scholarships}</Text>
                                </View>
                            </View>
                            <View style={styles.smallCard}>
                                <View style={styles.cardView}>
                                    <Image style={styles.renderIcon} source={images.collage} />
                                    <Text style={styles.locationText}>College Campus Size</Text>
                                </View>
                                <View style={{ flex: 0.31, }}>
                                    <Text style={styles.lastText}>{this.state.UniversityDetail.college_campus_size}</Text>
                                </View>
                            </View>
                            <View style={styles.smallCard}>
                                <View style={styles.cardView}>
                                    <Image style={styles.renderIcon} source={images.collage} />
                                    <Text style={styles.locationText}>courses_name</Text>
                                </View>
                                <View style={{ flex: 0.31, }}>
                                    <Text style={styles.lastText}>{this.state.UniversityDetail.courses_name}</Text>
                                </View>
                            </View>
                            {this.state.UniversityDetail.download_document == true ?
                                <TouchableOpacity onPress={() => this.gotoDocumentpage()} style={styles.buttonView}>
                                    <Text style={styles.buttonText}>Download Document</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => this.gotoApplynow()} style={styles.buttonView}>
                                    <Text style={styles.buttonText}>APPLY NOW</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    detailsImage: { height: 250, width: '100%', resizeMode: 'cover' },
    UniversityIcon: { height: 50, width: '100%', resizeMode: 'contain', marginTop: 8 },
    renderIcon: { height: 31, width: 31, resizeMode: 'contain' },
    locationText: { fontSize: 16, fontFamily: Fonts.Poppins_Regular, color: '#858585' },
    numbrikText: { color: '#393838', fontSize: 18, marginLeft: 'auto', fontFamily: Fonts.Poppins_Bold },
    cardView: { flex: 0.69, flexDirection: 'row', marginHorizontal: 12, borderRightWidth: 1, borderColor: '#00000029', },
    smallCard: {
        flexDirection: 'row', marginTop: 30, shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    lastText: { fontSize: 16, fontFamily: Fonts.Poppins_Medium, color: '#133361', textAlign: 'center' },
    buttonView: { marginTop: 35, backgroundColor: '#113562', marginHorizontal: 50, paddingVertical: 20, borderRadius: 32 },
    buttonText: { textAlign: 'center', color: 'white', fontSize: 16, fontFamily: Fonts.Poppins_SemiBold },
    modalMainView: { fontSize: 20, fontFamily: Fonts.Poppins_SemiBold, color: '#133361', textAlign: 'center' },
    startTextModal: { fontSize: 16, fontFamily: Fonts.Poppins_Regular, color: '#858585', marginHorizontal: 26, marginTop: 10 },
    middTextModal: { fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, color: '#4E4A4A' },
    Universitylogo: { height: 43, width: 43, resizeMode: 'cover', right: 10 },
    namelogoView: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, },
    univerView: { marginHorizontal: 18, backgroundColor: 'white', bottom: 50, elevation: 2, paddingBottom: 50, borderRadius: 17 },
    univerName: { fontSize: 16, width: '60%', textAlign: 'center' }
});