import { StyleSheet, Dimensions } from 'react-native';
import { SPACING, FONT_SIZES } from '../../../theme/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: -SPACING.sm,
    flex: 1, // Allow content to expand
  },
  scrollView: {
    flexGrow: 1,

  },
  input: {
    width: '100%',
  },
  inputText: {
    paddingVertical: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    fontSize: Math.max(16, Math.min(FONT_SIZES.md, SCREEN_WIDTH * 0.045)),
    color: '#fff',

    borderRadius: 8,
  },
  signupHeader: {
    fontSize: Math.max(28, Math.min(35, SCREEN_WIDTH * 0.09)),
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    paddingVertical: SPACING.lg,
  },

  button2: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.07,
    borderRadius: SCREEN_HEIGHT * 0.035,
    borderWidth: 2,
    borderColor: '#00ff00',
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginVertical: SPACING.lg,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#00ff00',
    fontSize: Math.max(16, Math.min(FONT_SIZES.md, SCREEN_WIDTH * 0.045)),
    fontWeight: 'bold',
  },
  toggleFormText: {
    color: '#007AFF',
    fontSize: Math.max(14, Math.min(FONT_SIZES.md, SCREEN_WIDTH * 0.04)),
    textAlign: 'center',
    marginVertical: SPACING.sm,
    textDecorationLine: 'underline',
  },
  forgotPasswordText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginTop: SPACING.sm,
    fontSize: Math.max(14, Math.min(FONT_SIZES.md, SCREEN_WIDTH * 0.04)),
    textAlign: 'center',
  },
  continueButtonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingVertical: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#DADCE0',
  },
  googleButtonText: {
    color: '#757575',
    fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.04)),
    fontWeight: '500',
    marginLeft: SPACING.sm,
  },
  buttonIcon: {
    marginRight: SPACING.sm,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 4,
    paddingVertical: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.04)),
    fontWeight: '500',
    marginLeft: SPACING.sm,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#00ff00',
    marginTop: SPACING.sm,
    fontSize: Math.max(16, Math.min(FONT_SIZES.md, SCREEN_WIDTH * 0.045)),
    fontWeight: 'bold',
  },
  socialButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: SPACING.md,
  },
  socialButton: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: SCREEN_WIDTH * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    // Optional: Add shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    elevation: 5,
  },
  socialButtonIcon: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
  footerLinksContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
});