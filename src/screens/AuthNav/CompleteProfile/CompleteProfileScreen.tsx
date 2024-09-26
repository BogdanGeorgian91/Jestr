import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {TouchableOpacity, Keyboard} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import {StyleSheet, Alert, Switch} from 'react-native';
import {useRoute} from '@react-navigation/core';
import {LinearGradient} from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {BlurView} from 'expo-blur';
import LottieView from 'lottie-react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMoon, faHeart, faBell} from '@fortawesome/free-solid-svg-icons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileImage} from '../../../types/types';
import HeaderPicUpload from '../../../components/Upload/HeaderPicUpload';
import ProfilePicUpload from '../../../components/Upload/ProfilePicUpload';
import InputField from '../../../components/Input/InputField';
import {handleCompleteProfile} from '../../../services/userService';
import {useUserStore} from '../../../stores/userStore';
import {useTheme} from '../../../theme/ThemeContext';
import {useNotificationStore} from '../../../stores/notificationStore';
import {useSettingsStore} from '../../../stores/settingsStore';
import {CompleteProfileNavRouteProp} from '../../../navigation/NavTypes/AuthStackTypes';

const CompleteProfileScreen: React.FC = () => {
  const route = useRoute<CompleteProfileNavRouteProp>();

  const {headerPic, profilePic, bio, setBio, setDarkMode} = useUserStore();
  const {privacySafety, updatePrivacySafety} = useSettingsStore();
  const {pushEnabled, setNotificationPreferences} = useNotificationStore();

  const email = route.params?.email;
  const {isDarkMode, toggleDarkMode} = useTheme();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkModeLocal] = useState(isDarkMode);

  useEffect(() => {
    const checkMediaPermission = async () => {
      const storedPermission = await AsyncStorage.getItem('mediaPermission');

      if (storedPermission !== 'granted') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission needed',
            'Please grant permission to access your photos.',
          );
          await AsyncStorage.setItem('mediaPermission', 'denied');
        } else {
          await AsyncStorage.setItem('mediaPermission', 'granted');
        }
      }
    };

    checkMediaPermission();
  }, []);

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkModeLocal(newMode);
    toggleDarkMode();
    setDarkMode?.(newMode);
  };

const handleImagePick = async (type: 'header' | 'profile') => {
  const storedPermission = await AsyncStorage.getItem('mediaPermission');
  
  // Request permission if not previously granted
  if (storedPermission !== 'granted') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos.');
      await AsyncStorage.setItem('mediaPermission', 'denied');
      return;
    }
    await AsyncStorage.setItem('mediaPermission', 'granted');
  }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'header' ? [16, 9] : [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedAsset: ProfileImage = {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
          type: result.assets[0].type,
          fileName: result.assets[0].fileName,
          fileSize: result.assets[0].fileSize,
        };

        if (type === 'header') {
          useUserStore.getState().setHeaderPic(selectedAsset);
        } else {
          useUserStore.getState().setProfilePic(selectedAsset);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleCompleteProfileButton = async () => {
    setIsLoading(true);
    try {
      const validProfilePic =
        profilePic && typeof profilePic !== 'string' ? profilePic : null;
      const validHeaderPic =
        headerPic && typeof headerPic !== 'string' ? headerPic : null;

      setDarkMode?.(darkMode);
      updatePrivacySafety({
        likesPublic: privacySafety.likesPublic,
        allowDMsFromEveryone: privacySafety.allowDMsFromEveryone,
      });
      setNotificationPreferences({pushEnabled});

      await handleCompleteProfile(
        email,
        username,
        displayName,
        validProfilePic,
        validHeaderPic,
        bio,
        () => {}, // This is the setSuccessModalVisible function
        {
          darkMode,
          likesPublic: privacySafety.likesPublic,
          notificationsEnabled: pushEnabled,
        },
      );

      setError(null);
    } catch (error: unknown) {
      console.error('Error completing profile:', error);
      if (error instanceof Error) {
        setError(
          error.message || 'Failed to complete profile. Please try again.',
        );
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <BlurView intensity={95} tint="dark" style={StyleSheet.absoluteFill}>
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('../../../assets/animations/loading-animation.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
          <Text style={styles.loadingText}>Creating Account...</Text>
        </View>
      </BlurView>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{flexGrow: 1}}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps="handled">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <HeaderPicUpload
            onHeaderPicChange={() => handleImagePick('header')}
          />
          <ProfilePicUpload
            onProfilePicChange={() => handleImagePick('profile')}
          />
          <View style={styles.inputsContainer}>
            <InputField
              label="Display Name"
              placeholder="Enter Display Name"
              value={displayName}
              labelStyle={styles.whiteText}
              onChangeText={setDisplayName}
            />
            <InputField
              label="Username"
              placeholder="Enter Username"
              value={username}
              labelStyle={styles.whiteText}
              onChangeText={setUsername}
            />
            <InputField
              label="Bio"
              placeholder="Enter your bio"
              labelStyle={styles.whiteText}
              value={bio}
              onChangeText={text => setBio?.(text)}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.preferencesContainer}>
            <View style={styles.preferenceItem}>
              <FontAwesomeIcon icon={faMoon} size={24} color="#1bd40b" />
              <Text style={styles.preferenceText}>Dark Mode</Text>
              <Switch
                value={darkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{false: '#767577', true: '#1bd40b'}}
                thumbColor={darkMode ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>

            <View style={styles.preferenceItem}>
              <FontAwesomeIcon icon={faHeart} size={24} color="#1bd40b" />
              <Text style={styles.preferenceText}>Likes Public</Text>
              <Switch
                value={privacySafety.likesPublic}
                onValueChange={value =>
                  updatePrivacySafety({likesPublic: value})
                }
                trackColor={{false: '#767577', true: '#1bd40b'}}
                thumbColor={privacySafety.likesPublic ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>

            <View style={styles.preferenceItem}>
              <FontAwesomeIcon icon={faBell} size={24} color="#1bd40b" />
              <Text style={styles.preferenceText}>Push Notifications</Text>
              <Switch
                value={pushEnabled}
                onValueChange={value =>
                  setNotificationPreferences({pushEnabled: value})
                }
                trackColor={{false: '#767577', true: '#1bd40b'}}
                thumbColor={pushEnabled ? '#f4f3f4' : '#f4f3f4'}
              />
            </View>

            <TouchableOpacity
              onPress={handleCompleteProfileButton}
              style={styles.button}>
              <LinearGradient
                colors={['#002400', '#00e100']}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                style={styles.gradient}>
                <Text style={styles.buttonText}>Complete Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    padding: 20,
  },
  preferencesContainer: {
    marginTop: 10,
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 15,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  preferenceText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
    marginLeft: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
  whiteText: {
    color: '#FFF',
    marginBottom: 0,
  },
  inputsContainer: {
    width: '100%',
    marginTop: 4,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    width: '100%',
  },
  gradient: {
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CompleteProfileScreen;
