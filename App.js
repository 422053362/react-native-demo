/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Alert,
    DeviceEventEmitter,
    NativeEventEmitter,
    ActivityIndicator
} from 'react-native';

import {NativeModules} from 'react-native'

const myEventEmitter = new NativeEventEmitter(NativeModules.RNToastModule);

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
    constructor(props) {
        super(props)
        this.state = {
            animating: false
        }
    }

    componentWillMount() {
        myEventEmitter.addListener('emittingEvent01', this.onEmittingEvents.bind(this));
        //NativeEventEmitter.addListener('emittingEvent01', this.onEmittingEvents);
    }

    componentWillUnmount(){
        myEventEmitter.remove();
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textBtn}
                      onPress={() => NativeModules.RNToastModule.showWithCallback("callback测试Toast", 3000, this.onDismissCallback)}>
                    android RN 调用原生组建callback
                </Text>
                <Text style={styles.textBtn}
                      onPress={() => this.onDismissPromise()}>
                    android RN 调用原生组建promise
                </Text>
                <Text style={styles.textBtn}
                      onPress={() => NativeModules.RNToastModule.sendEmittingEvents('s1', 1000)}>
                    android RN => JS 发送事件
                </Text>
                <Text style={styles.textBtn}
                      onPress={() => this.newUIView()}>
                    android RN => 开启一个新的Activity，并且获取返回结果
                </Text>
                <ActivityIndicator
                    animating={this.state.animating}
                    style={[styles.centering, {height: 80}]}
                    size="large"
                />
            </View>
        );
    }

    onDismissCallback(callbackMsg1, callbackMsg2) {
        Alert.alert(
            'onDismissCallback:title:' + callbackMsg1,
            'onDismissCallback:content:' + callbackMsg2,
            [
                {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false}
        )
    }

    async onDismissPromise() {
        try {
            var {promiseMsg01, promiseMsg02, width, height} = await NativeModules.RNToastModule.showWithPromise(
                "promise.resolve测试Toast", 1000
            );
            Alert.alert(
                'onDismissPromise:title:' + promiseMsg01,
                'onDismissPromise:content:' + promiseMsg02,
                [
                    {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => this.triggerExceptionWithPromise()},
                ],
                {cancelable: false}
            )

        } catch (e) {
            console.info(e);
        }
    }

    async triggerExceptionWithPromise() {
        try {
            var {promiseMsg01, promiseMsg02, width, height} = await NativeModules.RNToastModule.showWithPromise(
                "promise.reject测试Toast", 3000
            );
        } catch (e) {
            Alert.alert(
                'onDismissPromise:rejectCode:' + e.code,
                'onDismissPromise:content:' + e,
                [
                    {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false}
            )
        }
    }

    onEmittingEvents(e: Event) {
        console.info(e);
        Alert.alert(
            'onEmittingEvents:rejectCode:' + e.code,
            'onEmittingEvents:content:' + e,
            [
                {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false}
        )
    }

    newUIView() {
        try {
             NativeModules.RNToastModule.newUIView((code) => {
                Alert.alert(
                    'onEmittingEvents:rejectCode:' + code.activity,
                    'onEmittingEvents:content:' + code,
                    [
                        {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false}
                )
                this.setState({animating: true});
            }, (code,msg) => {
                Alert.alert(
                    'onEmittingEvents:rejectCode:' + code,
                    'onEmittingEvents:content:' + msg,
                    [
                        {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false}
                )
                this.setState({animating: true});
            });

        } catch (e) {
            console.info(e);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    textBtn: {
        marginTop: 20,
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    btn: {
        marginTop: 10,
        width: 150,
        height: 35,
        backgroundColor: '#3BC1FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
});
