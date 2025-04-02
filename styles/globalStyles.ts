// styles/globalStyles.ts
import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  // MarkerDetailsScreen styles
  markerDetailsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  markerDetailsInputContainer: {
    marginBottom: 25,
  },
  markerDetailsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  markerDetailsTitleInput: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    color: '#000',
  },
  markerDetailsDescriptionInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    color: '#000',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  markerDetailsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  markerDetailsGalleryWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    marginBottom: 10
  },
  // Styles for image container and image
  markerDetailsImageContainer: {
    width: '30%',
    aspectRatio: 1,
    margin: 5,
  },
  markerDetailsImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  markerDetailsDeleteOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  markerDetailsDeleteText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  markerDetailsAddButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  markerDetailsSaveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginVertical: 10
  },
  markerDetailsDeleteButton: {
    backgroundColor: '#ff0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: -35
  },
  markerDetailsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  markerDetailsModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
  },
  markerDetailsModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDetailsFullscreenImage: {
    width: '100%',
    height: '100%',
  },
  markerDetailsCoordinateText: {
    fontSize: 16,
    color: '#666',
  },
  scrollViewContent: {
    paddingBottom: 80 // Запас для нижних кнопок
  },

  // MapScreen styles
  mapScreenContainer: {
    flex: 1
  },
  
});

export default globalStyles;