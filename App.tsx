import * as React from 'react';
import {
  StatusBar,
  FlatList,
  Image,
  Text,
  View,
  Dimensions,
  StyleSheet,
  Pressable,
} from 'react-native';
import { API_KEY as apiKey } from './config';
import { MotiView } from 'moti';
import { imagesData } from './data';
import type { IImages } from './data';

const IMAGE_SIZE = 80;
const SPACING = 10;
const { width, height } = Dimensions.get('screen');

// const API_KEY = apiKey;
// const API_URL =
//   'https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=20';

const fetchImageFromPexels = async () => {
  // const data = await fetch(API_URL, {
  //   headers: {
  //     Authorization: API_KEY,
  //   },
  // });

  // const { photos } = await data.json();
  const photos = imagesData;
  return photos;
};

export default () => {
  const [images, setImages] = React.useState(null);
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const topRef = React.useRef(null);
  const thumbRef = React.useRef(null);

  React.useEffect(() => {
    const fetchImages = async () => {
      const images = await fetchImageFromPexels();
      setImages(images);
    };
    fetchImages();
  }, []);

  const scrollToActiveIndex = (index: number) => {
    setActiveIndex(index);
    // scroll flatlists
    topRef?.current.scrollToOffset({
      offset: index * width,
      animated: true,
    });

    thumbRef?.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5, // percentage from the viewport stating from left handside
    });

    // if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
    //   thumbRef?.current?.scrollToOffset({
    //     offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
    //     animated: true,
    //   });
    // } else {
    //   thumbRef?.current?.scrollToOffset({
    //     offset: 0,
    //     animated: true,
    //   });
    // }
  };

  if (!images) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar translucent backgroundColor="#00000077" />
      <FlatList
        ref={topRef}
        data={images}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          console.log(e?.nativeEvent?.contentOffset.x);
          console.log(width);
          scrollToActiveIndex(
            Math.floor(e.nativeEvent.contentOffset.x / width),
          );
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image
                source={{ uri: item.src.portrait }}
                style={StyleSheet.absoluteFillObject}
              />
            </View>
          );
        }}
      />
      <FlatList
        ref={thumbRef}
        data={images}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        style={{
          position: 'absolute',
          bottom: IMAGE_SIZE / 2,
        }}
        renderItem={({ item, index }) => {
          return (
            <Pressable onPress={() => scrollToActiveIndex(index)}>
              <MotiView
                from={{
                  opacity: 0.5,
                }}
                animate={{
                  opacity: 1,
                  borderColor: activeIndex === index ? 'white' : 'transparent',
                }}
                style={{
                  borderRadius: 12,
                  marginRight: SPACING,
                  borderWidth: 2,
                }}
              >
                <Image
                  source={{ uri: item.src.portrait }}
                  resizeMode="cover"
                  style={{
                    width: IMAGE_SIZE,
                    height: IMAGE_SIZE,
                    borderRadius: 12,
                    // marginRight: SPACING,
                    // borderWidth: 2,
                    // borderColor:
                    //   activeIndex === index ? 'white' : 'transparent',
                  }}
                />
              </MotiView>
            </Pressable>
          );
        }}
      />
    </View>
  );
};
