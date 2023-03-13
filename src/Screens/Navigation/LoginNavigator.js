import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from '../Login'
import SignUp from '../SignUp';
import SelectCountry from '../SelectCountry';
import SelectSpecif from '../SelectSpecif';
import HomePage from '../HomePage';
import DetailPage from '../DetailPage';
import PaymentAfterScreen from '../PaymentAfterScreen';
import UploadForm from '../UploadForm';
import SideDrawer from '../Drawer'
import ForgotePassword from '../ForgotePassword';
import OtpScreen from '../OtpScreen';
import SetPassword from '../SetPassword';
import CountryList from '../CountryList';
import ChangePassword from '../ChangePassword';
import ProfileSetting from '../ProfileSetting';
import Splash from '../Splash';
import OtpForgote from '../OtpForgote';
import UserUpdoald from '../UserUpdoald';
import Notification from '../Notification';
import MessageScreen from '../MessageScreen';
import PaymentScreen from '../PaymentScreen';
import TermsAndCondition from '../TermsAndCondition';
import PrivacyPolicy from '../PrivacyPolicy';
import PaymentMethods from '../payment/index'
import AddNewCardMethode from '../payment/AddNewCardMethode'


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const DrawerStack = () => (
    <Drawer.Navigator
        drawerType={'slide'}
        drawerStyle={{
            width: '75%',
        }}
        drawerType="front"
        options={{ headerShown: false }}
        drawerContent={props => <SideDrawer {...props} />
        }
    >
        <Drawer.Screen name="HomePage" component={HomePage} />
    </Drawer.Navigator>
)

function LoginNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
                <Stack.Screen name="CountryList" component={CountryList} options={{ headerShown: false }} />
                <Stack.Screen name="SetPassword" component={SetPassword} options={{ headerShown: false }} />
                <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
                <Stack.Screen name="DrawerStack" component={DrawerStack} options={{ headerShown: false }} />
                <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
                <Stack.Screen name="SelectCountry" component={SelectCountry} options={{ headerShown: false }} />
                <Stack.Screen name="SelectSpecif" component={SelectSpecif} options={{ headerShown: false }} />
                <Stack.Screen name="ForgotePassword" component={ForgotePassword} options={{ headerShown: false }} />
                <Stack.Screen name="DetailPage" component={DetailPage} options={{ headerShown: false }} />
                <Stack.Screen name="PaymentAfterScreen" component={PaymentAfterScreen} options={{ headerShown: false }} />
                <Stack.Screen name="UploadForm" component={UploadForm} options={{ headerShown: false }} />
                <Stack.Screen name="ProfileSetting" component={ProfileSetting} options={{ headerShown: false }} />
                <Stack.Screen name="OtpForgote" component={OtpForgote} options={{ headerShown: false }} />
                <Stack.Screen name="UserUpdoald" component={UserUpdoald} options={{ headerShown: false }} />
                <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
                <Stack.Screen name="MessageScreen" component={MessageScreen} options={{ headerShown: false }} />
                <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }} />
                <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} options={{ headerShown: false }} />
                <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false }} />
                <Stack.Screen name="PaymentMethods" component={PaymentMethods} options={{ headerShown: false }} />
                <Stack.Screen name="AddNewCardMethode" component={AddNewCardMethode} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default LoginNavigator;