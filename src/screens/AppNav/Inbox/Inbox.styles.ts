import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Existing styles...

  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 48,
    paddingHorizontal: 10,
  },
  sectionHeaderIn: {
    fontSize: 40,
    fontWeight: '600',
    color: '#00ff00',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    marginLeft: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  searchBar: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    color: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00ff00',
    paddingBottom: 5,
    borderBottomWidth: 1,
    marginLeft: 10,
    borderBottomColor: '#444',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  notificationIcon: {
    marginRight: 10,
  },
  notificationText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFF',
  },
  newMessageButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#1bd40b',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  skeletonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  skeletonProfilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#444',
    marginRight: 15,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeletonText: {
    height: 20,
    backgroundColor: '#444',
    marginBottom: 10,
    borderRadius: 4,
    width: '80%',
  },
  skeletonTextShort: {
    height: 20,
    backgroundColor: '#444',
    borderRadius: 4,
    width: '50%',
  },
  // Styles for the conversation items
  rowFront: {
    backgroundColor: '#1C1C1C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    zIndex: 2, // Ensure the front row is above the hidden row
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  nameAndPin: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    marginLeft: 5,
  },
  username: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFF',
  },
  preview: {
    fontSize: 15,
    color: '#999',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  unreadBadge: {
    backgroundColor: 'blue',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 15,
    top: 15,
  },
  unreadCountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Styles for the hidden row (swipe actions)
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensure the hidden row is behind the front row
  },
  backLeftBtn: {
    alignItems: 'center',
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    width: 75,
    height: '100%',
    position: 'absolute',
    left: 0,
  },
  backRightBtn: {
    alignItems: 'center',
    backgroundColor: 'red',
    justifyContent: 'center',
    width: 75,
    height: '100%',
    position: 'absolute',
    right: 0,
  },
  deleteText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  pinnedConversation: {
    backgroundColor: '#333',
  },
});

export default styles;
