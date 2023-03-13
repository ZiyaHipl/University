import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Fonts from '../Component/Fonts'
import images from '../Theam/Images';
import Helper from '../Lib/Helper';

export default class PaymentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    // paymentTest = () => {
    //     app = express();
    //     stripe = require("stripe")("sk_test_tR3PYbcVNZZ796tH88S4VQ2u");
    //     app.use(express.static("."));
    //     app.use(express.json());
    //     const calculateOrderAmount = items => {
    //         return 1400;
    //     };
    //     app.post("/create-payment-intent", async (req, res) => {
    //         const { items } = req.body;
    //         const paymentIntent = await stripe.paymentIntents.create({
    //             amount: calculateOrderAmount(items),
    //             currency: "usd"
    //         });
    //         res.send({
    //             clientSecret: paymentIntent.client_secret
    //         });
    //     });
    //     app.listen(4242, () => console.log('Node server listening on port 4242!'));
    // }



    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.headerMainView}>
                    <View style={{ flex: 0.5 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                            <Image style={styles.backBtn} source={images.left_arrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.5 }}>
                        <Text style={styles.headerText}>Payment</Text>
                    </View>
                </View>
                <View>
                    {/* <StripeProvider
                        publishableKey="pk_live_51JIW97SGxTEdvFSfPfyc7GyOIMLJeUQxBO87HtbVqTFK1d61pnSWCj0RcniJOBMdovJCVnVNmds9uJWC1OQnHWCj00O1mqcoqg"
                        urlScheme="your-url-scheme"
                        merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}"
                    >
                    </StripeProvider> */}
                </View>
                <TouchableOpacity
                    style={styles.BtnView}
                    onPress={() => { }}
                >
                    <Text style={styles.BtnText}>SUBMIT</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    BtnView: { backgroundColor: '#284971', padding: 10, marginHorizontal: 20, borderRadius: 30, marginTop: 30 },
    BtnText: { fontSize: 20, fontFamily: Fonts.Poppins_Bold, textAlign: 'center', color: 'white' },
    headerMainView: { flexDirection: 'row', marginHorizontal: 15, padding: 10, marginTop: 10 },
    backBtn: { height: 25, width: 25, resizeMode: 'contain', tintColor: 'hsla(0, 0%, 78%, 1)' },
    headerText: { fontSize: 18, fontFamily: Fonts.Poppins_Bold, right: 40 }
})
