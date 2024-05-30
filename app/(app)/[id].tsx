import React, { useMemo } from 'react';
import { useSingle } from '@/hooks/tanstack/queries';
import { router, useLocalSearchParams } from 'expo-router';
import { ErrorComponent, FloatingCartBtn, Loading } from '@/components/Loading';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Image } from 'expo-image';
import { Button, Card, Divider, Text } from 'react-native-paper';
import { ProductType } from '@/type';
import { View } from 'react-native';
import { useCart } from '@/hooks/zustand/useCart';

type Props = {};

const ProductDetails = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items: products } = useCart();
  const reducedItemInCart = useMemo(() => products.length, [products]);
  const { data, isPending, isError, isPaused, refetch } = useSingle(id);
  if (isError || isPaused) {
    return <ErrorComponent retry={refetch} />;
  }

  if (isPending) return <Loading />;

  console.log(data);

  return (
    <ParallaxScrollView
      headerImage={
        <Image
          source={require('../../assets/images/banner.png')}
          placeholder={require('../../assets/images/loading.gif')}
          contentFit="cover"
          style={{ height: '100%', width: '100%' }}
        />
      }
      headerBackgroundColor={{ dark: 'black', light: 'white' }}
    >
      <View style={{ flex: 1 }}>
        <ProductCard product={data} />
        <Button
          onPress={() => router.push('/cart')}
          rippleColor={'#3cb043'}
          textColor="white"
          style={{
            marginTop: 20,
            borderRadius: 3,
            marginHorizontal: 20,
          }}
          contentStyle={{
            backgroundColor: 'green',
            width: '100%',
          }}
          labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
        >
          Go to cart {reducedItemInCart}
        </Button>
      </View>
    </ParallaxScrollView>
  );
};

export default ProductDetails;

const ProductCard = ({ product }: { product: ProductType }) => {
  const { addProduct, removeProduct, items } = useCart();

  const isInCart =
    items.findIndex((item) => item.product.id === product?.id) !== -1;
  return (
    <Card>
      <Card.Title title={product?.title} subtitle={product?.category} />
      <Image
        source={{ uri: product?.image }}
        style={{ width: '100%', height: 300, marginBottom: 5 }}
        contentFit="cover"
        placeholder={require('../../assets/images/loading.gif')}
      />
      <Card.Content style={{ marginBottom: 5, gap: 3 }}>
        <Text variant="titleLarge">₦{product?.price}</Text>
        <Text variant="bodyMedium">
          {product?.description.charAt(0).toUpperCase() +
            product?.description.slice(1)}
        </Text>
        <Divider />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="bodySmall">{product?.rating?.rate} Stars</Text>
          <Text variant="bodySmall">{product?.rating?.count} left</Text>
        </View>
      </Card.Content>

      <Card.Actions>
        <Button disabled={!isInCart} onPress={() => removeProduct(product?.id)}>
          Remove
        </Button>
        <Button
          disabled={isInCart}
          onPress={() =>
            addProduct({
              category: product?.category,
              price: product?.price,
              image: product?.image,
              id: product?.id,
              title: product?.title,
            })
          }
        >
          Add
        </Button>
      </Card.Actions>
    </Card>
  );
};
