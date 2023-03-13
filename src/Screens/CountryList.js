import React, { Component } from "react";
import { Text, View, StyleSheet, ImageBackground, Image, TouchableOpacity } from "react-native";
import Fonts from "../Component/Fonts";
import images from "../Theam/Images";
import RNPickerSelect from 'react-native-picker-select';
import NetInfo from "@react-native-community/netinfo";
import Helper from '../Lib/Helper'
import AlertMsg from '../Lib/AlertMsg'
import ApiUrl from "../Lib/ApiUrl";

export default class CountryList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Category: [],
            selectCategory: ''
        }
        this.selectCountry()
    }

    onNext = () => {
        this.props.navigation.navigate('SelectSpecif')
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    selectCountry() {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    var data = {
                    }
                    console.log("country up data as flow =======>  ", data);
                    Helper.globalLoader.showLoader()
                    Helper.makeRequest({ url: ApiUrl.Country, method: "GET", data: data }).then((response) => {
                        console.log('===>Country', JSON.stringify(response))
                        if (response.status == 200) {
                            let tempArray = [response.data];
                            response.data.forEach(element => {
                                tempArray.push({
                                    label: element.name,
                                    value: element.name,
                                    fleg: element.flag16
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

    render() {
        return (
            <View style={{ flex: 1, }}>
                <ImageBackground resizeMode={'stretch'} style={{ flex: 1 }} source={images.TopImage}>
                    <TouchableOpacity onPress={() => { this.goBack() }} style={styles.backClicki}>
                        <Image style={styles.backButton} source={images.left_arrow} />
                    </TouchableOpacity>
                    <View style={{ marginHorizontal: 45 }}>
                        <Text style={styles.selectText}>Country of Study</Text>
                        <View style={styles.rowView}>
                            <Image style={styles.imagess} source={images.mortarboard} />
                            <RNPickerSelect
                                placeholder={{ label: "SELECT COUNTRY", value: null }}
                                useNativeAndroidPickerStyle={false}
                                items={this.state.Category}
                                onValueChange={(val) => { this.setState({ selectCategory: val }) }}
                                value={this.state.selectCategory}
                                style={pickerSelectStyles}
                            />
                        </View>
                    </View>
                    <View style={styles.positionView}>
                        <View style={{ alignItems: 'flex-end', marginTop: 44, }}>
                            <TouchableOpacity onPress={() => { this.onNext() }} style={styles.buttonView}>
                                <Text style={styles.buttonText}>NEXT</Text>
                                <Image style={styles.rightIcon} source={images.RightIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    selectText: { fontSize: 25, fontFamily: Fonts.Poppins_SemiBold, marginTop: '40%', color: '#123460' },
    imagess: { height: 43, width: 34, resizeMode: 'contain', marginLeft: 10 },
    buttonView: { backgroundColor: '#113562', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 28, flexDirection: 'row' },
    buttonText: { fontSize: 16, fontFamily: Fonts.Poppins_SemiBold, color: 'white' },
    rightIcon: { height: 16, width: 24, resizeMode: 'contain', alignSelf: 'center', marginLeft: 11 },
    rowView: { flexDirection: 'row', borderRadius: 2, borderWidth: 0.5, alignItems: 'center', marginTop: 45 },
    positionView: { position: 'absolute', bottom: 50, right: 0, marginHorizontal: 45 },
    backClicki: { marginHorizontal: 13, marginTop: 30, width: 40, padding: 10 },
    backButton: { height: 12, width: 18, resizeMode: 'contain', tintColor: 'hsla(0, 0%, 78%, 1)', }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        width: '100%',
        height: 50,
        paddingLeft: 10,
        borderColor: 'black',
    },
    inputAndroid: {
        width: '100%',
        height: 50,
        paddingLeft: 10,
        borderColor: 'black',
        color:'#000'
    },
    // placeholder: { color: '#565656', }
});