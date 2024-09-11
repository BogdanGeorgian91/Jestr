import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import {API_URL} from './config';
import Toast from 'react-native-toast-message';
import {FetchMemesResult} from '../types/types';
import * as FileSystem from 'expo-file-system';
import {getToken} from '../stores/secureStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from 'lodash';

const COOLDOWN_PERIOD = 5000; // 5 seconds in milliseconds
const CACHE_KEY_PREFIX = 'memes_cache_';
const LOCK_KEY = 'fetch_memes_lock';

let isLocked = false;
let requestQueue: (() => void)[] = [];

type TransformedMemeView = {
  email: string;
  memeIDs: string[];
  ttl: number;
};


export const recordMemeViews = async (memeViews: {email: string; memeID: string}[]): Promise<void> => {
  // Log the incoming data to ensure it's correct
  console.log('Received meme views:', JSON.stringify(memeViews));

  if (!Array.isArray(memeViews) || memeViews.length === 0) {
    console.error('memeViews must be a non-empty array.');
    return;
  }

  // Transform single meme views to the expected format if necessary
// Transform single meme views to the expected format if necessary
const transformedViews = memeViews.reduce<TransformedMemeView[]>((acc, view) => {
  const existing = acc.find(v => v.email === view.email);
  if (existing) {
      existing.memeIDs.push(view.memeID);
  } else {
      acc.push({
          email: view.email,
          memeIDs: [view.memeID],
          ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)  // Add TTL if needed
      });
  }
  return acc;
}, []);

  // Log transformed data
  console.log('Transformed meme views for batch processing:', JSON.stringify(transformedViews));

  try {
    const response = await fetch(
      'https://uxn7b7ubm7.execute-api.us-east-2.amazonaws.com/Test/recordMemeView',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken('accessToken')}`,
        },
        body: JSON.stringify({
          operation: 'recordMemeView',
          memeViews: transformedViews,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to record meme views');
    }

    console.log('Meme views recorded successfully');
  } catch (error) {
    console.error('Error recording meme views:', error);
    throw error;
  }
};


const debouncedFetchMemes = debounce(async (
  lastEvaluatedKey: string | null,
  userEmail: string,
  limit: number,
  accessToken: string,
  resolve: (result: FetchMemesResult) => void,
  reject: (error: any) => void
) => {
  console.log(`Debounced fetchMemes called for user: ${userEmail}, lastEvaluatedKey: ${lastEvaluatedKey}`);

  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${userEmail}`;
    const now = Date.now();

    // Only use cache if it's an initial load (lastEvaluatedKey is null)
    if (!lastEvaluatedKey) {
      const lastFetchTime = await AsyncStorage.getItem(`${cacheKey}_time`);
      if (lastFetchTime && now - parseInt(lastFetchTime) < COOLDOWN_PERIOD) {
        console.log('Using cached data for initial load');
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          resolve(JSON.parse(cachedData));
          return;
        }
      }
    }

    console.log('Fetching new data from API');
    const response = await fetch(`${API_URL}/fetchMemes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        operation: 'fetchMemes',
        lastEvaluatedKey,
        userEmail,
        limit,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const result = {
      memes: data.data.memes.map((meme: { isFollowed: boolean }) => ({
        ...meme,
        isFollowed: meme.isFollowed || false,
      })),
      lastEvaluatedKey: data.data.lastEvaluatedKey,
    };

    // Only cache the result if it's an initial load
    if (!lastEvaluatedKey) {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
      await AsyncStorage.setItem(`${cacheKey}_time`, now.toString());
    }

    console.log(`Fetched ${result.memes.length} memes, new lastEvaluatedKey: ${result.lastEvaluatedKey}`);
    resolve(result);
  } catch (error) {
    console.error('Fetch memes failed:', error);
    reject(error);
  }
}, 100);

export const fetchMemes = (
  lastEvaluatedKey: string | null = null,
  userEmail: string,
  limit: number = 10,
  accessToken: string,
): Promise<FetchMemesResult> => {
  return new Promise((resolve, reject) => {
    debouncedFetchMemes(lastEvaluatedKey, userEmail, limit, accessToken, resolve, reject);
  });
};


export const getUserMemes = async (
  email: string,
  lastEvaluatedKey: string | null = null,
): Promise<FetchMemesResult> => {
  try {
    const response = await fetch(
      'https://uxn7b7ubm7.execute-api.us-east-2.amazonaws.com/Test/getUserMemes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'getUserMemes',
          email,
          lastEvaluatedKey,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    //console.log('getUserMemes response:', responseData);  // Add this line for debugging

    // Check if the response has the expected structure
    if (responseData && responseData.data && Array.isArray(responseData.data.memes)) {
      return {
        memes: responseData.data.memes,
        lastEvaluatedKey: responseData.data.lastEvaluatedKey,
      };
    } else {
      console.error('Unexpected response structure:', responseData);
      return { memes: [], lastEvaluatedKey: null };
    }
  } catch (error) {
    console.error('Error fetching user memes:', error);
    return { memes: [], lastEvaluatedKey: null };
  }
};

export const deleteMeme = async (memeID: string, userEmail: string) => {
  try {
    console.log(`Attempting to delete meme. MemeID: ${memeID}, UserEmail: ${userEmail}`);
    const response = await fetch(
      'https://uxn7b7ubm7.execute-api.us-east-2.amazonaws.com/Test/deleteMeme',
      {
        method: 'POST',  // Changed from DELETE to POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({operation: 'deleteMeme', memeID, userEmail}),
      },
    );
    const responseData = await response.json();
    console.log('Delete meme response:', responseData);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Meme not found');
      } else if (response.status === 403) {
        throw new Error('You are not authorized to delete this meme');
      } else {
        throw new Error(responseData.message || 'Failed to delete meme');
      }
    }
    return responseData;
  } catch (error) {
    console.error('Error deleting meme:', error);
    throw error;
  }
};

export const removeDownloadedMeme = async (
  userEmail: string,
  memeID: string,
) => {
  try {
    console.log(`Attempting to remove meme: ${memeID} for user: ${userEmail}`);
    const response = await fetch(
      'https://uxn7b7ubm7.execute-api.us-east-2.amazonaws.com/Test/removeDownloadedMeme',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'removeDownloadedMeme',
          userEmail,
          memeID,
        }),
      },
    );
    const responseData = await response.json();
    console.log('Remove downloaded meme response:', responseData);
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to remove downloaded meme');
    }
    return responseData;
  } catch (error) {
    console.error('Error removing downloaded meme:', error);
    throw error;
  }
};

export const handleShareMeme = async (
  memeID: string,
  email: string,
  username: string,
  catchUser: string,
  message: string,
  setResponseModalVisible: (visible: boolean) => void,
  setResponseMessage: (message: string) => void,
) => {
  const shareData = {
    operation: 'shareMeme',
    memeID,
    email: email,
    username,
    catchUser,
    message,
  };

  //    console.log('Share data:', shareData);

  try {
    //   console.log('Initiating share operation...');
    const response = await fetch(
      'https://uxn7b7ubm7.execute-api.us-east-2.amazonaws.com/Test/shareMeme',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shareData),
      },
    );

    //    console.log('Response status:', response.status);
    //    console.log('Response body:', await response.text());

    if (response.ok) {
      Toast.show({
        type: 'success', // There are 'success', 'info', 'error'
        position: 'top',
        text1: 'Meme shared successfully!',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
        props: {backgroundColor: '#333', textColor: '#white'},
      });
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Failed to share meme.',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        props: {backgroundColor: '#333', textColor: '#00ff00'},
      });
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      position: 'top',
      text1: 'An error occurred while sharing the meme.',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
    });
  }
};

export const uploadMeme = async (
  mediaUri: string,
  userEmail: string,
  username: string,
  caption: string = '',
  tags: string[] = [],
  mediaType: 'image' | 'video',
) => {
  try {
    const fileName = `${userEmail}-meme-${Date.now()}.${
      mediaType === 'video' ? 'mp4' : 'jpg'
    }`;
    const contentType = mediaType === 'video' ? 'video/mp4' : 'image/jpeg';

    // console.log('Requesting presigned URL for:', fileName);

    const presignedUrlResponse = await fetch(`${API_URL}/getPresignedUrl`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        operation: 'getPresignedUrl',
        fileName,
        fileType: contentType,
      }),
    });

    if (!presignedUrlResponse.ok) {
      const errorText = await presignedUrlResponse.text();
      console.error('Presigned URL error response:', errorText);
      throw new Error(
        `Failed to get presigned URL: ${presignedUrlResponse.status} ${presignedUrlResponse.statusText}`,
      );
    }

    const presignedData = await presignedUrlResponse.json();
    // console.log('Presigned URL data:', presignedData);

    const {uploadURL, fileKey} = presignedData.data;

    if (!uploadURL) {
      throw new Error('Received null or undefined uploadURL');
    }

    // console.log('Uploading file to:', uploadURL);

    const uploadResult = await FileSystem.uploadAsync(uploadURL, mediaUri, {
      httpMethod: 'PUT',
      headers: {'Content-Type': contentType},
    });

    // console.log('Upload result:', uploadResult);

    if (uploadResult.status !== 200) {
      throw new Error(`Failed to upload file to S3: ${uploadResult.status}`);
    }

    const metadataResponse = await fetch(`${API_URL}/uploadMeme`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        operation: 'uploadMeme',
        email: userEmail,
        username,
        caption,
        tags,
        mediaType,
        memeKey: fileKey,
      }),
    });

    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text();
      console.error('Metadata response:', errorText);
      throw new Error(
        `Failed to process metadata: ${metadataResponse.status} ${metadataResponse.statusText}`,
      );
    }

    const data = await metadataResponse.json();
    return {url: data.data.url};
  } catch (error) {
    console.error('Error uploading meme:', error);
    throw error;
  }
};

export const getLikeStatus = async (memeID: string, userEmail: string) => {
  try {
    if (!memeID || !userEmail) {
      console.error('getLikeStatus called with invalid parameters:', {
        memeID,
        userEmail,
      });
      return null;
    }

    // console.log(`Fetching like status for memeID: ${memeID}, userEmail: ${userEmail}`);

    const response = await fetch(
      'https://uxn7b7ubm7.execute-api.us-east-2.amazonaws.com/Test/getLikeStatus',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'getLikeStatus',
          memeID,
          userEmail,
        }),
      },
    );

    // console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(
        `Failed to get like status: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    //console.log(`Meme info and like status data:`, data);

    return {
      liked: data.data.liked,
      doubleLiked: data.data.doubleLiked,
      memeInfo: {
        MemeID: data.data.MemeID,
        Email: data.data.Email,
        Username: data.data.Username,
        ProfilePicUrl: data.data.ProfilePicUrl,
        mediaType: data.data.mediaType,
        MemeURL: data.data.MemeURL,
        LikeCount: data.data.LikeCount,
        ShareCount: data.data.ShareCount,
        CommentCount: data.data.CommentCount,
        DownloadsCount: data.data.DownloadsCount,
        UploadTimestamp: data.data.UploadTimestamp,
      },
    };
  } catch (error) {
    console.error('Error getting meme info and like status:', error);
    return null;
  }
};

export const fetchDownloadedMemes = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/memes/downloaded`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({operation: 'fetchDownloadedMemes', email}),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch downloaded memes');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching downloaded memes:', error);
    throw error;
  }
};

export const updateMemeReaction = async (
  memeID: string,
  incrementLikes: boolean,
  doubleLike: boolean,
  incrementDownloads: boolean,
  email: string,
): Promise<void> => {
  const requestBody = {
    operation: 'updateMemeReaction',
    memeID,
    doubleLike,
    incrementLikes,
    incrementDownloads,
    email,
  };

  // console.log('Updating meme reaction with requestBody:', requestBody);

  const response = await fetch(`${API_URL}/updateMemeReaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('Failed to update meme reaction:', data.message);
    throw new Error(data.message);
  }

  // console.log('Meme reaction updated successfully:', data);
};
