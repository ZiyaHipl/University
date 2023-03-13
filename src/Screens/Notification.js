import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import Fonts from '../Component/Fonts';
import NetInfo from "@react-native-community/netinfo";
import Helper from '../Lib/Helper'
import AlertMsg from '../Lib/AlertMsg'
import ApiUrl from "../Lib/ApiUrl";
import images from '../Theam/Images';

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationDATA: [],
      UniversityID: '',
      DocumentId: ''
    };
  }

  componentDidMount() {
    this.notificationList()
  }

  onClicknotification = (item) => {
    if (item.notifications_type == 'request_document') {
      this.props.navigation.navigate('HomePage')
    } else {
      this.props.navigation.navigate('MessageScreen', { UniversityID: item.university_id, DocumentId: item.action_id })
    }
  }

  notificationlist = ({ item }) => {
    return (
      <TouchableOpacity
        // onPress={() => { this.onClicknotification(item) }}
        style={styles.boxView}>
        <View style={{ flex: 0.9, }}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.detailsText}>{item.detail} </Text>
        </View>
      </TouchableOpacity>
    )
  }

  notificationList() {
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
            }
            console.log('notificationDAta', JSON.stringify(data));
            Helper.globalLoader.showLoader()
            Helper.makeRequest({ url: ApiUrl.NotificationList, method: "POST", data: data }).then((response) => {
              if (response.status == 200) {
                console.log('responseresponsenOTIFICATION', JSON.stringify(response));
                this.setState({
                  notificationDATA: response.data,
                })
                Helper.globalLoader.hideLoader()
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
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerMainView}>
          <View style={{ flex: 0.5 }}>
            <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
              <Image style={styles.backBtn} source={images.left_arrow} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.5 }}>
            <Text style={styles.headerText}>Notification</Text>
          </View>
        </View>
        <FlatList showsVerticalScrollIndicator={false}
          data={this.state.notificationDATA}
          renderItem={this.notificationlist}
        />
        <View style={{ marginBottom: 10 }} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  boxView: { marginHorizontal: 20, marginTop: 20, backgroundColor: 'white', padding: 10, borderRadius: 10, flexDirection: 'row', },
  titleText: { fontSize: 18, fontFamily: Fonts.Poppins_Bold },
  detailsText: { fontSize: 14, fontFamily: Fonts.Poppins_Light },
  countView: { flex: 0.1, alignItems: 'center', justifyContent: 'center' },
  headerMainView: { flexDirection: 'row', marginHorizontal: 15, padding: 10, marginTop: 10 },
  backBtn: { height: 25, width: 25, resizeMode: 'contain', tintColor: 'hsla(0, 0%, 78%, 1)' },
  headerText: { fontSize: 18, fontFamily: Fonts.Poppins_Bold, right: 50 }
})
