import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props { }

const Settings: React.FC<Props> = () => {
    return (
        <SafeAreaView>
            <Text>Settings</Text>
        </SafeAreaView>
    );
};

export default Settings;
