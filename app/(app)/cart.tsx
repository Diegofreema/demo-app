import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { CartItem, useCart } from '@/hooks/zustand/useCart';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Image } from 'expo-image';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/hooks/zustand/useAuth';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import axios from 'axios';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
type Props = {};

const cart = (props: Props) => {
  const { items } = useCart();

  return (
    <ParallaxScrollView
      headerImage={
        <Image
          source={require('../../assets/images/banner.png')}
          contentFit="cover"
          style={{ height: '100%', width: '100%' }}
          placeholder={require('../../assets/images/loading.gif')}
        />
      }
      headerBackgroundColor={{ dark: 'black', light: 'white' }}
    >
      <FlatList
        scrollEnabled={false}
        data={items}
        renderItem={({ item }) => <Summary item={item} />}
        keyExtractor={(item) => item.product.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 15 }}
        ListEmptyComponent={EmptyCart}
        ListFooterComponent={Footer}
      />
    </ParallaxScrollView>
  );
};

export default cart;

const styles = StyleSheet.create({});

const Summary = ({ item }: { item: CartItem }) => {
  const { addQuantity, removeQuantity } = useCart();
  return (
    <ThemedView style={{ flexDirection: 'row', gap: 10 }}>
      <Image
        source={{ uri: item?.product?.image }}
        style={{ width: 100, height: 100 }}
        contentFit="cover"
        placeholder={require('../../assets/images/loading.gif')}
      />
      <ThemedView>
        <ThemedView style={{ marginBottom: 10 }}>
          <ThemedText
            numberOfLines={1}
            style={{ width: '80%', flexWrap: 'wrap', flexDirection: 'row' }}
          >
            {item.product?.title}
          </ThemedText>
          <ThemedText>Quantity: {item.quantity}</ThemedText>
        </ThemedView>
        <ThemedView style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            onPress={() => removeQuantity(item.product.id)}
            style={({ pressed }) => ({
              backgroundColor: 'red',
              padding: 5,
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <FontAwesome name="minus" color="white" />
          </Pressable>
          <Pressable
            onPress={() => addQuantity(item.product.id)}
            style={({ pressed }) => ({
              backgroundColor: 'green',
              padding: 5,
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <FontAwesome name="plus" color="white" />
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const EmptyCart = () => {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <ThemedText
        style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}
      >
        No products in cart
      </ThemedText>
      <Button
        onPress={() => router.push('/')}
        mode="contained"
        buttonColor="green"
        textColor="white"
      >
        Continue shopping
      </Button>
    </ThemedView>
  );
};

const Footer = () => {
  const { isLoggedIn, setPath, path } = useAuth();
  const { items } = useCart();
  const arrayLength = items?.length;

  const onPress = async () => {
    if (!isLoggedIn) {
      setPath('/cart');
      router.push('/auth');
    }
    if (isLoggedIn) {
      await axios.post('https://app.nativenotify.com/api/indie/notification', {
        subID: '1',
        appId: 21568,
        appToken: 'FvrVNFvFuzAotOM6CmeXfz',
        title: 'Successfully placed an order',
        message: 'Your order has been received. Thank you!',
      });
    }
  };

  return arrayLength > 0 ? (
    <Button buttonColor="green" textColor="white" onPress={onPress}>
      Checkout
    </Button>
  ) : (
    <View />
  );
};

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Success',
      body: 'Order has been received. Thank you!',
    },
    trigger: { seconds: 5 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
