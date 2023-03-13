import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList, SafeAreaView, ScrollView, Alert, DeviceEventEmitter } from 'react-native';
import Fonts from '../Component/Fonts';
import images from '../Theam/Images';
import DocumentPicker from 'react-native-document-picker';
import ApiUrl from '../Lib/ApiUrl';
import NetInfo from "@react-native-community/netinfo";
import Helper from '../Lib/Helper'
import AlertMsg from '../Lib/AlertMsg'
import Config from '../Lib/Config';
import CameraController from '../Lib/CameraController'
import stripe from 'tipsi-stripe';

const { height, width } = Dimensions.get('window')
export default class UserUpdoald extends Component {
    constructor(props) {
        super(props);
        this.state = {
            UniversityID: this.props.route.params.UniversityID,
            MyBrandData: [{ 'id': "-1", "gallery_image": "" }],
            send_brand_image: false,
            arrdeleteImages: [],
            MyGetBrandData: [],
            brand_image: '',
            pdfId: '',
            message: '',
            refersh: ''
        }
    }
    componentDidMount() {
        DeviceEventEmitter.addListener('refershGetApi', countMessage1 => this.getReferesh(countMessage1));
        this.getUploadPdf();
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('refershGetApi');
    }


    getReferesh = (countMessage1) => {
        console.log(JSON.stringify(countMessage1), 'JSON.stringify(countMessage1)');
        this.setState({
            refersh: countMessage1,
        })
        alert(this.state.refersh)
    }

    getUploadPdf() {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    Helper.getData('userdata').then(async (responseData) => {
                        var data = {
                            token: responseData.token,
                            university_id: this.state.UniversityID,
                            user_id: responseData.id,
                        }
                        Helper.globalLoader.showLoader()
                        Helper.makeRequest({ url: ApiUrl.GetUploadDocument, method: "POST", data: data }).then((response) => {
                            if (response.status == 200) {
                                Helper.globalLoader.hideLoader()
                                if (response.data.document.length > 0) {
                                    this.setState({ MyBrandData: response.data.document })
                                }
                                else {
                                    this.state.MyBrandData = [{ 'id': "-1", "gallery_image": "" }]
                                }
                                this.setState({
                                    MyGetBrandData: response.data.document,
                                    pdfId: response.data.id,
                                    message: response.data.message
                                })
                                this.state.send_brand_image = false
                            }
                            else {
                                Helper.globalLoader.hideLoader()
                                Helper.showToast(response.message);
                            }
                        }).catch(err => {
                            Helper.globalLoader.hideLoader()
                        })
                    });
                }
            }
        })
    }





    MyPdfDataItem = ({ index, item }) => (
        <View style={{ flex: 1, margin: 14 }}>
            <TouchableOpacity onPress={() => { this.choosePdfoptionalList(); }}>
                <View style={styles.smallCardView}>
                    {item.id == "-1" ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                            <Text style={{ color: '#000000', fontSize: 16, fontWeight: 'bold' }}>Upload Pdf</Text>
                            <View style={{ marginTop: 10 }}>
                                <Image style={styles.uploadIcon} source={images.upload} />
                            </View>
                        </View>
                        :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                            {item.new_image == true ?
                                <Image
                                    source={images.pdf}
                                    resizeMode={'cover'}
                                    style={styles.forMimg}>
                                </Image>
                                :
                                <Image
                                    source={images.pdf}
                                    resizeMode={'cover'}
                                    style={styles.forMimg}>
                                </Image>
                            }
                        </View>
                    }
                </View>
            </TouchableOpacity>
        </View>

    );
    deleteImages(item, index) {
        if (item.id != "-1" && item.new_image != true) {
            this.state.arrdeleteImages.push(item.id)
        }
        this.state.MyBrandData.splice(index, 1)
        if (this.state.MyBrandData.length == 0) {
            this.state.MyBrandData = [{ 'id': "-1", "gallery_image": "" }]
        }
        this.setState({})
    }
    choosePdfoptionalList = () => {
        this.getpickPdfDocument();
    }
    getpickPdfDocument = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [
                    DocumentPicker.types.pdf,
                ],
            });
            if (res.type) {
                this.state.MyBrandData.splice(this.state.MyBrandData.length - 1, 1, { 'id': this.state.MyBrandData.length, "gallery_image": res.uri, "name": res.name, "type": res.type, new_image: true })
                this.setState({});
            }

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }

    };

    addMorePdf = () => {
        if (this.state.MyBrandData[this.state.MyBrandData.length - 1].id == "-1") {
            Helper.showToast('Please add pdf.');
        }
        else if (this.state.MyBrandData.length == 5) {
            Helper.showToast("You can't Upload pdf more than 5");
        } else {
            this.state.MyBrandData.push({ 'id': "-1", "gallery_image": "" })
            this.setState({})
        }

    }

    gotoSavePdf() {
        if (this.state.MyBrandData[this.state.MyBrandData.length - 1].id == "-1") {
            Helper.showToast("Add pdf is required.")
            return;
        }

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            }
            Helper.globalLoader.showLoader();

            Helper.getData('userdata').then(async (responseData) => {
                let PdfAllData = new FormData();
                PdfAllData.append('university_id', this.state.UniversityID);
                PdfAllData.append('user_id', responseData.id);
                PdfAllData.append('token', responseData.token);
                PdfAllData.append("id", this.state.pdfId);

                let galleryImageCount = 0
                this.state.MyBrandData.map((item) => {

                    if (item.new_image && item.new_image == true) {
                        galleryImageCount = galleryImageCount + 1
                        PdfAllData.append('document_' + galleryImageCount, {
                            uri: item.gallery_image,
                            name: item.name,
                            type: item.type
                        });
                    }
                })
                fetch(Object.keys(this.state.MyGetBrandData).length > 0 ? Config.baseurl + ApiUrl.UpdateDocument : Config.baseurl + ApiUrl.UploadDocument, {
                    method: 'post', headers: {
                        'Content-Type': 'multipart/form-data',
                    }, body: PdfAllData
                }).then(
                    response => response.json()
                ).then(response => {
                    if (response.status == 200) {
                        Helper.showToast(response.message)
                        Helper.globalLoader.hideLoader()
                        this.getUploadPdf()
                    }
                    else {
                        Helper.globalLoader.hideLoader()
                        Helper.showToast(response.message);
                    }
                })
                    .catch(err => {
                        Helper.globalLoader.hideLoader()
                        console.log(err)
                    })
            });
        })
    }




    paymentMethode = (item) => {
        console.log("item------------------", item);
        this.props.navigation.navigate('PaymentMethods', { PaymentData: item, callback: (paymentData) => this.paymentCallBack(paymentData) })

    }

    paymentCallBack = (paymentData) => {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.getData('userdata').then(async (responseData) => {
                    Helper.globalLoader.showLoader()
                    let datapayment = {
                        payment_method: paymentData.data.card_id,
                        university_id: paymentData.data.PaymentData,
                        amount: paymentData.amount,
                        currency: 'INR',
                        customer: responseData.stripe_customer_id,
                        token: responseData.token
                    }
                    Helper.makeRequest({ url: 'payment-intents', method: "POST", data: datapayment }).then((response) => {
                        console.log('===>PaymentData', JSON.stringify(response))
                        if (response.status == 200) {
                            Helper.globalLoader.hideLoader()
                            this.payWithStripe(response.data.client_secret, response.data.payment_method, 'amount', datapayment)
                        }
                        else {
                            Helper.globalLoader.hideLoader()
                            Helper.showToast(response.message);
                        }
                    }).catch(err => {
                        Helper.globalLoader.hideLoader()
                    })
                });
            }


        })
    }

    payWithStripe = async (paymentIntent, card_id, type, paymentData) => {
        // console.log('payWithStripe---------------', paymentIntent)
        // console.log('requestDetails--------card_id-------', card_id)
        // console.log('requestDetails--------type------', type)
        // console.log('requestDetails--------paymentData-------', paymentData)


        const confirmPaymentIntent = await stripe.confirmPaymentIntent({
            clientSecret: paymentIntent,
            paymentMethodId: card_id,

        });
        console.log('confirmPaymentIntent-------', confirmPaymentIntent)
        if (confirmPaymentIntent.status == "succeeded") {
            this.gotoSuccessFullPayment(paymentData, 'succeeded', confirmPaymentIntent)
        }
        else if (confirmPaymentIntent.status == "requires_payment_method", confirmPaymentIntent) {
            this.gotoSuccessFullPayment(paymentData, 'requires_payment_method', confirmPaymentIntent)
        }
        else if (confirmPaymentIntent.status == "requires_confirmation") {
            this.gotoSuccessFullPayment(paymentData, 'requires_confirmation', confirmPaymentIntent)
        }
        else if (confirmPaymentIntent.status == "requires_action") {
            this.gotoSuccessFullPayment(paymentData, 'requires_action', confirmPaymentIntent)
        }
        else if (confirmPaymentIntent.status == "processing") {
            this.gotoSuccessFullPayment(paymentData, 'processing', confirmPaymentIntent)
        }
        else if (confirmPaymentIntent.status == "canceled") {
            this.gotoSuccessFullPayment(paymentData, 'canceled', confirmPaymentIntent)
        }
        else {
            Helper.showToast('Payment Field!');
            //alert(confirmPaymentIntent.status)
        }
    }
    gotoSuccessFullPayment = (paymentData, Status, confirmPaymentIntent) => {
        Alert.alert(
            Config.app_name,
            Status == "succeeded" ?
                "Payment successful" :
                Status == "requires_payment_method" ?
                    "Payment required." :
                    Status == "requires_confirmation" ?
                        "Payment requires confirmation." :
                        Status == "requires_action" ?
                            "Payment requires action." :
                            Status == "processing" ?
                                "Payment processing." :
                                Status == "canceled" ?
                                    "Payment canceled." :
                                    'Payment Field!'
            ,
            [
                {
                    text: "Yes",
                    onPress: () => {
                        this.gotoSuccessPay(paymentData, Status, confirmPaymentIntent)
                    },
                },
                // {
                //   text: "No",
                //   onPress: () => {
                //     this.state.page = 1;
                //     this.getContractHistory(true)
                //   },
                //   style: "cancel",
                // },
            ],
            { cancelable: false }
        );
    }

    gotoSuccessPay(paymentData, Status, confirmPaymentIntent) {
        // console.log(paymentData, 'paymentData>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        // console.log(Status, 'Status>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        // console.log(confirmPaymentIntent, 'confirmPaymentIntent>>>>>>>>>>>>>>>>>>>>>>>>>>>');


        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                Helper.getData('userdata').then(async (responseData) => {
                    Helper.globalLoader.showLoader()
                    let finaldata = {
                        token: responseData.token,
                        user_id: responseData.id,
                        university_id: paymentData.university_id,
                        amount: paymentData.amount,
                        transaction_id: confirmPaymentIntent.paymentIntentId,
                        payment_status: confirmPaymentIntent.status


                    }
                    console.log(JSON.stringify(finaldata), 'finaldata');

                    Helper.makeRequest({ url: 'payment-success', method: "POST", data: finaldata }).then((response) => {
                        console.log('===>PaymentData', JSON.stringify(response))
                        if (response.status == 200) {
                            Helper.showToast(response.message)
                            Helper.globalLoader.hideLoader()

                        }
                        else {
                            Helper.globalLoader.hideLoader()
                            Helper.showToast(response.message);
                        }
                    }).catch(err => {
                        Helper.globalLoader.hideLoader()
                    })
                });
            }


        })




    }


    render() {
        return (
            <SafeAreaView style={styles.containView}>
                <View>
                    <Text style={styles.headerText}>UPLOAD DOCUMENT</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <FlatList
                            data={this.state.MyBrandData}
                            extraData={this.state}
                            showsVerticalScrollIndicator={false}
                            renderItem={this.MyPdfDataItem}
                        />
                        {this.state.MyBrandData.length != 4 &&
                            <TouchableOpacity onPress={() => this.addMorePdf()}
                                style={styles.btnView}>
                                <Text style={styles.btnText}>Add More</Text>
                            </TouchableOpacity>
                        }


                        <TouchableOpacity onPress={() => this.gotoSavePdf()}
                            style={{ flex: 1, backgroundColor: 'blue', marginHorizontal: 15, borderRadius: 8, paddingVertical: 10, marginTop: 50, marginBottom: 30 }}>
                            <Text style={{ fontSize: 18, fontFamily: Fonts.Poppins_Bold, textAlign: 'center', color: '#ffffff' }}>SAVE</Text>
                        </TouchableOpacity>

                        {this.state.pdfId ?
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('MessageScreen', { DocumentId: this.state.pdfId, UniversityID: this.state.UniversityID }) }}
                                style={{ flex: 1, backgroundColor: 'blue', marginHorizontal: 15, borderRadius: 8, paddingVertical: 10, marginTop: 20, marginBottom: 30 }}>
                                <Text style={{ fontSize: 18, fontFamily: Fonts.Poppins_Bold, textAlign: 'center', color: '#ffffff' }}>MESSAGE</Text>
                            </TouchableOpacity>
                            :
                            null
                        }
                        {
                            this.state.message > 0 ?
                                <TouchableOpacity onPress={() => { this.paymentMethode(this.state.UniversityID) }}
                                    style={{ flex: 1, backgroundColor: 'blue', marginHorizontal: 15, borderRadius: 8, paddingVertical: 10, marginTop: 20, marginBottom: 30 }}>
                                    <Text style={{ fontSize: 18, fontFamily: Fonts.Poppins_Bold, textAlign: 'center', color: '#ffffff' }}>PAYMENT</Text>
                                </TouchableOpacity>
                                : null
                        }
                    </ScrollView>

                </View>
            </SafeAreaView >

        );
    }






}

const styles = StyleSheet.create({
    containView: { flex: 1, },
    smallCardView: {
        backgroundColor: 'white',
        shadowColor: "red",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
        borderRadius: 10, height: 100

    },
    forMimg: { height: 70, width: 80, resizeMode: 'contain' },
    formText: { fontSize: 14, fontFamily: Fonts.Poppins_Regular, color: '#616161' },
    uploadIcon: { height: 30, width: 30, resizeMode: 'contain', },
    headerText: { fontSize: 20, fontFamily: Fonts.Poppins_Bold, textAlign: 'center', marginTop: 20 },
    btnView: { alignItems: 'flex-end', marginRight: 20, marginBottom: 10 },
    btnText: { fontSize: 15, fontFamily: Fonts.Poppins_Bold, textAlign: 'center', color: '#616161' }
})
