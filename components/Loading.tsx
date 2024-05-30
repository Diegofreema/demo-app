import { Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { ShoppingCartIcon } from 'lucide-react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useCart } from '@/hooks/zustand/useCart';
import { useMemo } from 'react';
import { Link } from 'expo-router';

type Props = {};

export const Loading = ({}: Props): JSX.Element => {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <ActivityIndicator color="green" size={50} />
    </ThemedView>
  );
};

export const ErrorComponent = ({ retry }: { retry: () => void }) => {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <ThemedText>Something went wrong</ThemedText>
      <Button
        mode="contained"
        onPress={retry}
        buttonColor="green"
        textColor="white"
      >
        Retry
      </Button>
    </ThemedView>
  );
};

export const FloatingCartBtn = () => {
  const { items: products } = useCart();
  const reducedItemInCart = useMemo(() => products.length, [products]);
  console.log(reducedItemInCart);

  return (
    <Link href="/cart" asChild>
      <Pressable style={styles.abs}>
        <FontAwesome name="cart-plus" size={25} color={'white'} />
        <View
          style={{
            backgroundColor: 'white',
            width: 20,
            height: 20,
            position: 'absolute',
            top: -5,
            right: -2,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
        >
          <Text style={{ color: 'green', fontWeight: 'bold' }}>
            {reducedItemInCart}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};
const styles = StyleSheet.create({
  abs: {},
});
