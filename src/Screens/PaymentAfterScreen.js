import React, { Component } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import Fonts from "../Component/Fonts";
import images from "../Theam/Images";

export default class PaymentAfterScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        setTimeout(() => {
            this.props.navigation.navigate('UploadForm')
        }, 4000);
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#4AD395' }}>
                <Image style={styles.happyIcon} source={images.happylogo} />
                <Text style={styles.thankuText}>Thank You</Text>
                <Text style={styles.longText}>Thank for pay $20 of HARVARD UNIVERSITY For Bachelor of Technology (B.Tech) We Will be Redirect Document page with in 20 Seconds. So Please wait</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    happyIcon: { height: 130, width: 130, resizeMode: 'contain', marginTop: '30%', alignSelf: 'center' },
    thankuText: { fontSize: 44, color: 'white', textAlign: 'center', marginTop: 20, fontFamily: Fonts.Poppins_Light },
    longText: { alignSelf: 'center', marginHorizontal: 27, fontSize: 18, fontFamily: Fonts.Poppins_Regular, color: 'white' }
});