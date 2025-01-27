import React, { useCallback, useEffect, useState } from 'react';
import {  StyleSheet, FlatList, Image, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { debounce } from 'lodash';
import { Text, TextInput, View } from './Themed';
import { getSearchGifs, getTrendingGifs, ResultType } from '@/api/fetchData';
import { useRouter } from 'expo-router';

type gifImageType = {
  id: string;
  images: {
    fixed_height: {
      url: string;
    }
  }
  title: string;
}
const DEFAULT_MAX_LIMIT = 25;
const SEARCH_MAX_LIMIT = 50;
const LOAD_LIMIT = 10
const INITIAL_GIF_LOAD_COUNT = 15;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function EditScreenInfo() {
  const [gifs, setGifs] = useState<ResultType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isloading, setIsloading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [apiLimitReached, setApiLimitReached] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const router = useRouter();

  const fetchGifs = async (limit: number, offset: number, query?: string, isRefreshing=false) => {
    try {
      if (!hasMoreData || apiLimitReached) return;

      isRefreshing ? setRefreshing(true) : setIsloading(true);
      const result = query
        ? await getSearchGifs(query, limit, offset)
        : await getTrendingGifs(limit, offset);
      
      // remove duplicates based on id
      const uniqueGifs = result.filter(
        (gif) => !gifs.some((existingGif) => existingGif.id === gif.id)
      );
      if ((gifs.length < DEFAULT_MAX_LIMIT && !searchText) || (searchText && gifs.length < SEARCH_MAX_LIMIT)) {
        setHasMoreData(true);
      } else {
        setHasMoreData(false);
      }

      setIsloading(false)
      setGifs((prev) => (offset === 0 ? uniqueGifs : [...prev, ...uniqueGifs]));

    } catch(error) {
      if (error?.response?.status === 429) {
        // console.log('API rate limit reached. Stopping further requests.');
        setApiLimitReached(true);
      } else {
        console.log('Error fetching gifs:', error);
      }
      if (error) {
        setGifs([]);
        setErrorMessage('Oops. Something went wrong. Please try again later.')
      }
    } finally {
      setIsloading(false);
      setRefreshing(false);
    }
    
  };

  useEffect(() => {
    setGifs([]);
    fetchGifs(INITIAL_GIF_LOAD_COUNT, 0);
    return () => {
      setGifs([])
      setErrorMessage('');
      setApiLimitReached(false);
    };
  },[])

  const renderItem = ({item, index}: { item : gifImageType, index: number}) => {
    const { url } = item.images.fixed_height;
    return (
      <Pressable style={{flexShrink: 1, gap: 5}} key={`${index}-${item.title}`} onPress={() => navigateToDetails(url, item.title, item.id)}>
        <Image source={{uri: url}} resizeMode="contain" style={{height: 180, width: 180}} />
        <View style={{width: 180 }}>
          <Text style={{fontSize: 15, flexWrap: 'wrap'}}>{item.title}</Text>
        </View>  
      </Pressable>
    )
  }

  const debouncedFetchGifs = useCallback(
    debounce((query: string) => {
      if (query) {
        fetchGifs(INITIAL_GIF_LOAD_COUNT, 0, query);
      }
    }, 1000),
    []
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
    debouncedFetchGifs(value);
  }

  const navigateToDetails = (url: string, title: string, id: string) => {
    router.push({pathname: '/details',  params: { url, title, id}});
  };

  const handleRefresh = useCallback(() => {
    setGifs([]);
    fetchGifs(INITIAL_GIF_LOAD_COUNT, 0, searchText, true);
  }, [searchText]);

  return ( 
      <View style={styles.getStartedContainer}>
        <View style={styles.searchContainer}>
          <TextInput
              placeholder='Search your GIFs here'
              onChangeText={handleSearch}
              value={searchText}
              style={styles.textInput}
            />
        </View>
        {isloading && 
          <ActivityIndicator style={styles.loading} size={"small"}/>
        }
        {errorMessage &&
          <View style={styles.errorMessage}>
            <Text style={{textAlign: 'center'}}>{errorMessage}</Text>
          </View>  
        }
        <FlatList
          data={gifs}
          numColumns={2}
          renderItem={renderItem}
          contentContainerStyle={{flexGrow: 1}}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (!isloading && hasMoreData && !apiLimitReached) {
              if (searchText) {
                fetchGifs(LOAD_LIMIT, gifs.length+1, searchText)
              } else {
                fetchGifs(LOAD_LIMIT, LOAD_LIMIT);
              }
              
            }
          }}
          ListFooterComponent={() => <View style={{paddingBottom: 30, marginBottom: 10}}/>}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          />
      </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    marginHorizontal: 10,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  errorMessage: {
    flexGrow: 1, 
    justifyContent: 'center'
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  loading: {
    flexGrow: 1, 
    alignSelf: 'center'
  },
  searchContainer: {
    width: SCREEN_WIDTH - 50, 
    height: 40, 
    borderRadius: 10, 
    padding: 5, 
    borderWidth: 1, 
    borderColor: 'lightgrey', 
    marginBottom: 20
  },
  textInput: {
    width: '100%', 
    color: 'black', 
    height: 40
  }
});
