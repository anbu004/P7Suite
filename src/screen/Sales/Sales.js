import React, { Component } from "react";
import styles from "./style";

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    Modal,
    ActivityIndicator,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Platform,
    AsyncStorage,
    Image,
    BackHandler,
} from 'react-native';
import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation,
} from 'react-native-popup-dialog';
import { Card, SearchBar, Header } from 'react-native-elements';
import connect from '../../config/OdooConnect';
// import console = require("console");
import Toast, { DURATION } from 'react-native-easy-toast'
import { FlatList } from "react-native-gesture-handler";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import Orientation from "react-native-orientation";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class SalesScreen extends Component {
    constructor(props) {
        super(props)
        this.state = { isLoading: true, search: '' };
        this.arrayholder = [];
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        Orientation.lockToPortrait();

    }

    state = {
        data: [],
        search: '',
        scaleAnimationDialog: false
    }

    componentWillMount() {
        Orientation.lockToPortrait();

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        Orientation.lockToPortrait();

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        this.props.navigation.navigate('SubDashboard');
        return true;
    }

    componentDidMount() {
        console.log('read--------------calling------------api---')
       // Orientation.lockToPortrait();
        //this.getKey();
        this.searchReadfunction();
    }

    async getKey() {
        try {
            // const value = await AsyncStorage.getItem('@MySuperStore:uid');
            // console.log('savedddddvale', value);


            const value = await AsyncStorage.getItem('@MySuperStore:screen');
            console.log('screenorientation', value);

            if(value == 'settingstrue'){
                Orientation.lockToLandscape();
            }else{
                Orientation.lockToPortrait();
            }


        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }

    backPress() {
        this.props.navigation.navigate('SubDashboard');
    }

    popPress() {
        console.log("asasasasasasasasasasasasasa")
        this.setState({
            scaleAnimationDialog: true,
        });
    }


    addLog(data) {

        // console.log('texttt', data)

        if (data == 'today') {
            const { state } = this.props.navigation;

            var today = new Date();
            let date = today.getDate() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getFullYear();

            var todayDate = moment(Date(date)).format('YYYY-MM-DD');

            console.log(todayDate);

            this.setState({
                scaleAnimationDialog: false,
            });

            this.searchReadtoday(todayDate);

        } else if (data == 'yesterday') {

            const { state } = this.props.navigation;
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate() - 1;

            var newmonth;
            var newdate;
            if (month < 10) {
                newmonth = '0' + month;
            } else {
                newmonth = month;
            }

            if (day < 10) {
                newdate = '0' + day;
            } else {
                newdate = day;
            }

            let yesterdaydate = year + '-' + newmonth + '-' + newdate;

            console.log('yesterdatdate', yesterdaydate);
            this.setState({
                scaleAnimationDialog: false,
            });
            this.searchReadyesterday(yesterdaydate);


        } else if (data == 'This Week') {

            console.log('thissss weeek')

            var today = new Date();
            var day = today.getDay() || 7; // Get current day number, converting Sun. to 7
            if (day !== 1)                // Only manipulate the date if it isn't Mon.
                today.setHours(-24 * (day - 1));   // Set the hours to day number minus 1

            var date = new Date(today),
                mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                day = ("0" + date.getDate()).slice(-2);
            console.log([date.getFullYear(), mnth, day].join("-"))

            this.setState({
                scaleAnimationDialog: false,
            });

            this.searchReadthisweek([date.getFullYear(), mnth, day].join("-"));



        } else if (data == 'Last Week') {

            console.log('last weeek')

            //this week date
            var today = new Date();
            var day = today.getDay() || 7; // Get current day number, converting Sun. to 7
            if (day !== 1)                // Only manipulate the date if it isn't Mon.
                today.setHours(-24 * (day - 1));   // Set the hours to day number minus 1

            var date = new Date(today),
                mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                day = ("0" + date.getDate()).slice(-2);

            var currentweekdate = [date.getFullYear(), mnth, day].join("-");
            console.log(currentweekdate);

            //last week date
            var curr = new Date; // get current date
            var first = curr.getDate() - curr.getDay() - 6; // Gets day of the month (e.g. 21) - the day of the week (e.g. wednesday = 3) = Sunday (18th) - 6
            var startDate = new Date(curr.setDate(first));


            var d = new Date(startDate),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            var lastweekdate = [year, month, day].join('-');

            console.log(lastweekdate);

            this.setState({
                scaleAnimationDialog: false,
            });

            this.searchReadlastweek(currentweekdate, lastweekdate)



        } else if (data == 'This Month') {

            var dateObj = new Date();

            dateObj.setDate(0)

            var month = dateObj.getMonth() + 1;

            var day = dateObj.getDate();

            var year = dateObj.getFullYear();

            var newmonth;
            var newdate;
            if (month < 10) {
                newmonth = '0' + month;
            } else {
                newmonth = month;
            }

            if (day < 10) {
                newdate = '0' + day;
            } else {
                newdate = day;
            }


            newdate = year + "-" + newmonth + "-" + newdate;

            this.setState({
                scaleAnimationDialog: false,
            });

            this.searchReadthismonth(newdate);


        } else if (data == 'Last Month') {



            var now = new Date();
            var prevMonthLastDate = new Date(now.getFullYear(), now.getMonth(), 0);
            var prevMonthFirstDate = new Date(now.getFullYear() - (now.getMonth() > 0 ? 0 : 1), (now.getMonth() - 1 + 12) % 12, 1);

            var formatDateComponent = function (dateComponent) {
                return (dateComponent < 10 ? '0' : '') + dateComponent;
            };

            var formatDate = function (date) {
                return formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate()) + '-' + date.getFullYear();
            };


            console.log('prevMonthLastDate' + formatDate(prevMonthLastDate));

            var firstdate = formatDate(prevMonthFirstDate);
            var lastdate = formatDate(prevMonthLastDate);

            var datearray = firstdate.split("-");

            var newfirstdate = datearray[2] + '-' + datearray[0] + '-' + datearray[1];

            console.log('prevMonthFirstDate' + newfirstdate);


            var datearray1 = lastdate.split("-");

            var newlastdate = datearray1[2] + '-' + datearray1[0] + '-' + datearray1[1];

            console.log('prevMonthLastDate' + newlastdate);

            this.setState({
                scaleAnimationDialog: false,
            });

            this.searchReadlastmonth(newfirstdate, newlastdate);

        }

        else {
            console.log('allllll')
            const { state } = this.props.navigation;

            this.setState({
                scaleAnimationDialog: false,
            });

            this.searchReadfunction();

        }


    }

    searchReadtoday(todayDate) {
        console.log('read--------------calling------------api---' + todayDate)



        const params = {
            domain: [["state", "not in", ["draft", "cancel", "decline", "waiting"]], ["create_date", "=", todayDate]],
            fields: ["message_needaction", "name_quotation", "date_order", "partner_id", "user_id", "open_po", "exp_del_date", "amount_total", "currency_id", "state", "name"],
            order: '',
            limit: '',
            offset: '',
        }

        return connect.searchRead('sale.order', params)
            .then(response => {
                console.log(response)
                if (response.success) {
                    this.setState({
                        isLoading: false,
                        data: response.data,
                    },
                        function () {
                            this.arrayholder = response.data;
                        });
                }
            },
            )
            .catch(err => console.log(err))
    }

    searchReadyesterday(yesterDate) {
        console.log('read--------------calling------------api---' + yesterDate)

        const params = {
            domain: [["state", "not in", ["draft", "cancel", "decline", "waiting"]], ["create_date", "=", yesterDate]],
            fields: ["message_needaction", "name_quotation", "date_order", "partner_id", "user_id", "open_po", "exp_del_date", "amount_total", "currency_id", "state", "name"],
            order: '',
            limit: '',
            offset: '',
        }

        return connect.searchRead('sale.order', params)
            .then(response => {
                console.log(response)
                if (response.success) {
                    this.setState({
                        isLoading: false,
                        data: response.data,
                    },
                        function () {
                            this.arrayholder = response.data;
                        });
                }
            },
            )
            .catch(err => console.log(err))
    }


    searchReadthisweek(thisweekDate) {
        console.log('read--------------calling------------apiweek---' + thisweekDate)
        const context = {
            uid: this.props.displayStr,
            tz: false,
            lang: 'en_US',
            default_team_id: 1,
            search_default_assigned_to_me: 0,
        }

        const params = {
            domain: [["state", "not in", ["draft", "cancel", "decline", "waiting"]], ["create_date", ">=", thisweekDate]],
            fields: ["message_needaction", "name_quotation", "date_order", "partner_id", "user_id", "open_po", "exp_del_date", "amount_total", "currency_id", "state", "name"],
            order: '',
            limit: '',
            offset: '',
        }

        return connect.searchRead('sale.order', params)
            .then(response => {
                console.log(response)
                if (response.success) {
                    this.setState({
                        isLoading: false,
                        data: response.data,
                    },
                        function () {
                            this.arrayholder = response.data;
                        });
                }
            },
            )
            .catch(err => console.log(err))
    }

    searchReadlastweek(thisweekDate, lastweekDate) {
        console.log('read--------------calling------------thisweekDate---', thisweekDate)
        console.log('read--------------calling------------lastweekDate---', lastweekDate)

        const params = {
            domain: [["state", "not in", ["draft", "cancel", "decline", "waiting"]], ["create_date", "<", thisweekDate], ["create_date", ">", lastweekDate]],
            fields: ["message_needaction", "name_quotation", "date_order", "partner_id", "user_id", "open_po", "exp_del_date", "amount_total", "currency_id", "state", "name"],
            order: '',
            limit: '',
            offset: '',
        }

        return connect.searchRead('sale.order', params)
            .then(response => {
                console.log(response)
                if (response.success) {
                    this.setState({
                        isLoading: false,
                        data: response.data,
                    },
                        function () {
                            this.arrayholder = response.data;
                        });
                }
            },
            )
            .catch(err => console.log(err))
    }


    searchReadthismonth(thismonthDate) {
        console.log('read--------------calling------------this month date---' + thismonthDate)
        const context = {
            uid: this.props.displayStr,
            tz: false,
            lang: 'en_US',
            default_team_id: 1,
            search_default_assigned_to_me: 0,
        }

        const params = {
            domain: [["state", "not in", ["draft", "cancel", "decline", "waiting"]], ["create_date", ">=", thismonthDate]],
            fields: ["message_needaction", "name_quotation", "date_order", "partner_id", "user_id", "open_po", "exp_del_date", "amount_total", "currency_id", "state", "name"],
            order: '',
            limit: '',
            offset: '',
        }

        return connect.searchRead('sale.order', params)
            .then(response => {
                console.log(response)
                if (response.success) {
                    this.setState({
                        isLoading: false,
                        data: response.data,
                    },
                        function () {
                            this.arrayholder = response.data;
                        });
                }
            },
            )
            .catch(err => console.log(err))
    }

    searchReadlastmonth(lastmonthfirstDate, lastmonthendDate) {
        console.log('read--------------calling------------thisweekDate---', lastmonthfirstDate)
        console.log('read--------------calling------------lastweekDate---', lastmonthendDate)
        const context = {
            uid: this.props.displayStr,
            tz: false,
            lang: 'en_US',
            default_team_id: 1,
            search_default_assigned_to_me: 0,
        }

        const params = {
            domain: [["state", "not in", ["draft", "cancel", "decline", "waiting"]], ["create_date", "<", lastmonthendDate], ["create_date", ">=", lastmonthfirstDate]],
            fields: ["message_needaction", "name_quotation", "date_order", "partner_id", "user_id", "open_po", "exp_del_date", "amount_total", "currency_id", "state", "name"],
            order: '',
            limit: '',
            offset: '',
        }

        return connect.searchRead('sale.order', params)
            .then(response => {
                console.log(response)
                if (response.success) {
                    this.setState({
                        isLoading: false,
                        data: response.data,
                    },
                        function () {
                            this.arrayholder = response.data;
                        });
                }
            },
            )
            .catch(err => console.log(err))
    }

    onLoginPress() {

        Alert.alert('welcome')


    }

    searchReadfunction() {
        console.log('read--------------calling------------api---')
        const context = {
            uid: this.props.displayStr,
            tz: false,
            lang: 'en_US',
            default_team_id: 1,
            search_default_assigned_to_me: 0,
        }

        const params = {
            domain: [["state", "not in", ["draft", "cancel", "decline", "waiting"]]],
            fields: ["message_needaction", "name_quotation", "date_order", "partner_id", "user_id", "open_po", "exp_del_date", "amount_total", "currency_id", "state", "name"],
            order: '',
            limit: '',

            offset: '',
        }

        return connect.searchRead('sale.order', params)
            .then(response => {
                console.log(response)
                if (response.success) {
                    this.setState({
                        isLoading: false,
                        data: response.data,
                    },
                        function () {
                            this.arrayholder = response.data;
                        });
                }
            },
            )
            .catch(err => console.log(err))
    }


    goToQuotationDetailScreen(id) {
        console.log('quotaionkey>>', id);
        this.props.navigation.navigate('SalesForm', { 'opprtunityFormDetail': { opp_id: id } });
    };

    search = text => {
        console.log(text);
    };
    clear = () => {
        this.search.clear();
    };



    SearchFilterFunction(text) {
        //passing the inserted text in textinput
        const newData = this.arrayholder.filter(function (item) {
            //applying filter for the inserted text in search bar
            // const itemData = item.partner_id[1] ? item.partner_id[1].toUpperCase() : ''.toUpperCase();
            const itemData = `${item.partner_id[1].toUpperCase()}   
            ${item.user_id[1].toUpperCase()} ${item.name.toUpperCase()} ${item.state.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            data: newData,
            search: text,
        });
    }
    ListViewItemSeparator = () => {
        //Item sparator view
        return (
            <View
                style={{
                    height: 0.3,
                    width: '90%',
                    backgroundColor: '#FFF',
                }}
            />
        );
    };

    render() {
        if (this.state.isLoading) {
            //Loading View while data is loading
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <CustomProgressBar />
                </View>
            );
        }

        try {
            if (this.state.data.length > 0) {

                return (


                    <View style={styles.container}>

                        <Header leftComponent={<FontAwesomeIcon name="long-arrow-alt-left" color='#fff' size={22}
                            onPress={() => this.backPress()} />}
                            centerComponent={{ text: 'Sales', style: { color: '#fff', fontSize: 20 } }}
                            // rightComponent={<FontAwesomeIcon name="sign-out-alt" color= '#fff' size={22}  onPress={() => this.props.navigation.navigate("Notification")} /> } 
                            navigation={this.props.navigation} pageRefresh={this.pageRefresh}
                            containerStyle={{
                                backgroundColor: '#0D50B8',

                            }} rightComponent={<FontAwesomeIcon name="filter" color='#fff' size={22}
                                onPress={() => this.popPress()} />} />
                        <SearchBar
                            lightTheme
                            onChangeText={text => this.SearchFilterFunction(text)}
                            onClear={text => this.SearchFilterFunction('')}
                            placeholder="Search"
                            placeholderTextColor={'#000'}
                            value={this.state.search}
                            color='black'
                            containerStyle={{ backgroundColor: 'white', borderRadius: 5 }}
                        />

<ScrollView horizontal={true}>


                        <View
                            style={{
                                flexDirection: 'column',

                            }}>


                              


                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            backgroundColor: 'black',
                                            borderWidth: 1
                                        }}>
                                        <View
                                            style={{
                                                width: 50,
                                                flexDirection: 'column',
                                                padding: 4,

                                            }}>

                                            <Text style={{ textAlign: 'left', fontWeight: 'bold', color: 'white' }}>Order</Text>
                                        </View>
                                        <View
                                            style={{
                                                width: 100,
                                                flexDirection: 'column',
                                                padding: 4,
                                            }}>

                                            <Text style={{ textAlign: 'left', fontWeight: 'bold', color: 'white' }}>Customer</Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'column',
                                                padding: 4,

                                            }}>
                                            <Text style={{ textAlign: 'left', fontWeight: 'bold', color: 'white' }}>Salesperson</Text>
                                        </View>
                                        <View
                                            style={{
                                                width: 50,
                                                flexDirection: 'column',
                                                padding: 4,

                                            }}>
                                            <Text style={{ textAlign: 'left', fontWeight: 'bold', color: 'white' }}>Total</Text>
                                        </View>

                                        <View
                                            style={{
                                                width: 100,
                                                flexDirection: 'column',
                                                padding: 4,

                                            }}>
                                            <Text style={{ textAlign: 'left', fontWeight: 'bold', color: 'white' }}>Status</Text>
                                        </View>

                                    </View>


                                    <FlatList
                                        data={this.state.data}
                                        keyExtractor={(x, i) => i}
                                        renderItem={({ item }) => (

                                            <TouchableOpacity onPress={() => this.goToQuotationDetailScreen(item.id)}>

                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        backgroundColor: 'white',
                                                    }}>
                                                    <View
                                                        style={{
                                                            width: 50,
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            backgroundColor: 'white',
                                                            justifyContent: 'center',
                                                            padding: 4,
                                                            borderBottomWidth: 1,
                                                            borderColor: 'gray',
                                                            flexWrap: 'wrap'
                                                        }}>
                                                        <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'gray' }}>{item.name}</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            width: 100,
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: 'white',
                                                            padding: 4,
                                                            borderBottomWidth: 1,
                                                            borderColor: 'gray',
                                                            flexWrap: 'wrap'
                                                        }}>

                                                        <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'gray' }}>{item.partner_id[1]}</Text>
                                                    </View>

                                                    <View
                                                        style={{
                                                            width: 100,
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: 'white',
                                                            padding: 4,
                                                            borderBottomWidth: 1,
                                                            borderColor: 'gray',
                                                            flexWrap: 'wrap'
                                                        }}>
                                                        <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'gray' }}>{item.user_id[1]}</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            width: 50,
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            backgroundColor: 'white',
                                                            justifyContent: 'center',
                                                            padding: 4,
                                                            borderBottomWidth: 1,
                                                            borderColor: 'gray',
                                                            flexWrap: 'wrap'
                                                        }}>
                                                        <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'gray' }}>{item.amount_total}</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            width: 100,
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: 'white',
                                                            padding: 4,
                                                            borderBottomWidth: 1,
                                                            borderColor: 'gray',
                                                            flexWrap: 'wrap'
                                                        }}>
                                                        <Text style={{ alignItems: 'center', justifyContent: 'center', color: 'gray' }}>{item.state.toUpperCase()}</Text>
                                                    </View>
                                                </View>

                                            </TouchableOpacity>
                                        )}
                                    />



                        </View>
                        </ScrollView>


                        {/* <FlatList
                            data={this.state.data}
                            keyExtractor={(x, i) => i}
                            renderItem={({ item }) => (

                                <TouchableOpacity onPress={() => this.goToQuotationDetailScreen(item.id)}>
                                    <Card>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                backgroundColor: 'white',
                                            }}>

                                            <View style={{
                                                flex: 5,
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                backgroundColor: 'white',
                                            }}>

                                                <View
                                                    style={{
                                                        flex: 4,
                                                        flexDirection: 'row',
                                                    }} >



                                                    <Text style={{ fontSize: 14, fontWeight: 'bold', flex: 3, flexShrink: 1, textAlign: 'left' }}>{item.partner_id[1]} </Text>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left', flexShrink: 1 }}>Total: {item.amount_total} </Text>
                                                        <FontAwesomeIcon name="rupee-sign" size={8} />
                                                    </View>

                                                </View>

                                                <View
                                                    style={{
                                                        flex: 4,
                                                        flexDirection: 'row',
                                                    }} >

                                                    <Text style={{ fontSize: 14, flex: 3, textAlign: 'left',flexShrink: 1 }}>{item.user_id[1]} </Text>

                                                    <Text style={{ fontSize: 14, textAlign: 'left',flexShrink: 1, marginRight:7 }}>{item.name} </Text>

                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    backgroundColor: '#ffc40c',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 25,
                                                    padding: 10,
                                                    marginLeft:5,
                                                    flex: 1,
                                                    width: 80
                                                }}>
                                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                                                    {item.state.toUpperCase()}
                                                </Text>
                                            </View> */}
                        {/* <View style={{
            flex: 2,
            flexDirection: 'row',
            backgroundColor: 'white',
            marginTop:5
        }}>

           
            <View style={styles.RectangleShapeView} >
            <Text style={{ fontSize: 14, textAlign: 'right', color:'green',textTransform: 'uppercase' }}>  {item.state} </Text>

</View>
        </View> */}

                        {/* </View>
                                    </Card>
                                </TouchableOpacity>

                            )}
                        /> */}

                        <View style={{ flex: 1 }}>
                            <Dialog
                                onDismiss={() => {
                                    this.setState({ scaleAnimationDialog: false });
                                }}
                                width={0.9}
                                visible={this.state.scaleAnimationDialog}
                                rounded
                                actionsBordered
                                dialogTitle={
                                    <DialogTitle
                                        title="Filter"
                                        style={{
                                            backgroundColor: '#F7F7F8',
                                            padding: 15,
                                            fontSize: 35,
                                        }}
                                        hasTitleBar={false}
                                        align="center"
                                    />
                                } footer={
                                    <DialogFooter>
                                        <DialogButton
                                            text="CANCEL"
                                            bordered
                                            onPress={() => {
                                                this.setState({ scaleAnimationDialog: false });
                                            }}
                                            key="button-1"
                                        />

                                    </DialogFooter>
                                }
                            >
                                <DialogContent
                                    style={{
                                        backgroundColor: '#F7F7F8',
                                    }}>
                                    <View style={styles.textAreaContainer} >
                                        <Text style={{ padding: 8 }} onPress={() => {
                                            this.addLog('yesterday')
                                        }}>
                                            Yesterday
                  </Text>
                                        <Text style={{ padding: 8 }} onPress={() => {
                                            this.addLog('today')
                                        }}>
                                            Today
                  </Text>


                                        <Text style={{ padding: 8 }} onPress={() => {
                                            this.addLog('This Week')
                                        }}>
                                            This Week
                  </Text>

                                        <Text style={{ padding: 8 }} onPress={() => {
                                            this.addLog('Last Week')
                                        }}>
                                            Last Week
                  </Text>

                                        <Text style={{ padding: 8 }} onPress={() => {
                                            this.addLog('This Month')
                                        }}>
                                            This Month
                  </Text>

                                        <Text style={{ padding: 8 }} onPress={() => {
                                            this.addLog('Last Month')
                                        }}>
                                            Last Month
                  </Text>

                                        <Text style={{ padding: 8 }} onPress={() => {
                                            this.addLog('all')
                                        }}>
                                            All
                  </Text>

                                    </View>
                                </DialogContent>
                            </Dialog>
                        </View>


                    </View>


                );
            } else {
                return (
                    <View style={styles.container}>
                        <Header centerComponent={{ text: 'Sales', style: { color: '#fff', fontSize: 20 } }}
                            leftComponent={<FontAwesomeIcon name="long-arrow-alt-left" color='#fff' size={22}
                                onPress={() => this.backPress()} />}
                            // rightComponent={<FontAwesomeIcon name="filter" color='#fff' size={22}
                            //   onPress={() => this.popPress()} />}
                            containerStyle={{
                                backgroundColor: '#0D50B8',
                                justifyContent: 'space-around',
                            }} rightComponent={<FontAwesomeIcon name="filter" color='#fff' size={22}
                                onPress={() => this.popPress()} />} />

                        <SearchBar
                            lightTheme
                            onChangeText={text => this.SearchFilterFunction(text)}
                            onClear={text => this.SearchFilterFunction('')}
                            placeholder="Search"
                            placeholderTextColor={'#000'}
                            value={this.state.search}
                            color='black'
                            containerStyle={{ backgroundColor: 'white', borderRadius: 5 }}
                        />


                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={styles.imageContainer}>
                                <Image
                                    resizeMode="contain"
                                    source={require('../../assets/sale.png')}
                                    style={styles.image}
                                />
                            </View>
                            <Text style={{ alignSelf: 'center', justifyContent: 'center', fontSize: 20, color: '#0D50B8' }}> No Sale</Text>

                        </View>


                        <View style={{ flex: 1 }}>
                            <Dialog
                                onDismiss={() => {
                                    this.setState({ scaleAnimationDialog: false });
                                }}
                                width={0.9}
                                visible={this.state.scaleAnimationDialog}
                                rounded
                                actionsBordered
                                dialogTitle={
                                    <DialogTitle
                                        title="Filter"
                                        style={{
                                            backgroundColor: '#F7F7F8',
                                            padding: 15,
                                            fontSize: 35,
                                        }}
                                        hasTitleBar={false}
                                        align="center"
                                    />
                                } footer={
                                    <DialogFooter>
                                        <DialogButton
                                            text="CANCEL"
                                            bordered
                                            onPress={() => {
                                                this.setState({ scaleAnimationDialog: false });
                                            }}
                                            key="button-1"
                                        />

                                    </DialogFooter>
                                }
                            >
                                <DialogContent
                                    style={{
                                        backgroundColor: '#F7F7F8',
                                    }}>
                                    <View style={styles.textAreaContainer} >
                                        <Text style={{ padding: 8 }} onPress={() => {
                                            this.addLog('yesterday')
                                        }}>
                                            Yesterday
                  </Text>
                                        <Text style={{ padding: 8 }} onPress={() => {
                                            this.addLog('today')
                                        }}>
                                            Today
                  </Text>


                                        <Text style={{ padding: 8 }} onPress={() => {
                                            this.addLog('This Week')
                                        }}>
                                            This Week
                  </Text>

                                        <Text style={{ padding: 8 }} onPress={() => {
                                            this.addLog('Last Week')
                                        }}>
                                            Last Week
                  </Text>

                                        <Text style={{ padding: 8 }} onPress={() => {
                                            this.addLog('This Month')
                                        }}>
                                            This Month
                  </Text>

                                        <Text style={{ padding: 8 }} onPress={() => {
                                            this.addLog('Last Month')
                                        }}>
                                            Last Month
                  </Text>

                                        <Text style={{ padding: 8 }} onPress={() => {
                                            this.addLog('all')
                                        }}>
                                            All
                  </Text>

                                    </View>
                                </DialogContent>
                            </Dialog>
                        </View>
                    </View>
                );
            }
        } catch{ }

    }


}

const CustomProgressBar = ({ visible }) => (
    <Modal onRequestClose={() => null} visible={visible}>
        <View style={{ flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
                <ActivityIndicator size="large" />
                <Text style={{ fontSize: 20, fontWeight: '200' }}>Loading</Text>
            </View>
        </View>
    </Modal>
);