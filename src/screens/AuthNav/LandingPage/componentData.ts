import {StyleSheet} from 'react-native';

export const colorsGradient = [
  '#080808',
  '#0a0a0a',
  '#0c0c0c',
  '#0e0e0e',
  '#101010',
  '#121212',
  '#141414',
  '#161616',
  '#181818',
  '#1a1a1a',
  '#1c1c1c',
  '#1e1e1e',
  '#202020',
  '#222222',
  '#242424',
  '#262626',
  '#282828',
  '#2a2a2a',
  '#2c2c2c',
  '#2e2e2e',
  '#303030',
  '#323232',
  '#343434',
  '#363636',
  '#383838',
  '#3a3a3a',
  '#3c3c3c',
  '#3e3e3e',
];

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    // borderWidth: 1,
    // borderColor: 'red',
  },
  innerCtr: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    paddingBottom: 20,
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  footerDivider: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 5,
  },
  logo: {
    width: 120,
    height: 120,
    marginRight: 16,
    alignSelf: 'center',
  },
  button: {
    width: '50%',
    height: 80,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#00ff00',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 60,
  },
  buttonText: {
    color: '#00ff00',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
