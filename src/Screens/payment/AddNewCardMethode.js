import React from "react";
import { StyleSheet, SafeAreaView, ScrollView, View, Text, Alert, Image, TextInput, TouchableOpacity, } from "react-native";
import stripe from 'tipsi-stripe';
import { CreditCardInput } from "react-native-credit-card-input";
import Helper from "../../Lib/Helper";
import Config from "../../Lib/Config";
import StripeHelper from "../payment/StripeHelper";
import ImagePath from '../../Theam/Images';

export default class AddNewCardMethode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardHolderName: "",
            number: "",
            expMonth: "",
            expYear: "",
            cvc: "",
            status: "",
            enableBttn: false,
            // isLoader: false,
            stripe_customer_id: ''
        };


    }

    componentDidMount() {
        Helper.getData('userdata').then((userDatails) => {
            console.log(userDatails, 'userDatails');
            this.setState({ stripe_customer_id: userDatails.stripe_customer_id })
        })
        stripe.setOptions({
            publishableKey: Config.STRIPE_PUBLIC_KEY,
            merchantId: null,
            androidPayMode: Config.STRIPE_ENVIRMENT,
        });
    }

    _onCardChange = (form) => {
        // console.log("------------form: ", form)
        const { number, expiry, cvc, name } = form.values;
        this.setState({
            number: number,
            expMonth: expiry.split('/')[0],
            expYear: expiry.split('/')[1],
            cvc: cvc,
            cardHolderName: name,
            status: form.status,
            enableBttn: form.valid
        }, () => {
        });
    };


    getCardToken = async () => {
        Helper.globalLoader.showLoader()
        const { number, expMonth, expYear, cvc, cardHolderName } = this.state
        var cardDetails = {
            number: number,
            expMonth: parseInt(expMonth),
            expYear: parseInt(expYear),
            cvv: parseInt(cvc),
            name: cardHolderName,
        };
        console.log(cardDetails, 'cardDetails');
        if (!stripe.stripeInitialized) {
            Helper.showToast('Something wrong')
            Helper.globalLoader.hideLoader()
            return;
        }
        try {
            const token = await stripe.createTokenWithCard(cardDetails)
            if (token.tokenId) {
                this.addCardDetails(token);
            } else {
                // this.setState({ isLoader: false });
                Helper.showToast('Unable to process request')

            }
            Helper.globalLoader.hideLoader()
        } catch (err) {
            Helper.globalLoader.hideLoader()
            Helper.showToast(JSON.stringify(err.message))
        }
    }

    addCardDetails = async (token) => {
        console.log(token, 'token');
        try {
            if (this.state.stripe_customer_id && token.tokenId) {
                const cardAddResponse = await StripeHelper.addNewCard({ source: token.tokenId }, this.state.stripe_customer_id)
                Helper.showToast('Card added successfully')
                Helper.globalLoader.hideLoader()
                console.log(cardAddResponse, 'cardAddResponse');
                this.props.route.params.onBackFromAddCard(cardAddResponse)
                this.props.navigation.goBack();
            }
            else {
                // this.setState({ isLoader: false });
                Helper.globalLoader.hideLoader()
                Helper.showToast('Payment not possible at this moment.')

                return;
            }
        } catch (error) {
            setTimeout(() => {
                Alert.alert(
                    'Card Error',
                    "Your card was declined.",
                    [
                        { text: 'OK', onPress: () => console.log("This is the response...") },
                    ],
                    { cancelable: false }
                )
            }, 500);
        }
    }
    goBack = () => {
        this.props.navigation.goBack()
    }
    render() {
        return (
            <SafeAreaView
                // pointerEvents={this.state.isLoader ? "none" : "auto"}
                style={styles.container}>

                <View style={[styles.HeaderView]}>
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => { this.goBack() }}>
                        <Image source={ImagePath.left_arrow}
                            style={styles.leftimg} />
                    </TouchableOpacity>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 17, }}>Add Card</Text>
                    </View>
                    <View style={{ width: 50, height: 10 }}>
                    </View>
                </View>
                <ScrollView
                    keyboardShouldPersistTaps={'handled'}
                    bounces={false}
                    contentContainerStyle={styles.viewOfmain}
                    showsVerticalScrollIndicator={false}
                    ref={ref => (this.scrollViewRef = ref)}>
                    <CreditCardInput
                        requiresName
                        onChange={this._onCardChange} />

                    <TouchableOpacity
                        disabled={!this.state.enableBttn}
                        onPress={() => { this.getCardToken() }}
                        style={styles.buttonWrapper}>
                        <Text style={styles.loginButton}>Save</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff'
    },
    viewOfmain: {
        flexGrow: 1, padding: 20, backgroundColor: '#fff'
    },
    buttonWrapper: {
        alignItems: 'center', justifyContent: 'center',
        marginTop: 40, backgroundColor: 'blue',
    },
    loginButton: { marginVertical: 15, textAlign: 'center', color: '#fff', fontSize: 16, },
    HeaderView: { zIndex: 4, flexDirection: "row", height: 60, marginHorizontal: 10, alignItems: "center", elevation: 0, marginVertical: 10, justifyContent: 'space-between' },
    leftimg: { height: 25, width: 40, resizeMode: "contain", },

})