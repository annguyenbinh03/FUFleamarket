import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";

const images = [
  "https://th.bing.com/th/id/OIP.HdQTzkVKUZbGYoL3wWp6FgHaD4?w=284&h=180&c=7&r=0&o=5&pid=1.7",
  "https://s.isanook.com/ga/0/rp/r/w728/ya0xa0m1w0/aHR0cHM6Ly9zLmlzYW5vb2suY29tL2dhLzAvdWQvMjI2LzExMzAzMjEvYWxpY2UuanBn.jpg",
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Thay đổi hình ảnh mỗi 3 giây (3000ms)

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ width: "100%", height: 200 }}>
      <Image
        source={{ uri: images[currentIndex] }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </View>
  );
};

export default Carousel;
