import React, { Component } from "react";
import { View, StyleSheet, BackHandler, ActivityIndicator, Alert, Image, TouchableOpacity, Text, SafeAreaView } from "react-native";
import { WebView } from 'react-native-webview';
import images from "../Theam/Images";

export default class TermsAndCondition extends Component {
    constructor(props) {
        super(props)
        this.state = {
            canGoBack: false,
            loading: false
        }
    }

    getBack() {
        if (this.state.canGoBack == true) {
            this.WEBVIEW_REF.current.goBack();
            return true;
        }

    }
    gotoBack() {
        this.props.navigation.goBack(null);
    }
    render() {
        return (
            <SafeAreaView style={styles.containtView}>
                <View style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, elevation: 4 }}>
                    {this.state.canGoBack == true ?
                        <TouchableOpacity onPress={() => this.getBack()}
                            style={{ flexDirection: 'row', padding: 10 }} >
                            <Image source={images.left_arrow}
                                style={{ height: 20, width: 20, resizeMode: "contain", }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => this.gotoBack()}
                            style={{ flexDirection: 'row', padding: 10, }} >
                            <Image
                                source={images.left_arrow}
                                style={{ height: 20, width: 20, resizeMode: "contain", }} />
                        </TouchableOpacity>
                    }
                    <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginRight: 40 }}>{this.state.canGoBack == true ? 'Terms and Condition Details' : 'Terms and Condition'}</Text>
                    </View>
                </View>
                {this.state.loading == true &&
                    <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '100%', height: '100%', }}>
                        <ActivityIndicator animating={true} size="large" color="#00ccff" /></View>
                }
                <WebView
                    source={{ uri: "https://www.google.com/" }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    ref={this.WEBVIEW_REF}
                    renderLoading={() => <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '100%', height: '100%' }}>
                        <ActivityIndicator animating={true} size="large" color="#00ccff" /></View>}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    containtView: { flex: 1, backgroundColor: '#f7f6fe', },
    eventsPhoto: { height: 185, width: '100%', resizeMode: 'contain' },
    cardView: { backgroundColor: 'white', marginHorizontal: 6, elevation: 1, paddingBottom: 20, borderBottomRightRadius: 15, borderBottomLeftRadius: 15 },
    nameText: { fontSize: 18, fontWeight: 'normal', marginTop: 19 },
    backView: { backgroundColor: '#6EC1E41A', height: 39, width: 39, borderRadius: 35, alignItems: 'center', justifyContent: 'center', },
    locationIcon: { height: 18, width: 11, resizeMode: 'contain' },
    locationMainView: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    secMainView: { flexDirection: 'row', alignItems: 'center', marginTop: 21 },
    viewButton: { backgroundColor: '#6EC1E4', paddingHorizontal: 22, paddingVertical: 6, borderRadius: 20 },
    bookButton: { paddingHorizontal: 22, paddingVertical: 5, borderRadius: 20, borderWidth: 0.5 },
    bookText: { fontSize: 16, color: '#727272' },
});