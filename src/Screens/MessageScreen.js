import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image, TouchableOpacity, Keyboard, RefreshControl, DeviceEventEmitter, SafeAreaView } from 'react-native';
import Fonts from '../Component/Fonts';
import images from '../Theam/Images';
import NetInfo from "@react-native-community/netinfo";
import Helper from '../Lib/Helper'
import AlertMsg from '../Lib/AlertMsg'
import ApiUrl from "../Lib/ApiUrl";

export default class MessageScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeMessage: '',
            messageData: [],
            DocumentId: this.props.route.params.DocumentId,
            UniversityID: this.props.route.params.UniversityID,
            isRefreshing: false,
            sender: ''
        };
        this.chatList()
    }

    componentDidMount() {
        this.chatList()
    }

    onRefresh() {
        this.setState({ isRefreshing: true })
        this.chatList(false)
    }

    messageList = ({ item, index }) => {
        console.log(item, 'item..........');
        return (
            <View>
                {
                    Helper.user_id != item.receiver_id ?
                        <View style={styles.rightTextView}>
                           <View style={styles.rightText}>
                             <Text>{item.message}</Text>
                           </View>
                        </View>
                        :
                        <View style={styles.leftTextView}>
                            <View style={styles.leftText}>
                                <Text>{item.message}</Text>
                            </View>
                        </View>
                }
            </View>
        )
    }



    sendMessage() {
        Keyboard.dismiss()
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    Helper.getData('userdata').then(async (responseData) => {
                        var data = {
                            token: responseData.token,
                            sender_id: responseData.id,
                            document_id: this.state.DocumentId,
                            receiver_id: this.state.UniversityID,
                            message: this.state.typeMessage
                        }
                        console.log('...............', JSON.stringify(data));
                        Helper.globalLoader.showLoader()
                        Helper.makeRequest({ url: ApiUrl.SendMeaasge, method: "POST", data: data }).then((response) => {
                            if (response.status == 200) {
                                console.log('responseresponseresponse', JSON.stringify(response.data));
                                this.chatList()
                                Helper.globalLoader.hideLoader()
                                this.state.messageData.unshift(response.data);
                                this.setState({ typeMessage: '' })
                            }
                            else {
                                Helper.globalLoader.hideLoader()
                                Helper.showToast(response.message);
                            }
                        }).catch(err => {
                            this.globalLoader.hideLoader()
                        })
                    });
                }
            }
        })
    }


    chatList() {
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                Helper.showToast(AlertMsg.error.INTERNET_CONNECTION);
                return false;
            } else {
                {
                    Helper.getData('userdata').then(async (responseData) => {
                        var data = {
                            token: responseData.token,
                            user_id: responseData.id,
                            document_id: this.state.DocumentId
                        }
                        Helper.globalLoader.showLoader()
                        Helper.makeRequest({ url: ApiUrl.MessageList, method: "POST", data: data }).then((response) => {
                            if (response.status == 200) {
                                console.log('-------00000000---------', JSON.stringify(data));
                                this.setState({ messageData: response.data, isRefreshing: false, })
                                Helper.globalLoader.hideLoader()
                                if (this.state.meaasgeData == 3) {
                                    this.setState({ meaasgeData: response.data })
                                    // DeviceEventEmitter.emit("refershGetApi", countMessage1)
                                }
                            }
                            else {
                                Helper.globalLoader.hideLoader()
                                Helper.showToast(response.message);
                            }
                        }).catch(err => {
                            this.globalLoader.hideLoader()
                        })
                    });
                }
            }
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.containView}>
                <View style={styles.headerMainView}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={{ flex: 0.2, }}>
                        <Image style={styles.leftIcon} source={images.left_arrow} />
                    </TouchableOpacity>
                    <View style={{ flex: 0.6, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.headerText}>Chat</Text>
                    </View>
                    <TouchableOpacity onPress={() => { this.onRefresh() }} style={{ flex: 0.2, }}>
                        <Image style={[styles.leftIcon, { left: 20 }]} source={images.refresh} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.messageData}
                    renderItem={this.messageList}
                    extraData={this.state}
                    refreshControl={
                        <RefreshControl
                            tintColor={'bluie'}
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this.onRefresh()}
                        />
                    }
                    inverted={false}
                    ref={(ref) => (this.flatList = ref)}
                    keyboardShouldPersistTaps="handled"
                    keyExtractor={(index) => {
                        index.toString();
                    }}
                    onContentSizeChange={() =>
                        this.flatList.scrollToEnd()}
                />
                <View style={{ height: 30 }} />
                <View style={{ marginHorizontal: 10, marginBottom: 20, flexDirection: 'row' }}>
                    <View style={{ flex: 0.85, borderWidth: 0.5, borderRadius: 10, backgroundColor: '(rgba(0,0,0,0.1))', }}>
                        <TextInput style={{ paddingLeft: 10, height:50 }}
                            placeholder='Type here...'
                            onChangeText={(value) => { this.setState({ typeMessage: value }) }}
                            value={this.state.typeMessage}
                        />
                    </View>
                    <View style={styles.sendIconView}>
                        <TouchableOpacity onPress={() => this.state.typeMessage.length > 0 && this.sendMessage()} style={styles.sendView}>
                            <Image style={styles.sendIcon} source={require('../assets/Images/send.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    containView: { flex: 1 },
    leftTextView: { flexDirection: 'row', marginHorizontal: 20, marginTop: 20 },
    leftText: { backgroundColor: '#45937a', paddingHorizontal: 10, paddingVertical: 3, borderTopRightRadius: 10, borderTopLeftRadius: 10, borderBottomRightRadius: 10 },
    rightTextView: { flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 20, marginTop: 20 },
    rightText: { backgroundColor: '#dbdede', paddingHorizontal: 10, paddingVertical: 3, borderTopRightRadius: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
    sendIcon: { height: 25, width: 25, resizeMode: 'contain', tintColor: 'white' },
    sendIconView: { flex: 0.15, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
    leftIcon: { height: 20, width: 40, resizeMode: 'contain' },
    headerText: { fontSize: 18, fontFamily: Fonts.Poppins_SemiBold, },
    headerMainView: { flexDirection: 'row', backgroundColor: 'white', alignItems: 'center', padding: 10 },
    sendView: { backgroundColor: 'blue', padding: 10, borderRadius: 100 }
})
