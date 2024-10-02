import React, {useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faBell, faCog } from '@fortawesome/free-solid-svg-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { AppNavProp } from '../../navigation/NavTypes/RootNavTypes';
import { FONTS } from '../../theme/theme';
import { User } from '../../types/types';
import { useUserStore } from '../../stores/userStore';
import { useNotificationStore } from '../../stores/notificationStore';

const HeaderFeed = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<AppNavProp>();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedTab, setSelectedTab] = useState('Flow');
  const user = useUserStore(state => state as User);
  const isAdmin = useUserStore(state => state.isAdmin);
  const notificationCount = useNotificationStore(state => state.notifications.filter(n => !n.read).length);

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const imgSrc = user.profilePic
    ? {uri: user.profilePic}
    : require('../../assets/images/Jestr.jpg');

  const handleNotificationPress = () => { navigation.navigate('Notifications');};

  return (
    <View style={[styles.container, {top: insets.top}]}>
      <View style={styles.firstRow}>
        {!isSearchActive && (
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
            style={styles.profileContainer}>
            <Image source={imgSrc} style={styles.profilePic} />
          </TouchableOpacity>
        )}

        {!isSearchActive && (
          <Image
            source={require('../../assets/images/Jestr.jpg')}
            style={styles.logo}
          />
        )}

        {isAdmin && !isSearchActive && (
          <TouchableOpacity
            style={styles.adminIconContainer}
            onPress={() => navigation.navigate('AdminPage')}>
            <FontAwesomeIcon
              icon={faCog}
              size={wp('5%')}
              style={styles.adminIcon}
            />
          </TouchableOpacity>
        )}

        <View style={[styles.searchContainer, isSearchActive && styles.searchContainerActive]}>
          {isSearchActive && (
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={true}
              onBlur={() => setIsSearchActive(false)}
            />
          )}
          <TouchableOpacity
            style={styles.searchIconContainer}
            onPress={() => {
              setIsSearchActive(prev => !prev);
            }}>
            <FontAwesomeIcon
              icon={faSearch}
              size={wp('5%')}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationContainer}>
          <FontAwesomeIcon icon={faBell} size={wp('5%')} style={styles.notificationIcon} />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Flow' && styles.activeTab]}
          onPress={() => handleTabClick('Flow')}>
          <Text style={[styles.tabText, selectedTab === 'Flow' && styles.activeTabText]}>
            Flow
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Following' && styles.activeTab]}
          onPress={() => handleTabClick('Following')}>
          <Text style={[styles.tabText, selectedTab === 'Following' && styles.activeTabText]}>
            Following
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: wp('5%'),
    width: '100%',
  },
  firstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: hp('7%'),
  },
  txt: {
    color: 'white',
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  profilePic: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    marginTop: 4,

    borderWidth: 1,
    borderColor: 'yellow',
  },
  logo: {
    width: wp('20%'),
    height: hp('6%'),
    resizeMode: 'contain',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  searchContainerActive: {
    flexGrow: 1,
    height: '100%',
  },
  searchInput: {
    height: '100%',
    flex: 1,
    backgroundColor: '#1C1C1C',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: wp('2%'),
    fontFamily: FONTS.regular,
    fontSize: wp('4%'),

    borderWidth: 1,
    borderColor: 'yellow',
  },
  searchIconContainer: {
    padding: wp('2%'),
  },
  searchIcon: {
    color: '#fff',
  },
  adminIconContainer: {
    marginLeft: wp('-5%'),
    padding: wp('2%'),

    borderWidth: 1,
    borderColor: 'yellow',
  },
  adminIcon: {
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: 10,
  },
  tab: {
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1bd40b',
  },
  tabText: {
    color: '#888',
    fontSize: wp('5%'),
    fontFamily: FONTS.regular,
  },
  activeTabText: {
    color: '#fff',
  },
  notificationContainer: {
    marginLeft: wp('2%'),
    padding: wp('2%'),
  },
  notificationIcon: {
    color: '#fff',
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HeaderFeed;
