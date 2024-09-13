import { StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS } from '../../theme/theme';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 50,
  },
  formContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Ensure items start from the left
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1, // Allow it to take up remaining space
    paddingTop: Platform.OS === 'ios' ? 60 : 10,
  },
  backButtonTouchable: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 70, // Increased by 50 pixels
    left: 20,
    width: 50,
    height: 50,
    zIndex: 999,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  subOptionsContainer: {
    marginTop: 20,
  },
  subOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    marginBottom: 10,
  },
  subOptionIcon: {
    marginRight: 15,
    color: '#1bd40b',
  },
  subOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalScrollView: {
    maxHeight: height * 0.6,
    width: '100%',
  },
  buttonContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  icon: {
    marginRight: 16,
    color: '#1bd40b',
  },
  textContainer: {
    flex: 1,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  buttonDescription: {
    fontSize: 14,
    color: '#BBBBBB',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  arrowIcon: {
    color: '#1bd40b',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    left: 20,
    width: 100,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 14,
  },
  logoutIcon: {
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingTop: 40,
    alignItems: 'stretch',  // Changed from 'flex-start' to 'stretch' to allow proper alignment
    justifyContent: 'flex-start',  // Ensure items start from the top
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    minHeight: height * 0.7,
    width: '100%',
  },
  modalBackButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 20,
  },
  warningText: {
    color: '#FF3B30',
    marginBottom: 15,
    fontSize: 16,
  },
  legalText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  messageInput: {
    height: 80, // Reduced height
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  submitButton: {
    backgroundColor: '#00ff00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '30%',
  },
  feedbackIndex: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 10,
    width: 25,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  messageContainer: {
    position: 'relative', 
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  modalHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 20,
    alignSelf: 'flex-start',
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  modalDescription: {
    fontSize: 16,
    color: '#BBBBBB',
    marginBottom: 25,
    lineHeight: 22,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  settingValue: {
    fontSize: 16,
    color: '#BBBBBB',
    marginBottom: 20,
  },
  changeButton: {
    backgroundColor: '#1bd40b',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  changeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  notificationSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
   settingSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  languageButton: {
    backgroundColor: '#1bd40b',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
  },
  tab: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#1bd40b',
  },
  tabIcon: {
    color: '#FFFFFF',
    marginBottom: 5,
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  languageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noBlockedAccounts: {
    color: '#BBBBBB',
    fontSize: 16,
    fontStyle: 'italic',
  },
  unblockButton: {
    color: '#1bd40b',
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackListContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
  },
  feedbackListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  feedbackContent: {
    flex: 1,
  },
  feedbackPreview: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
  },
  feedbackTimestamp: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  feedbackStatus: {
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    color: '#FFFFFF',
    overflow: 'hidden',
  },
  loadingIndicator: {
    marginVertical: 20, 
    alignSelf: 'center', 
  },
  
  charCount: {
    position: 'absolute',
    bottom: 10, 
    right: 10, 
    fontSize: 12,
    color: '#999',
  },
});