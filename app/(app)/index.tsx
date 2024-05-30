import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';
import { useProducts } from '@/hooks/tanstack/queries';
import { ErrorComponent, FloatingCartBtn, Loading } from '@/components/Loading';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Button, Card, Text } from 'react-native-paper';
import { ProductType } from '@/type';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useAuth } from '@/hooks/zustand/useAuth';
import registerNNPushToken from 'native-notify';

type Props = {};

const Home = (props: Props) => {
  registerNNPushToken(21568, 'FvrVNFvFuzAotOM6CmeXfz');
  const { data, isPending, isError, isPaused, refetch } = useProducts();

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
          contentFit="cover"
          style={{ height: '100%', width: '100%' }}
          placeholder={require('../../assets/images/loading.gif')}
        />
      }
      headerBackgroundColor={{ dark: 'black', light: 'white' }}
    >
      <FlatList
        scrollEnabled={false}
        data={data}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item?.id.toString()}
        contentContainerStyle={{ gap: 15 }}
        ListEmptyComponent={() => <Text>No product found</Text>}
      />
    </ParallaxScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({});

const ProductCard = ({ product }: { product: ProductType }) => {
  return (
    <Card>
      <Card.Title title={product?.title} subtitle={product?.category} />
      <Card.Content style={{ marginBottom: 5 }}>
        <Text variant="titleLarge">₦{product?.price}</Text>
        {/* <Text variant="bodyMedium">Card content</Text> */}
      </Card.Content>
      <Image
        source={{ uri: product?.image }}
        style={{ width: '100%', height: 300 }}
        contentFit="cover"
        placeholder={require('../../assets/images/loading.gif')}
      />
      <Card.Actions>
        <Link href={`/${product?.id}`} asChild>
          <Button>View Details</Button>
        </Link>
      </Card.Actions>
    </Card>
  );
};
