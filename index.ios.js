/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Alert, DeviceEventEmitter
} from 'react-native';

import {NativeModules} from 'react-native'

export default class NativeCalendarModule extends Component<{}> {

    componentWillMount() {
        DeviceEventEmitter.addListener('emittingEvent01', this.onEmittingEvents);
    }

    render() {

        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to React Native!

                </Text>
                <Text style={styles.instructions}>
                    To get started, edit index.ios.js
                </Text>
                <Text style={styles.instructions}>
                    Press Cmd+R to reload,{'\n'}
                    Cmd+D or shake for dev menu
                </Text>
                <Text style={styles.txtBtn} onPress={() => this.addEventToCalendar()}>
                    addEventToCalendar
                </Text>
                <Text style={styles.txtBtn} onPress={() => this.addEventWithDate()}>
                    addEventWithDate
                </Text>
                <Text style={styles.txtBtn} onPress={() => this.addEventWithCallback()}>
                    addEventWithDate
                </Text>
                <Text style={styles.txtBtn} onPress={() => this.addEventWithPromise()}>
                    addEventWithPromise
                </Text>
                <Text style={styles.txtBtn} onPress={() => this.sendNotification()}>
                    addEventWithPromise
                </Text>
            </View>
        );
    }

    addEventToCalendar() {
        NativeModules.CalendarManager.addEventMoreDetails('Birthday Party', {
            location: '4 Privet Drive, Surrey',
            description: 'New Event From RN',
            time: new Date()
        });
    }

    addEventWithDate() {
        NativeModules.CalendarManager.addEventMoreDate('Birthday Party', "location", new Date());
    }

    addEventWithDate() {
        NativeModules.CalendarManager.addEventMoreDate('Birthday Party', "location", new Date());
    }

    addEventWithCallback() {
        NativeModules.CalendarManager.addEventWithCallback('Birthday Party', "location", new Date(), this.eventCallback);
    }

    async addEventWithPromise() {
        var ret = await NativeModules.CalendarManager.addEventWithCallback('Birthday Party', "location", new Date());
        Alert.alert("title:", "message:" + ret, [
                {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false});
    }

    doSomethingExpensive() {
        NativeModules.CalendarManager.doSomethingExpensive("params", this.expensiveCallback);
    }

    expensiveCallback(code, msg) {

    }

    eventCallback(error, map) {
        Alert.alert("title:" + error, "message:" + map, [
                {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false});
    }

    sendNotification() {
        NativeModules.CalendarManager.sendNotification("name123");
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
    txtBtn: {
        textAlign: 'center',
        color: '#333333',
        marginTop: 15,
    },
});

AppRegistry.registerComponent('RNToastModule', () => NativeCalendarModule);