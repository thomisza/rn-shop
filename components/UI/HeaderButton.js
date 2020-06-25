import React from 'react';
import { Platform } from 'react-native';
import Colors from '../../constants/Colors';
import { HeaderButton } from 'react-navigation-header-buttons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomHeaderButton = (props) => {
    return(
        <HeaderButton {...props} 
            IconComponent={Ionicons} 
            iconSize={23} 
            color={Platform.OS==='android' ? 'white': Colors.primaryColor}
        />
    );
}


export default CustomHeaderButton;