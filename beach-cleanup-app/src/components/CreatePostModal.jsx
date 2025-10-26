import { useState, useRef } from 'react';
import { Image, Video, MapPin, X } from 'lucide-react';
import { Modal, ModalBody, ModalFooter, Button, Textarea, Input } from './ui';

/**
 * CreatePostModal Component
 * Modal for creating new posts with image/video upload
 */
const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter((file) => {
      const type = file.type.split('/')[0];
      return type === 'image' || type === 'video';
    });

    if (validFiles.length === 0) {
      alert('Please select valid image or video files');
      return;
    }

    // Limit to 5 files
    const filesToAdd = validFiles.slice(0, 5 - mediaFiles.length);

    // Create preview URLs
    const newPreviews = filesToAdd.map((file) => {
      const type = file.type.split('/')[0];
      return {
        type,
        url: URL.createObjectURL(file),
        file,
      };
    });

    setMediaFiles((prev) => [...prev, ...filesToAdd]);
    setMediaPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveMedia = (index) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(mediaPreviews[index].url);

    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption.trim() && mediaFiles.length === 0) {
      alert('Please add a caption or media');
      return;
    }

    setIsSubmitting(true);

    // Convert files to data URLs for mock (in real app, upload to server)
    const media = await Promise.all(
      mediaPreviews.map(async (preview) => ({
        type: preview.type,
        url: preview.url, // In production, this would be the uploaded URL
        alt: caption.substring(0, 50) || 'Post media',
      }))
    );

    const postData = {
      caption,
      location,
      media,
    };

    const result = await onSubmit(postData);

    setIsSubmitting(false);

    if (result.success) {
      // Clean up
      mediaPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
      setCaption('');
      setLocation('');
      setMediaFiles([]);
      setMediaPreviews([]);
      onClose();
    }
  };

  const handleClose = () => {
    // Clean up object URLs
    mediaPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setCaption('');
    setLocation('');
    setMediaFiles([]);
    setMediaPreviews([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Post" size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            {/* Caption */}
            <Textarea
              label="Caption"
              placeholder="Share your cleanup story..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">
              {caption.length}/500
            </div>

            {/* Location */}
            <Input
              label="Location (optional)"
              type="text"
              placeholder="e.g., Venice Beach, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              leftIcon={<MapPin className="h-4 w-4" />}
            />

            {/* Media Upload Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photos or Videos
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<Image className="h-4 w-4" />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={mediaFiles.length >= 5}
                >
                  Add Photos
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<Video className="h-4 w-4" />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={mediaFiles.length >= 5}
                >
                  Add Video
                </Button>
              </div>
              {mediaFiles.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {mediaFiles.length}/5 files selected
                </p>
              )}
            </div>

            {/* Media Previews */}
            {mediaPreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mediaPreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                  >
                    {preview.type === 'image' ? (
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={preview.url}
                        className="w-full h-full object-cover"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove media"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting || (!caption.trim() && mediaFiles.length === 0)}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default CreatePostModal;
