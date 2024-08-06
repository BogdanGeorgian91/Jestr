import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const { width, height } = Dimensions.get('window');

type SuccessModalProps = {
  visible: boolean;
  onClose: () => void;
  username: string;
};

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onClose, username }) => {
  const scaleValue = new Animated.Value(0);

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
          <FontAwesomeIcon icon={faCheckCircle} size={60} color="#4CAF50" />
          <Text style={styles.successText}>Success</Text>
          <Text style={styles.messageText}>Welcome back, {username}!</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  modalContainer: {
    width: width * 0.8,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#1bd40b'
  },
  messageText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    color: 'white'
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SuccessModal;
