import { AppRegistry } from 'react-native';
import RealApp from './app/app'
import {Component} from "react";


class App extends Component<{}> {
    render() {
        return (
            <RealApp/>
        );
    }
}

AppRegistry.registerComponent('RNToastModule', () => App);
