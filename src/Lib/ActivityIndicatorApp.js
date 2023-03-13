import React, { Component } from "react";
import { Platform, ActivityIndicator, View, Dimensions } from 'react-native'
import Helper from "./Helper";

const ScreenHeight = Dimensions.get('screen').height;
const ScreenWidth = Dimensions.get('screen').width;

export default class ActivityIndicatorApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false
        }
    }

    componentDidMount() {
        Helper.registerLoader(this)
    }

    showLoader() {
        this.setState({ showLoader: true })
    }
    hideLoader() {
        this.setState({ showLoader: false })
    }

    render() {
        return this.state.showLoader ? (
            <View style={{ position: 'absolute', zIndex: 1, width: ScreenWidth, height: ScreenHeight, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.40)' }}>
                <ActivityIndicator size="large" color="white" />
            </View>
        ) : null
    }

}