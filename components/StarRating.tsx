import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const StarRating = ({ rating, onChange }) => {
  const handlePress = (value) => {
    onChange(value);
  };

  return (
    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => handlePress(star)}>
          <Text style={{ fontSize: 20, color: star <= rating ? 'gold' : 'gray' }}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StarRating;
