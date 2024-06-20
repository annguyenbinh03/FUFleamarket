import React, { useState, useEffect, useRef } from "react";
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

const images = [
  "https://th.bing.com/th/id/OIP.HdQTzkVKUZbGYoL3wWp6FgHaD4?w=284&h=180&c=7&r=0&o=5&pid=1.7",
  "https://s.isanook.com/ga/0/rp/r/w728/ya0xa0m1w0/aHR0cHM6Ly9zLmlzYW5vb2suY29tL2dhLzAvdWQvMjI2LzExMzAzMjEvYWxpY2UuanBn.jpg",
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Thay đổi hình ảnh mỗi 3 giây (3000ms)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
      });
    }
  }, [currentIndex]);

  const onImagePress = (index) => {
    alert(`Sự kiện ${index + 1} chưa bắt đầu`);
  };

  return (
    <View style={{ width: "100%", height: 200 }}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => onImagePress(index)}>
            <Image
              source={{ uri: item }}
              style={{ width, height: 200 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Carousel;
