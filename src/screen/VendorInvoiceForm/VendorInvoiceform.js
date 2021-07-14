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
    Button,
    BackHandler
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

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class VendorInvoiceFormScreen extends Component {
    constructor(props) {
        super(props)
        this.state = { isLoading: true };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    state = {
        opp_form_details: {},
        data: []
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        this.props.navigation.navigate('VendorInvoice');
        return true;
    }


    componentDidMount() {
        console.log('read--------------calling------------api---')

        const { state } = this.props.navigation;
        this.setState.opp_Params = state.params.opprtunityFormDetail;
        console.log('idddddddd', this.setState.opp_Params.opp_id)


        this.searchReadfunction(this.setState.opp_Params.opp_id);
    }


    backPress() {
        this.props.navigation.navigate('VendorInvoice');
    }


    orderview(id, order_line) {

        console.log('idddddddd', id);
        console.log('order_lineeeeeee', order_line);

        this.props.navigation.navigate('VendorInvoiceOrderdetail', { 'opprtunityFormDetail': { opp_id: id, orderline: order_line } });


    }



    searchReadfunction(id) {
        console.log('read--------------calling------------api---' + id)


        const params = {
            domain: [["id", "=", id]],
            fields: ['origin', 'reference', 'display_name', 'amount_tax', 'amount_untaxed', 'amount_total', 'cash_rounding_id', 'phase_id', 'project_id', 'partner_id', 'payment_term_id', 'reference_po', 'partner_date_po', 'origin', 'date_invoice', 'date_due', 'user_id', 'team_id', 'vehicle_no', 'currency_id', 'invoice_line_ids'],
            order: '',
            limit: '',
            offset: '',
        }

        return connect.searchRead('account.invoice', params)
            .then(response => {
                console.log(response)
                if (response.success) {
                    this.setState({
                        isLoading: false,
                        data: response.data,
                    });

                }
            },
            )
            .catch(err => console.log(err))
    }

    from_date(from_date) {
        var to_Date = moment(from_date).format();
        var to_Data_con = new Date(new Date(to_Date));
        to_Data_con.setHours(to_Data_con.getHours() + 5);
        to_Data_con.setMinutes(to_Data_con.getMinutes() + 30);
        var con_date = moment(to_Data_con).format('D-MM-YYYY')
        return con_date;
    }


    render() {
        if (this.state.isLoading) {
            //Loading View while data is loading
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <CustomProgressBar />
                </View>
            );
        }

        return (


            <View style={styles.container}>

                <Header leftComponent={<FontAwesomeIcon name="long-arrow-alt-left" color='#fff' size={22}
                    onPress={() => this.backPress()} />}
                    centerComponent={{ text: 'Vendor Invoice', style: { color: '#fff', fontSize: 20 } }}
                    // rightComponent={<FontAwesomeIcon name="sign-out-alt" color= '#fff' size={22}  onPress={() => this.props.navigation.navigate("Notification")} /> } 
                    navigation={this.props.navigation} pageRefresh={this.pageRefresh}
                    containerStyle={{
                        backgroundColor: '#0D50B8',

                    }} />

                <FlatList
                    data={this.state.data}
                    keyExtractor={(x, i) => i}
                    renderItem={({ item }) => (

                        <Card style={{ borderRadius: 20 }}>

                            <View>

                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: 14, color: 'gray', textAlign: 'left' }}>Vendor </Text>

                                    <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left', marginTop: 10 }}>{item.partner_id[1]} </Text>

                                </View>
                                <View style={styles.textInputBottomLine} />

                                <View style={{ flexDirection: 'column' }}>

                                    <Text style={{ fontSize: 14, color: 'gray', textAlign: 'left' }}>Bill: </Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left', marginTop: 10 }}>{item.display_name} </Text>

                                </View>

                                <View style={styles.textInputBottomLine} />


                                <View style={{ flexDirection: 'column' }}>

                                    <Text style={{ fontSize: 14, color: 'gray', textAlign: 'left' }}>Vendor Reference: </Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left', marginTop: 10 }}>{item.reference} </Text>

                                </View>
                                <View style={styles.textInputBottomLine} />


                                <View style={{ flexDirection: 'column' }}>

                                    <Text style={{ fontSize: 14, color: 'gray', textAlign: 'left' }}>Source Document: </Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left', marginTop: 10 }}>{item.origin} </Text>

                                </View>
                                <View style={styles.textInputBottomLine} />


                                <View style={{ flexDirection: 'column' }}>

                                    <Text style={{ fontSize: 14, color: 'gray', textAlign: 'left' }}>Bill Date: </Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left', marginTop: 10 }}>{this.from_date(item.date_invoice)} </Text>

                                </View>
                                <View style={styles.textInputBottomLine} />

                                <View style={{ flexDirection: 'column' }}>

                                    <Text style={{ fontSize: 14, color: 'gray', textAlign: 'left' }}>Due Date: </Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left', marginTop: 10 }}>{this.from_date(item.date_due)} </Text>

                                </View>
                                <View style={styles.textInputBottomLine} />

                                {/* <View style={{ flexDirection: 'row', margin: 8 }}>

                            <Text style={{ fontSize: 14, flex: 5, color: 'gray', textAlign: 'left' }}>  Salesperson: </Text>
                            <Text style={{ fontSize: 14, flex: 5, textAlign: 'left' }}>  {item.user_id[1]} </Text>

                        </View>

                        <View style={{ flexDirection: 'row', margin: 8 }}>

<Text style={{ fontSize: 14, flex: 5, color: 'gray', textAlign: 'left' }}>  Project: </Text>
<Text style={{ fontSize: 14, flex: 5, textAlign: 'left' }}>  {item.project_id[1]} </Text>

</View> */}


                                {/* <View style={{ flexDirection: 'row', margin: 8 }}>

<Text style={{ fontSize: 14, flex: 5, color: 'gray', textAlign: 'left' }}>  Phase: </Text>
<Text style={{ fontSize: 14, flex: 5, textAlign: 'left' }}>  {item.phase_id[1]} </Text>

</View>


                        <View style={{ flexDirection: 'row', margin: 8 }}>

                            <Text style={{ fontSize: 14, flex: 5, color: 'gray', textAlign: 'left' }}>  Sales Team: </Text>
                            <Text style={{ fontSize: 14, flex: 5, textAlign: 'left' }}>  {item.team_id[1]} </Text>

                        </View> */}


                                <View style={{ flexDirection: 'column' }}>

                                    <Text style={{ fontSize: 14, color: 'gray', textAlign: 'left' }}>Currency: </Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left', marginTop: 10 }}>{item.currency_id[1]}
                                    </Text>

                                </View>

                                <View style={styles.textInputBottomLine} />

                                <View style={{ flexDirection: 'column' }}>

                                    <Text style={{ fontSize: 14, textAlign: 'left', color: 'gray' }}>Untaxed Amount </Text>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

                                        <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left' }}>{item.amount_untaxed} </Text>
                                        <FontAwesomeIcon name="rupee-sign" size={10} />

                                    </View>
                                </View>
                                <View style={styles.textInputBottomLine} />

                                <View style={{ flexDirection: 'column' }}>

                                    <Text style={{ fontSize: 14, textAlign: 'left', color: 'gray' }}>Taxes </Text>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

                                        <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left' }}>{item.amount_tax} </Text>
                                        <FontAwesomeIcon name="rupee-sign" size={10} />

                                    </View>
                                </View>
                                <View style={styles.textInputBottomLine} />

                                <View style={{ flexDirection: 'column' }}>


                                    <Text style={{ fontSize: 14, textAlign: 'left', color: 'gray' }}>Total Amount </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

                                        <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left' }}>{item.amount_total} </Text>
                                        <FontAwesomeIcon name="rupee-sign" size={10} />

                                    </View>
                                </View>
                                <View style={styles.textInputBottomLine} />

                                <View style={[{ width: 200, marginLeft: 50, marginTop: 10, alignItems: 'center', justifyContent: 'center' }]}>
                                    <Button
                                        onPress={() => this.orderview(item.id, item.invoice_line_ids)}
                                        title="VIEW FOR ORDER DETAILS"
                                        color="#0D50B8"
                                    />
                                </View>

                            </View>

                        </Card>
                    )}
                />


            </View>


        );
    }


}

const CustomProgressBar = ({ visible }) => (
    <Modal onRequestClose={() => null} visible={visible}>
        <View style={{ flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
                <Text style={{ fontSize: 20, fontWeight: '200' }}>Loading</Text>
                <ActivityIndicator size="large" />
            </View>
        </View>
    </Modal>
);