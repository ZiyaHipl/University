import React, { Component } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import images from "../Theam/Images";
import SplashScreen from 'react-native-splash-screen'
import Helper from "../Lib/Helper";

export default class Splash extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        SplashScreen.hide();
        this.focusListener = this.props.navigation.addListener("focus", () => {
            Helper.getData('userdata').then(async (responseData) => {
                Helper.UserInfo = responseData;
                if (responseData === null || responseData === 'undefined' || responseData === '') {
                    this.props.navigation.reset({
                        routes: [{ name: "Login" }],
                    });
                } else {
                    this.props.navigation.reset({
                        routes: [{ name: "DrawerStack" }],
                    });
                }
            })
            Helper.navigationRef = this.props.navigation
        })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Image style={{ height: '100%', width: '100%' }} source={images.Splash} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
});