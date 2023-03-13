import React, { Component, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import ImagePath from '../../Theam/Images';
const { width, height } = Dimensions.get("window");
const SaveCardItem = (props) => {

    const [isCardSelected, setIsCardSelected] = useState(false);
    const [Phonenumber, setPhonenumber] = useState('');

    useEffect(() => {
        console.log(props, 'ppp>>>>>>>>>>');
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => props.setIsCardSelected(props.item, props.index)} >
            <View style={[styles.container, { backgroundColor: props.item.isSelected ? '#000' : '#fff', }]}>
                <View style={{ height: 20, width: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#000', borderRadius: 25, marginHorizontal: 10 }}>
                    {props.selectCardId == props.item.id && <Image resizeMode={'contain'} source={ImagePath.circle_checked_icon} style={styles.image} />}
                </View>
                <View style={{ flex: 1, paddingLeft: 10 }}>
                    <Text style={{ color: '#000' }}>{props.item.funding + ' card'}</Text>
                    {/* <BoldText text={props.item.funding + ` card`} style={{ color: colors.black }} /> */}
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text>{`***********` + props.item.last4}</Text>
                        {/* <PlainText text={`***********` + props.item.last4} style={{ color: colors.gray_200 }} /> */}
                        <Image source={props.item.cardLogo} style={[styles.card_logo, { marginLeft: 5 }]} />
                    </View>
                </View>
                {props.deleteIcon && <TouchableOpacity hitSlop={{ right: 10, left: 10, }} onPress={() => props.deleteCard(props.item.id)}>
                    <Image resizeMode={"contain"} style={{ height: 20, width: 20, right: 20, tintColor: 'gray' }} source={ImagePath.deleteIcon} />
                </TouchableOpacity>}
            </View>
        </TouchableWithoutFeedback >
    );
}
const styles = StyleSheet.create({
    container: {
        //flex: 1,
        //backgroundColor: colors.light_black_1,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#000',
        borderRadius: 5,
        marginHorizontal: 5,
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    image: {
        width: 15,
        height: 15,
    },
    card_logo: {
        width: 25,
        height: 20,
    }
})

export default SaveCardItem;