import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Fonts from '../Component/Fonts';
import images from '../Theam/Images';

export default class Notificationcustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.mainView}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.iconView}>
                        <Image style={styles.notificationIcon} source={this.props.icon} />
                    </View>
                    <View style={{ flex: 0.8 }}>
                        <Text style={styles.headingText}> {this.props.heading} </Text>
                        <Text style={{ left: 5 }}>{this.props.details}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView: { backgroundColor: 'white', padding: 15, elevation: 2, borderRadius: 10, marginHorizontal: 10, marginTop: 10 },
    iconView: { flex: 0.2, alignItems: 'center', justifyContent: 'center' },
    notificationIcon: { height: 40, width: 40, resizeMode: 'contain' },
    headingText: { fontSize: 18, fontFamily: Fonts.Poppins_Bold }
})