import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faThumbsUp,
  faComment,
  faShare,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {BlurView} from 'expo-blur';
import {Animated} from 'react-native';

import styles from './MP.styles';
import {ShareType, User} from '../../types/types';

import {fetchComments} from '../Meme/memeService';

interface IconButtonProps {
  icon: any;
  count: number;
  onPress: () => void;
  color?: string;
  memeID: string;
}

interface IconsAndContentProps {
  memeUser: any;
  caption: string;
  uploadTimestamp: string;
  index: number;
  currentIndex: number;
  isFollowing: boolean;
  handleFollow: () => void;
  counts: {
    likes: number;
    comments: number;
    shares: number;
    downloads: number;
  };
  debouncedHandleLike: () => void;
  liked: boolean;
  doubleLiked: boolean;
  handleDownloadPress: () => void;
  isSaved: boolean;
  toggleCommentFeed: () => void;
  formatDate: (date: string) => string;
  animatedBlurIntensity: Animated.Value;
  iconAreaRef: React.RefObject<View>;
  onShare: (type: ShareType, username: string, message: string) => void;
  user: User | null;
  memeID: string;
  numOfComments: number;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  count,
  onPress,
  color = '#1bd40b',
  memeID,
}) => {
  // UNECESSARY !!!
  // const [commentsLength, setCommentsLength] = useState(0);
  // console.log('count in IconButton ===>', count);

  // useEffect(() => {
  //   const getCommentsLength = async () => {
  //     const updatedComments = await fetchComments(memeID);
  //     setCommentsLength(updatedComments.length);
  //   };

  //   getCommentsLength();
  // }, [memeID]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.iconWrapper}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
      <FontAwesomeIcon icon={icon} size={28} color={color} />
      <Text style={[styles.iconText, {color: '#FFFFFF'}]}>{count}</Text>
      {/* <Text style={[styles.iconText, {color: '#FFFFFF'}]}>
        {commentsLength}
      </Text> */}
    </TouchableOpacity>
  );
};

export const IconsAndContent: React.FC<IconsAndContentProps> = ({
  memeUser,
  caption,
  uploadTimestamp,
  counts,
  debouncedHandleLike,
  liked,
  doubleLiked,
  handleDownloadPress,
  isSaved,
  toggleCommentFeed,
  formatDate,
  animatedBlurIntensity,
  iconAreaRef,
  isFollowing,
  index,
  currentIndex,
  handleFollow,
  onShare,
  user,
  memeID,
  numOfComments,
}) => {
  // console.log('memeID in IconsAndContent ===>', memeID);
  // console.log('numOfComments in IconsAndContent ===>', numOfComments);

  const isActive = index === currentIndex;

  if (!isActive) {
    return null; // Don't render if not the active item
  }

  const handleLikePress = () => {
    console.log('Like button pressed');
    debouncedHandleLike();
  };

  const handleCommentPress = () => {
    toggleCommentFeed();
  };

  const handleSharePress = () => {
    if (user && memeUser?.username) {
      onShare('friend', memeUser.username, 'Check out this meme!');
    }
  };

  const handleSavePress = () => {
    console.log('Save button pressed');
    handleDownloadPress();
  };

  return (
    <Animated.View
      style={[
        styles.blurContainer,
        {
          opacity: Animated.subtract(
            1,
            Animated.divide(animatedBlurIntensity, 150),
          ),
        },
      ]}>
      <BlurView intensity={100} tint="dark" style={styles.blurInner}>
        <View style={styles.textContainer}>
          <View style={styles.profilePicContainer}>
            <Image
              source={
                memeUser?.profilePic
                  ? {uri: memeUser.profilePic}
                  : require('../../assets/images/Jestr.jpg')
              }
              style={styles.profilePic}
            />
            {!isFollowing && (
              <TouchableOpacity
                onPress={handleFollow}
                style={styles.followButton}>
                <FontAwesomeIcon icon={faPlus} size={12} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.textContent}>
            <Text style={styles.username}>
              {memeUser?.username || 'Anonymous'}
            </Text>
            {caption && <Text style={styles.caption}>{caption}</Text>}
            <Text style={styles.date}>{formatDate(uploadTimestamp)}</Text>
          </View>
        </View>

        <View
          ref={iconAreaRef}
          style={styles.iconColumn}
          onLayout={event => {
            const {x, y, width, height} = event.nativeEvent.layout;
          }}>
          <IconButton
            icon={faThumbsUp}
            count={counts.likes}
            memeID={memeID}
            onPress={handleLikePress}
            color={liked || doubleLiked ? '#006400' : '#1bd40b'}
          />
          <IconButton
            icon={faComment}
            memeID={memeID}
            // count={counts.comments}
            count={numOfComments}
            onPress={handleCommentPress}
          />
          <IconButton
            icon={faShare}
            memeID={memeID}
            count={counts.shares}
            onPress={handleSharePress}
          />
        </View>
      </BlurView>
    </Animated.View>
  );
};

export default IconsAndContent;
