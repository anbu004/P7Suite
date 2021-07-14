import React, { Component } from "react";
import styles from "./style";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Platform,
    AsyncStorage,
    Image,
    ImageBackground
} from 'react-native';
import { Button } from 'react-native-elements';
import api from '../../config/OdooConnect';
// import console = require("console");
import Toast, { DURATION } from 'react-native-easy-toast'
import { BackHandler } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import { List, ListItem, Card, Rating, Header } from 'react-native-elements';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import ToggleSwitch from 'toggle-switch-react-native'
import Orientation from "react-native-orientation";


export default class SettingsDashboardScreen extends Component {
    constructor(props) {
        super(props)

        global.MyVar;
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.state = {
            isOnDefaultToggleSwitch: null,
            isOnDefaultLcoationToggleSwitch: null,
        };
    }

   
    
      async onToggle(isOn) {
        console.log("Changed to " + isOn);
        if(isOn == true){
            // Orientation.lockToPortrait();
            console.log('orientation true')
            try {
                const { isOnDefaultToggleSwitch } = this.state;
    
                await AsyncStorage.setItem('@MySuperStore:screen', 'settingstrue');

    
            } catch (error) {
                console.log("Error saving data" + error);
            }

        }else{
            // Orientation.lockToLandscape();

            console.log('orientation false')

            try {
                const { isOnDefaultToggleSwitch } = this.state;
    
                await AsyncStorage.setItem('@MySuperStore:screen', 'settingsfalse');

    
            } catch (error) {
                console.log("Error saving data" + error);
            }
        }
      }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        this.props.navigation.navigate('Dashboardpage');
        return true;
    }

    componentDidMount() {

        this.getKey();
    }

    async getKey() {
        try {
            // const value = await AsyncStorage.getItem('@MySuperStore:uid');
            // console.log('savedddddvale', value);


            const value = await AsyncStorage.getItem('@MySuperStore:screen');
            console.log('screenorientation', value);

            if(value == 'settingstrue'){
                this.setState({ isOnDefaultToggleSwitch: true });
            }else{
                this.setState({ isOnDefaultToggleSwitch: false });
            }

            global.MyVar = value;

        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }


    backPress() {
        this.props.navigation.navigate('Dashboardpage');
    }

    onLocationPress() {

        // this.props.navigation.navigate('Mapview')
    }

    onPinPress() {
        this.props.navigation.navigate('SetasecureSetpin')
    }

 
    render() {
        return (


            <View style={styles.container}>
                <Header leftComponent={<FontAwesomeIcon name="home" color='#fff' size={22}
                    onPress={() => this.backPress()} />}
                    centerComponent={{ text: 'Settings', style: { color: '#fff', fontSize: 20 } }}
                    // rightComponent={<FontAwesomeIcon name="sign-out-alt" color= '#fff' size={22}  onPress={() => this.props.navigation.navigate("Notification")} /> } 
                    navigation={this.props.navigation} pageRefresh={this.pageRefresh}
                    containerStyle={{
                        backgroundColor: '#0D50B8',

                    }} />
                {/* <View style={styles.imageContainer}>
                    <Image
                        resizeMode="contain"
                        source={require('../../assets/logo.png')}
                        style={styles.imagelogo}
                    />
                </View> */}

{/* <ImageBackground
                    style={styles.rect}
                    imageStyle={styles.rect_imageStyle}
                    source={require("../../assets/Gradient_LZGIVfZ.png")}
                > */}

                
                {/* <View style={{ alignItems: 'center', flexDirection: 'row',marginTop:150 }}>


                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}
                    >

                        <TouchableOpacity onPress={() => this.onLocationPress()}>

                            <View style={styles.imageContainer}>
                                <Image
                                    resizeMode="contain"
                                    source={require('../../assets/location.png')}
                                    style={styles.image}
                                />
                            </View>
                        </TouchableOpacity>


                        <View style={styles.rect9}>
                                <Text style={styles.text22}>Location Logincheck</Text>
                            </View>
                    </View>


                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>

                        <TouchableOpacity onPress={() => this.onPinPress()}>

                            <View style={styles.imageContainer}>
                                <Image
                                    resizeMode="contain"
                                    source={require('../../assets/setpin.png')}
                                    style={styles.image}
                                />
                            </View>

                        </TouchableOpacity>
                        <View style={styles.rect9}>
                                <Text style={styles.text22}>Set a secure pin</Text>
                            </View>
                    </View>
                </View> */}

<Card>

<TouchableOpacity onPress={() => this.onPinPress()}>

<Text style={{fontWeight:"900",color: "gray"}}>General</Text>


<View style={{flexDirection:'column', marginTop:20}}>

<Text style={{fontWeight:"900",color: "black"}}>Pin</Text>

<Text style={{fontWeight:"900",color: "gray"}}>Set a Secure Pin</Text>


</View>

</TouchableOpacity>

<View style={{flexDirection:'column', marginTop:10}}>

<Text style={{fontWeight:"900",color: "black"}}>Orientation</Text>

<View style={{flexDirection:'row'}}>
<Text style={{fontWeight:"900",color: "gray", marginRight:30}}>Screen Orientation</Text>

<ToggleSwitch
          isOn={this.state.isOnDefaultToggleSwitch}

  onColor="green"
  offColor="red"
  size="medium"
  onToggle={isOnDefaultToggleSwitch => {
    this.setState({ isOnDefaultToggleSwitch });
    this.onToggle(isOnDefaultToggleSwitch);
  }}
/>
</View>


</View>

<View style={{flexDirection:'column', marginTop:10}}>

<Text style={{fontWeight:"900",color: "black"}}>Tracking</Text>
<View style={{flexDirection:'row'}}>
<Text style={{fontWeight:"900",color: "gray", marginRight:30}}>Location Tracking</Text>
<ToggleSwitch
          isOn={this.state.isOnDefaultLcoationToggleSwitch}

  onColor="green"
  offColor="red"
  size="medium"
  onToggle={isOnDefaultLcoationToggleSwitch => {
    this.setState({ isOnDefaultLcoationToggleSwitch });
    this.onToggle(isOnDefaultLcoationToggleSwitch);
  }}
/>

</View>


</View>

</Card>
                {/* </ImageBackground> */}


            </View>
        );
    }

}