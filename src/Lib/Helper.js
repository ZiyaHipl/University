
import * as React from 'react';
import Toast from 'react-native-root-toast';
import { Alert, Platform, Dimensions, Keyboard } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import DeviceInfo from 'react-native-device-info'
import Config from './Config';
import Contacts from 'react-native-contacts';
import { check, request, PERMISSIONS, openSettings } from 'react-native-permissions';

const { width, height } = Dimensions.get('window')
export default class Helper extends React.Component {
    url = "";
    static mainApp;
    static toast;
    static user = {};
    static navigationRef;
    static Loader;
    static device_type = Platform.OS == 'android' ? 'ANDROID' : 'IOS';
    static device_token = 'SIMULATOR';
    static hasNotch = DeviceInfo.hasNotch();
    static country_list = '';
    static cartcount = 0
    static notificationCount = 0
    static globalLoader;
    static UserInfo;
    static UpadateUserData;
    static user_id;
    static token = {};


    static getFormData(obj) {
        let formData = new FormData();
        for (let i in obj) {
            formData.append(i, obj[i]);
        }
        return formData;
    }

    static registerLoader(mainApp) {
        Helper.globalLoader = mainApp;
    }

    constructor(props) {
        super(props)
    }

    static registerNavigator(ref) {
        Helper.navigationRef = ref;
    }

    static registerLoged(mainApp) {
        Helper.mainApp = mainApp;
    }


    static showLoader() {
        Keyboard.dismiss();
        Helper.mainApp.setState({ loader: true })
    }

    static hideLoader() {
        Helper.mainApp.setState({ loader: false })
    }

    static registerToast(toast) {
        Helper.toast = toast;
    }

    static showToast(msg) {
        if (msg) {
            Toast.show(msg, {
                duration: 2000,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
        }
    }

    static alert(alertMessage, cb) {
        Alert.alert(
            Config.app_name,
            alertMessage,
            [
                { text: 'OK', onPress: () => { if (cb) cb(true); console.log('OK Pressed') } },
            ],
            { cancelable: false }
        )
    }

    static confirm(alertMessage, cb) {
        Alert.alert(
            Config.app_name,
            alertMessage,
            [
                { text: 'OK', onPress: () => { if (cb) cb(true); console.log('OK Pressed') } },
                { text: 'Cancel', onPress: () => { if (cb) cb(false); }, style: 'cancel' },
            ],
            { cancelable: false }
        )
    }

    static confirmPopUp(alertMessage, cb) {
        Alert.alert(
            Config.app_name,
            alertMessage,
            [
                { text: 'YES', onPress: () => { if (cb) cb(true); console.log('OK Pressed') } },
                { text: 'NO', onPress: () => { if (cb) cb(false); }, style: 'cancel' },
            ],
            { cancelable: false }
        )
    }

    static permissionConfirm(alertMessage, cb) {
        Alert.alert(
            Config.app_name,
            alertMessage,
            [
                { text: 'NOT NOW', onPress: () => { if (cb) cb(false); }, style: 'cancel' },
                { text: 'SETTINGS', onPress: () => { if (cb) cb(true); console.log('OK Pressed') } },
            ],
            { cancelable: false }
        )
    }

    static cameraAlert(alertMessage, Camera, Gallery, Cancel, cbCamera, cbGallery) {
        Alert.alert(
            Config.app_name,
            alertMessage,
            [
                { text: Camera, onPress: () => { if (cbCamera) cbCamera(true); console.log('OK Pressed') } },
                { text: Gallery, onPress: () => { if (cbGallery) cbGallery(true); console.log('OK Pressed') } },
                { text: Cancel, onPress: () => { if (cbCamera) cbCamera(false); }, style: 'cancel' },
            ],
            { cancelable: false }
        )
    }

    static async setData(key, val) {
        try {
            let tempval = JSON.stringify(val);
            await AsyncStorage.setItem(key, tempval);
        } catch (error) {
            console.error(error, "AsyncStorage")
        }
    }

    static async getData(key) {
        try {
            let value = await AsyncStorage.getItem(key);
            if (value) {
                let newvalue = JSON.parse(value);
                return newvalue;
            } else {
                return value;
            }
        } catch (error) {
            console.error(error, "AsyncStorage")
        }
    }

    static async makeRequest({ url, data, method = "POST", loader = true }) {
        let finalUrl = Config.baseurl + url;
        console.log(finalUrl, "finalUrl");
        let form;
        let methodnew;
        let token = await this.getData("token");

        console.log(token, "tokentoken")
        console.log(data, "form")
        let varheaders;
        if (method == "POSTUPLOAD") {
            methodnew = "POST";
            varheaders = {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data;',
                Authorization: 'Token ' + token
            }
            form = data;
        }
        else if (method == "PUTUPLOAD") {
            methodnew = "PUT";
            varheaders = {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data;',
                Authorization: 'Token ' + token
            }
            form = data;
        }
        else if (method == "POST") {
            methodnew = "POST";
            if (token) {
                varheaders = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": 'Token ' + token
                }
            } else {
                varheaders = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
            form = JSON.stringify(data);
        }
        else if (method == "PATCH") {
            methodnew = "PATCH";
            if (token) {
                varheaders = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": 'Token ' + token
                }
            } else {
                varheaders = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
            form = JSON.stringify(data);
        }
        else if (method == "PUT") {
            methodnew = "PUT";
            if (token) {
                varheaders = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": 'Token ' + token
                }
            } else {
                varheaders = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
            form = JSON.stringify(data);
        }
        else if (method == "DELETE") {
            methodnew = "DELETE";
            if (token) {
                varheaders = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": 'Token ' + token
                }
            } else {
                varheaders = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
            form = JSON.stringify(data);
        }
        else {
            methodnew = "GET";
            if (token) {
                varheaders = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": 'Token ' + token,
                }
            } else {
                varheaders = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        }
        console.log("===>body", form)
        console.log("===>method", method)
        console.log("===>headers", varheaders)
        return fetch(finalUrl, {
            body: form,
            method: methodnew,
            headers: varheaders,
        })
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                console.log(responseJson, "=====+++++responseJson2343")
                if (responseJson.status == 400) {
                    AsyncStorage.removeItem("token");
                    AsyncStorage.removeItem('userdata')
                    Helper.user_id = ''
                    Helper.UserInfo = ''
                    Helper.navigationRef.reset({
                        index: 0,
                        routes: [{ name: "Login" }],
                    });
                    Helper.globalLoader.hideLoader()
                    // AsyncStorage.removeItem('userdata');
                    // AsyncStorage.removeItem('token');
                    // Helper.navigationRef.reset({
                    //     index: 0,
                    //     routes: [{ name: "AfterLogout" }],
                    // });
                    // AsyncStorage.removeItem("is_social");
                    // this.showToast(responseJson.error);
                } else
                    return responseJson;
            })
            .catch((error, a) => {
                this.showToast("Please check your internet connection");
                //  this.showToast(error);
                console.log('errorerror', error);
            });
    }

    static getImageUrl(url) {
        //return finalUrl = Config.imageUrl + '/' + url;
        return url;
    }

    static checkNull(txt) {
        if (txt == null) {
            return ''
        } else {
            return txt
        }
    }

    static setTrim(value) {
        if (value == '') {
            return value
        }
        else if (value == undefined) {
            return ''
        }
        else {
            return value.trim()
        }
    }


    static checkContactsPremission = async (cb) => {
        await check(Platform.select({
            android: PERMISSIONS.ANDROID.WRITE_CONTACTS && PERMISSIONS.ANDROID.READ_CONTACTS,
            ios: PERMISSIONS.IOS.CONTACTS
        })).then(result => {
            if (result === "granted") {
                console.log('already allow the contacts');
                cb(true);
                return;
            }
            if (result === "blocked" || result === "unavailable") {
                cb(false);
                Helper.permissionConfirm("Access to the contacts has been prohibited please enable it in the Settings app to continue.", ((status) => {
                    if (status) {
                        openSettings().catch(() => {
                            console.warn('cannot open settings')
                        });
                    }
                }));
                return;
            }
            request(
                Platform.select({
                    android: PERMISSIONS.ANDROID.WRITE_CONTACTS && PERMISSIONS.ANDROID.READ_CONTACTS,
                    ios: PERMISSIONS.IOS.CONTACTS
                })
            ).then((status) => {
                if (status === "granted") {
                    console.log('You can use the contacts');
                    cb(true);
                } else {
                    cb(false);
                    console.log('contacts permission denied');
                }
            });
        });
    }


    static getAllContacts(data, cb) {
        Contacts.getAll((err, contacts) => {
            // console.log('**************contacts: ',err)

            let allcontacts = [];
            for (let con of contacts) {

                // console.log('****************************All Contact Data: ', JSON.stringify(con))
                if (con.givenName && con.phoneNumbers[0] && con.phoneNumbers[0].number) {
                    allcontacts.push({
                        name: Platform.OS === "android" ? con.displayName : con.givenName + " " + con.familyName,
                        // number: con.phoneNumbers[0].number.split(' ').join(''),
                        number: Helper.phoneNumberCorrectFormate(con.phoneNumbers[0].number, data),
                        //country_code: defaultCode
                        country_code: "",
                    });
                    // if (con.phoneNumbers[0].number.startsWith('+')) {
                    //     allcontacts.push({
                    //         name: con.givenName,
                    //         number: con.phoneNumbers[0].number.replace('+', '').split(' ').join('')
                    //     });
                    // } else {
                    //     allcontacts.push({
                    //         name: con.givenName,
                    //         number: defaultCode + con.phoneNumbers[0].number.replace('+', '').split(' ').join('')
                    //     });
                    // }
                }
            }

            // console.log('****************************All Contact List: ', JSON.stringify(allcontacts))


            cb(allcontacts);
        })
    }

    static phoneNumberCorrectFormate(strOldNumber, userDetails) {
        //  console.log("strOldNumber---------", userDetails)
        let strCheckContact = strOldNumber.toString()

        let correctContactNumber = strCheckContact.replace(/[^+0-9]/g, "")
        /* Without Country Code Contact */
        if (correctContactNumber.indexOf("+") == -1) {
            if (correctContactNumber.charAt(0).toString() == '0') {
                correctContactNumber = correctContactNumber.slice(1)
                if (correctContactNumber.charAt(0).toString() == '0') {
                    correctContactNumber = correctContactNumber.slice(1)
                }
            }
            // if(userDetails.country_code!=''){
            //     correctContactNumber = userDetails.country_code + correctContactNumber
            // }
        }
        /* With Country Code Contact */
        else {
            /* Contact Start with '+' */
            if (correctContactNumber.startsWith('+')) {
                /* Check Country Code +44 */
                let checkUkCode = correctContactNumber.charAt(1).toString() + correctContactNumber.charAt(2).toString()
                if (Number(checkUkCode) == 44) {
                    /* Remove Country Code +44 form contact for temprary */
                    let removeCodeNumber = correctContactNumber.replace('+44', '');
                    if (removeCodeNumber.charAt(0).toString() == '0') {
                        removeCodeNumber = removeCodeNumber.slice(1)
                        if (removeCodeNumber.charAt(0).toString() == '0') {
                            removeCodeNumber = removeCodeNumber.slice(1)
                        }
                    }
                    /* Add Again Country Code +44 */
                    correctContactNumber = "+44" + removeCodeNumber;
                }
            }
        }
        // console.log("correctContactNumber---------", correctContactNumber.replace(/[^0-9]/g, ""))

        return correctContactNumber.replace(/[^0-9]/g, "")
    }



}


