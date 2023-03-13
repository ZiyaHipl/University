import React, { Component } from "react";
import { Text, View, StyleSheet, ImageBackground, } from "react-native";
import Fonts from "../Component/Fonts";
import images from "../Theam/Images";

export default class SelectCountry extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <View style={{ flex: 1, }}>
                <ImageBackground resizeMode={'stretch'} style={{ flex: 1 }} source={images.TopImage}>
                    <Text>hhhhiiii</Text>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
});