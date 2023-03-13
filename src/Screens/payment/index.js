import React, { Component, useEffect, useState, } from 'react';
import { View, Text, DeviceEventEmitter, Keyboard, TouchableOpacity, Image, Dimensions, StyleSheet, TextInput, FlatList, ScrollView, KeyboardAvoidingView, SafeAreaView } from 'react-native';
// import { Helper, ApiCall, Constants, AsyncStorageHelper, ToastMessage, RegexValid, CameraController } from '../../Api';
import stripe from 'tipsi-stripe';
import ImagePath from '../../Theam/Images';
import StripeHelper from '../payment/StripeHelper';
import SaveCardItem from './SaveCardItem'
import Config from '../../Lib/Config';
import Helper from '../../Lib/Helper';
const { width, height } = Dimensions.get("window");

const PaymentMethods = (props) => {
    const [isSaveCard, setIsSaveCard] = useState(false);
    const [cardId, setCardId] = useState('')
    const [dataSource, setDataSource] = useState([])
    const [stripe_customer_id, setStripe_customer_id] = useState('')
    const [totalAmount, setTotalAmount] = useState('1')
    const [lastFourDigit, setlastDigit] = useState('')
    const [amount, setamount] = useState('')

    useEffect(() => {
        stripe.setOptions({
            publishableKey: Config.STRIPE_PUBLIC_KEY,
            androidPayMode: Config.STRIPE_ENVIRMENT,
        });
        Helper.getData('userdata').then((userDatails) => {
            setStripe_customer_id(userDatails.stripe_customer_id)
                , getSavedCard(userDatails.stripe_customer_id);
        })
        props.navigation.addListener('focus', e => {
            getSavedCard();
        })

    }, [props]);
    const onBackFromAddCard = (params) => {
        console.log(params, 'params');
        let cardDetails = []
        cardDetails.push(params)
        setDataSource([...dataSource].concat(cardDetails))
    }
    const setIsCardSelected = (item, index) => {
        console.log(item, 'item>>>');
        setCardId(item.id)
        setlastDigit(item.last4)


    }
    const payWithStripe = () => {
        Keyboard.dismiss()
        let reg = /[^0-9]/g;
        if (amount == 0) {
            Helper.showToast('Please enter amount.');
            return false
        }
        if (reg.test(amount)) {
            Helper.showToast('Please enter correct amount.');
            return false
        }
        else {
            let data = props.route.params
            data.card_id = cardId
            data.last4 = lastFourDigit
            let Paymentdata = {
                data: data,
                amount: amount * 100
            }
           
            props.navigation.goBack()
            props.route.params.callback(Paymentdata)
        }
    }
    const getSavedCard = async (stripe_customer_id) => {
        const saveCardResponse = await StripeHelper.getSavedCards({ source: "" }, stripe_customer_id);
        if (saveCardResponse.data) {
            setDataSource(saveCardResponse.data)
            setCardId(saveCardResponse.data[0].id)
        }
    }
    const deleteCard = (id) => {
        Helper.confirm("Are you sure want to remove card?", (status) => {
            if (status) {
                StripeHelper.deleteSavedCards(stripe_customer_id, id).then((res) => {
                    console.log("-----------------------response: ", res);
                    let tmp = [...dataSource];
                    let indexM = dataSource.findIndex(data => data == id)
                    if (indexM == -1) {
                        tmp.splice(id, 1)
                    }
                    setDataSource(tmp)

                });
            }
        });
    }
    const boxView = (price, text, subtext) => {
        return (
            <View style={styles.boxContainer}>
                <View style={styles.boxContentContainer}>
                    <Text>11</Text>
                    <Text>12</Text>
                    {/* <BoldText text={price} fontSize={20} style={{ color: colors.black, }} />
                    <PlainText text={text} fontSize={14} style={{ color: colors.gray_200, }} /> */}
                </View>
            </View>
        )
    }

    const newCrdView = () => {
        return (
            <View style={{ width: width - 15, padding: 10, flex: 1, backgroundColor: '#000', borderRadius: 10 }}>
                <TouchableOpacity onPress={() => { getCardToken() }} style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{ height: 16, width: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'red', margin: 10 }}>
                        {isSaveCard && <Image resizeMode={'contain'} source={ImagePath.check_icon} style={styles.image} />}
                    </View>
                    <Text>Save card for future use</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const _renderCards = ({ item, index }) =>
        <SaveCardItem
            item={item}
            index={index}
            setIsCardSelected={setIsCardSelected}
            selectCardId={cardId}
            deleteCard={(id) => deleteCard(id)}
            deleteIcon
        />

    const goBack = () => {
        props.navigation.goBack()
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <View style={[styles.HeaderView]}>
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => { goBack() }}>
                    <Image source={ImagePath.left_arrow}
                        style={styles.leftimg} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 17, }}>Payment Method</Text>
                </View>
                <View style={{ width: 50, height: 10 }}>
                </View>
            </View>
            <KeyboardAvoidingView style={{ flexGrow: 1, backgroundColor: '#fff' }} keyboardShouldPersistTaps='handled'>
                <ScrollView style={{ marginBottom: 70, }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: 20 }}>
                        <Text style={{ color: '#000', fontSize: 15 }}>Amount :</Text>
                        <View style={{ flex: 1, borderRadius: 5, borderWidth: 1, borderColor: '#000', marginLeft: 10, height: 50 }}>
                            <TextInput placeholder={'Enter Amount'}
                                keyboardType={'decimal-pad'}
                                maxLength={6}
                                returnKeyType={'done'}
                                style={{ paddingHorizontal: 10, flex: 1 }}
                                onChangeText={(amount) => {
                                    let reg = /[^0-9]/g;
                                    if (reg.test(amount)) {
                                        return false
                                    } else {
                                        setamount(amount)
                                    }
                                }}
                                value={amount}
                            />
                        </View>
                    </View>
                    <View style={styles.container}>
                        <Text style={{ marginHorizontal: 10, color: '#000', textAlign: "left", alignSelf: "flex-start", paddingVertical: 10, fontSize: 16 }}>Select payment method</Text>
                        <FlatList
                            extraData={dataSource}
                            data={dataSource}
                            renderItem={_renderCards}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ width: width - 20 }}
                            ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                        />
                        <TouchableOpacity onPress={() => props.navigation.navigate('AddNewCardMethode', { onBackFromAddCard: onBackFromAddCard })} style={{ flexDirection: 'row', padding: 10, flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', alignSelf: 'flex-start' }}>
                            <Image source={ImagePath.add_new_card} style={styles.image_addCard} />
                            <Text style={{ color: '#000', paddingHorizontal: 5 }} >Use a new card</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <TouchableOpacity style={{
                    backgroundColor: 'blue',
                    marginVertical: 5,
                    position: 'absolute',
                    bottom: 0,
                    left: "3%",
                    right: "3%",
                    width: "94%",
                    alignItems: 'center', justifyContent: 'center',
                    marginBottom: 30
                }}
                    onPress={() => {
                        if (cardId) {
                            payWithStripe()
                        } else {
                            Helper.showToast('Plesae select payment method.')
                        }
                    }}>
                    <Text style={{ color: '#fff', fontSize: 16, paddingVertical: 15 }}>Done</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, marginTop: 30 },

    loginButton: {
        backgroundColor: 'red',
        marginVertical: 5,
        position: 'absolute',
        bottom: 0,
        left: "3%",
        right: "3%",
        width: "94%",
    },
    image: {
        width: 16,
        height: 16,
        resizeMode: "center",
    },
    seperatorLine: { height: 0.5, width: width - 30, backgroundColor: '#000' },
    markerIcon: { width: 10, height: 10, resizeMode: 'contain', marginHorizontal: 5 },
    boxContainer: {
        width: "46%",
        borderWidth: 0,
        backgroundColor: '#fff',
        borderColor: '#000',
        borderRadius: 5,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxContentContainer: {

        justifyContent: 'center',
        alignItems: 'center'
    },
    profile: { width: 80, height: 80 },
    image_addCard: {
        width: 20,
        height: 20,
        resizeMode: "center",
    },

    cardTextInput: {
        flex: 1,
        fontWeight: "700",
        color: '#000',
        borderBottomWidth: 0.5,
        borderBottomColor: '#000',
        fontSize: 14,
        padding: 5
    },
    circleContainer: {
        height: 20,
        width: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'blue',
        borderRadius: 25
    },
    codTextContainer: {
        flexDirection: 'row',
        alignSelf: "flex-start",
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    HeaderView: { zIndex: 4, flexDirection: "row", height: 60, marginHorizontal: 10, alignItems: "center", elevation: 0, marginVertical: 10, justifyContent: 'space-between' },
    leftimg: { height: 25, width: 40, resizeMode: "contain", },
})

export default PaymentMethods;
