import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

type Props = {};

const AppLayout = (props: Props) => {
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AppLayout;
