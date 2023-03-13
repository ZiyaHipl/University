import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView, Image, PermissionsAndroid, Dimensions, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import Fonts from "../Component/Fonts";
import images from "../Theam/Images";
import NetInfo from "@react-native-community/netinfo";
import Helper from '../Lib/Helper'
import AlertMsg from '../Lib/AlertMsg'
import ApiUrl from "../Lib/ApiUrl";
import Config from "../Lib/Config";
import RNFetchBlob from 'rn-fetch-blob';

const { height, width } = Dimensions.get('window')

export default class UploadForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uploadFormDATA: {},
            UniversityID: this.props.route.params.id,
            pdf_first: '',
            pdf_second: '',
            pdf_third: '',
            pdf_fourth: ''
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
                            id: this.state.UniversityID,
                            user_id: responseData.id,
                            specifications_id: responseData.specifications_id,
                        }
                        Helper.globalLoader.showLoader()
                        Helper.makeRequest({ url: ApiUrl.DownloadDocument, method: "POST", data: data }).then((response) => {
                            if (response.status == 200) {
                                this.setState({ uploadFormDATA: response.data })
                                this.setState({
                                    pdf_first: response.data.pdf_first,
                                    pdf_second: response.data.pdf_second,
                                    pdf_third: response.data.pdf_third,
                                    pdf_fourth: response.data.pdf_fourth
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

    downloadFile(uploadFormDATA) {
        if (Platform.OS === 'ios') {
            this.actualDownload(uploadFormDATA);
        } else {

            try {
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'storage title',
                        message: 'storage_permission',
                    },
                ).then(granted => {
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        console.log('Storage Permission Granted.');
                        this.actualDownload(uploadFormDATA);
                    } else {
                        Alert.alert('storage_permission');
                    }
                });
            } catch (err) {
                console.log('error', err);
            }
        }
    }

    actualDownload = (uploadFormDATA) => {
        Helper.globalLoader.showLoader();
        const { dirs } = RNFetchBlob.fs;
        RNFetchBlob.config({
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                mediaScannable: true,
                title: `University.pdf`,
                path: `${dirs.DownloadDir}/test.pdf`,
            },
        })
            .fetch('GET', Config.imageurl + uploadFormDATA, {})
            .then((res) => {
                console.log('The file saved to ', res.path());
                alert('Pdf Downloaded Successfully.');
                Helper.globalLoader.hideLoader()
            })
            .catch((e) => {
                console.log(e)
            });
    }

    async downloadHistory(uploadFormDATA) {
        Helper.globalLoader.showLoader();
        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        let date = new Date();
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path:
                    PictureDir +
                    'University' +
                    Math.floor(date.getTime() + date.getSeconds() / 2),
            },
        };
        config(options)
            .fetch('GET', Config.imageurl + uploadFormDATA)
            .then((res) => {
                console.log('res -> ', JSON.stringify(res));
                alert('Pdf Downloaded Successfully.');
                Helper.globalLoader.hideLoader()

            });
    }
    gotoBack() {
        this.props.navigation.goBack(null);
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <TouchableOpacity onPress={() => this.gotoBack()}
                    style={{ position: "absolute", zIndex: 1, padding: 20, top:20 }} >
                    <Image source={images.left_arrow}
                        style={{ height: 20, width: 20, resizeMode: "contain", }} />
                </TouchableOpacity>
                <ScrollView >
                    <Image style={[styles.detailsImage, {marginTop:25}]} source={{ uri: Config.imageurl + this.state.uploadFormDATA.banner_image }} />
                    <View style={{ marginHorizontal: 18, backgroundColor: 'white', bottom: 50, paddingBottom: 50, borderRadius: 17, elevation: 2 }}>
                        <View style={styles.namelogoView}>
                            <Image style={styles.Universitylogo} source={{ uri: Config.imageurl + this.state.uploadFormDATA.logo_image }} />
                            <Text style={{ fontSize: 16, width: '60%', textAlign: 'center' }}>{this.state.uploadFormDATA.name}</Text>
                        </View>
                        <View style={{ borderWidth: 0.3, marginTop: 20 }} />
                        <Text style={styles.documentText}>Download Document For Applying</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {this.state.pdf_first == null ?
                                null
                                :
                                <View style={styles.smallCardView}>
                                    <Image style={styles.forMimg} source={images.pdf} />
                                    <Text style={styles.formText}>Registration Form</Text>
                                    <TouchableOpacity onPress={() => { this.downloadFile(this.state.pdf_first) }} style={{ top: 10 }}>
                                        <Image style={styles.uploadIcon} source={images.uploadIcon} />
                                    </TouchableOpacity>
                                </View>
                            }
                            {this.state.pdf_second == null ?
                                null
                                :
                                <View style={styles.smallCardView}>
                                    <Image style={styles.forMimg} source={images.pdf} />
                                    <Text style={styles.formText}>Registration Form</Text>
                                    <TouchableOpacity onPress={() => { this.downloadFile(this.state.pdf_second) }} style={{ top: 10 }}>
                                        <Image style={styles.uploadIcon} source={images.uploadIcon} />
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {this.state.pdf_third == null ?
                                null
                                :
                                <View style={styles.smallCardView}>
                                    <Image style={styles.forMimg} source={images.pdf} />
                                    <Text style={styles.formText}>Registration Form</Text>
                                    <TouchableOpacity onPress={() => { this.downloadFile(this.state.pdf_third) }} style={{ top: 10 }}>
                                        <Image style={styles.uploadIcon} source={images.uploadIcon} />
                                    </TouchableOpacity>
                                </View>
                            }
                            {this.state.pdf_fourth == null ?
                                null
                                :
                                <View style={styles.smallCardView}>
                                    <Image style={styles.forMimg} source={images.pdf} />
                                    <Text style={styles.formText}>Registration Form</Text>
                                    <TouchableOpacity onPress={() => { this.downloadFile(this.state.pdf_fourth) }} style={{ top: 10 }}>
                                        <Image style={styles.uploadIcon} source={images.uploadIcon} />
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('UserUpdoald',{ UniversityID: this.state.UniversityID })}} style={styles.buttonMainView}>
                            <Text style={styles.buttonText}>UPLOAD FILL FORM</Text>
                            <Image style={styles.buttonIcon} source={images.ic_archive} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    detailsImage: { height: 250, width: '100%', resizeMode: 'cover' },
    UniversityIcon: { height: 50, width: '100%', resizeMode: 'contain', marginTop: 30 },
    documentText: { fontSize: 18, fontFamily: Fonts.Poppins_SemiBold, color: '#133361', textAlign: 'center', marginTop: 12 },
    forMimg: { height: 80, width: 80, margin: 10, resizeMode: 'contain' },
    formText: { fontSize: 14, fontFamily: Fonts.Poppins_Regular, color: '#616161' },
    uploadIcon: { height: 30, width: 30, resizeMode: 'contain', },
    smallCardView: {
        backgroundColor: 'white',
        shadowColor: "red",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
        alignItems: 'center',
        margin: 14, width: width * .47 - 35,
        borderRadius: 10
    },
    buttonMainView: { marginHorizontal: 50, backgroundColor: '#113562', flexDirection: 'row', marginTop: 45, paddingVertical: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 35 },
    buttonText: { fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, color: '#FFFFFF', textAlign: 'center' },
    buttonIcon: { height: 13, width: 13, resizeMode: 'contain', marginLeft: 8 },
    Universitylogo: { height: 43, width: 43, resizeMode: 'cover', right: 10 },
    namelogoView: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, }
});