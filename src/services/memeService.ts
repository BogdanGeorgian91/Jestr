// memeService.tsx

import * as FileSystem from 'expo-file-system';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import {API_URL} from './config';
import {FetchMemesResult} from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useInfiniteQuery} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const LAST_VIEWED_MEME_KEY = 'lastViewedMemeId';

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
    const {uploadURL, fileKey} = presignedData.data;

    if (!uploadURL) {
      throw new Error('Received null or undefined uploadURL');
    }

    const uploadResult = await FileSystem.uploadAsync(uploadURL, mediaUri, {
      httpMethod: 'PUT',
      headers: {'Content-Type': contentType},
    });

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

export const fetchMemes = async (
  lastEvaluatedKey: string | null = null,
  userEmail: string,
  limit: number = 10,
  accessToken: string,
): Promise<FetchMemesResult> => {
  console.log( `fetchMemes called for user: ${userEmail}, lastEvaluatedKey: ${lastEvaluatedKey}`,);
  console.log('Fetching new data from API');

  try {
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
    console.log('Fetch memes response:', data);

    const result = {
      memes: data.data.memes.map((meme: {isFollowed: boolean}) => ({
        ...meme,
        isFollowed: meme.isFollowed || false,
      })),
      lastEvaluatedKey: data.data.lastViewedMemeId || null,
    };

    console.log( `Fetched ${result.memes.length} memes, new lastViewedMemeId: ${result.lastEvaluatedKey}`,);
    return result;
  } catch (error) {
    console.error('Error fetching memes:', error);
    return {memes: [], lastEvaluatedKey: null};
  }
};

export const useMemes = (
  userEmail: string,
  accessToken: string | null,
  enabled: boolean = true,
) => {

  const result = useInfiniteQuery<FetchMemesResult, Error>({
    queryKey: ['memes', userEmail],
    queryFn: async ({pageParam}) => {
      console.log('Fetching memes for pageParam:', pageParam);

      if (!userEmail || !accessToken)
        throw new Error('User or token not available');
      const result = await fetchMemes(
        pageParam as string | null,
        userEmail,
        10,
        accessToken,
      );
      return result;
    },
    getNextPageParam: lastPage => lastPage.lastEvaluatedKey || undefined,
    enabled: !!userEmail && !!accessToken && enabled,
    initialPageParam: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const memes =
    result.data?.pages.flatMap((page: FetchMemesResult) => page.memes) || [];

  const handleMemeViewed = async (memeId: string) => {
    if (userEmail) {
      await AsyncStorage.setItem(LAST_VIEWED_MEME_KEY, memeId);
    }
  };

  return {
    ...result,
    memes,
    handleMemeViewed,
  };
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
    if (
      responseData &&
      responseData.data &&
      Array.isArray(responseData.data.memes)
    ) {
      return {
        memes: responseData.data.memes,
        lastEvaluatedKey: responseData.data.lastEvaluatedKey,
      };
    } else {
      console.error('Unexpected response structure:', responseData);
      return {memes: [], lastEvaluatedKey: null};
    }
  } catch (error) {
    console.error('Error fetching user memes:', error);
    return {memes: [], lastEvaluatedKey: null};
  }
};

export const deleteMeme = async (memeID: string, userEmail: string) => {
  try {
    console.log(
      `Attempting to delete meme. MemeID: ${memeID}, UserEmail: ${userEmail}`,
    );
    const response = await fetch(
      'https://uxn7b7ubm7.execute-api.us-east-2.amazonaws.com/Test/deleteMeme',
      {
        method: 'POST', // Changed from DELETE to POST
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
        method: 'POST', // Changed from DELETE to POST
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
      throw new Error(
        responseData.message || 'Failed to remove downloaded meme',
      );
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

  try {
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
        DownloadsCount: data.data.DownloadCount,
        UploadTimestamp: data.data.UploadTimestamp,
      },
    };
  } catch (error) {
    console.error('Error getting meme info and like status:', error);
    return null;
  }
};

export interface UpdateMemeReactionRequest {
  memeID: string;
  incrementLikes: boolean;
  email: string;
  doubleLike: boolean;
  incrementDownloads: boolean;
}

export interface UpdateMemeReactionResponse {
  success: boolean;
  message: string;
}

export const updateMemeReaction = async (
  data: UpdateMemeReactionRequest,
): Promise<UpdateMemeReactionResponse> => {
  const requestBody = {
    operation: 'updateMemeReaction',
    memeID: data.memeID,
    doubleLike: false,
    incrementLikes: data.incrementLikes,
    incrementDownloads: false,
    email: data.email,
  };
  // console.log('Updating meme reaction with requestBody:', requestBody);

  const response = await axios.post(
    `${API_URL}/updateMemeReaction`,
    requestBody,
    {
      headers: {'Content-Type': 'application/json'},
    },
  );
  console.log('Update meme reaction response:', response.data);
  return response.data;
};
