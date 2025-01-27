import React, { useEffect, useState } from 'react';
import { Button, Dimensions, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { View, Text, TextInput } from "@/components/Themed"
import { useLocalSearchParams } from 'expo-router';
import StarRating from '@/components/StarRating';
import { getData, storeData } from './utils/utils';

const SCREEN_WIDTH = Dimensions.get('window').width;

type DetailsType = {
    comment: string;
    starRating: string;
}

const Details = () => {
    const { url, title, id } = useLocalSearchParams();
    const [message, setMessage] = useState('');

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
          comment: '',
          starRating: '',
        }
    });

    useEffect(() => {
        const fetchStoredData = async () => {
            try {
                const comment = await getData(`${id}-comment`) as string;
                console.log('comment :', comment);
                const ratings = await getData(`${id}-ratings`) as string;
                console.log('ratings :', ratings);
                if (comment) {
                    // update the comment
                  setValue('comment', comment);
                }
                if (ratings) {
                    // update the star ratingg
                    setValue('starRating', ratings);
                }
            } catch(e) {

            }
        }
        setMessage('');
        fetchStoredData()
    }, [])
    
      const onSubmit = (data :DetailsType ) => {
        console.log('data :', data);
        console.log('id :', id);
        storeData(`${id}-comment`, data.comment);
        storeData(`${id}-ratings`, data.starRating)
        setMessage('Your preference is saved successfully');
      };

    return (
         <View style={{flex: 1, gap: 5}}>
            <Image source={{uri: url as string }} resizeMode='contain' style={{aspectRatio: 1}} />
            <View style={{width: SCREEN_WIDTH}}>
                <Text style={{fontSize: 18, flexWrap: 'wrap', textAlign: 'center'}}>{title}</Text>
            </View>
            <View style={{paddingHorizontal: 10}}>
                <Controller
                    control={control}
                    rules={{
                    minLength: {
                        value: 5,
                        message: 'Comment must be at least 5 characters long'
                    }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder="Enter your comment"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={{width: '100%', height: 50}}
                        />
                        )}
                        name="comment"
                />
                {errors.comment && <Text>{errors.comment.message}</Text>}
                <Controller
                    control={control}
                    rules={{
                    required: 'Star rating is required',
                    }}
                    render={({ field: { onChange, value } }) => (
                    <StarRating
                        rating={parseInt(value)}
                        onChange={onChange}
                    />
                    )}
                    name="starRating"
                />
                {errors.starRating && <Text>{errors.starRating.message}</Text>}
                <Button title="Submit" onPress={handleSubmit(onSubmit)} /> 
                {message && 
                    <View style={{flexGrow:1, width: '100%', height: 50, borderRadius: 10, borderWidth: 1, borderColor: 'lightgrey', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 14, color: 'darkgreen'}}>{message}</Text>
                    </View>    
                }
                
            </View> 
        </View>
    )
}

export default Details;