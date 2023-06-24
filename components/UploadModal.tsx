"use client";

import React from "react";
import Modal from "./Modal";
import useUploadModal from "@/hooks/useUploadModal";

const UploadModal = () => {
  const uploadModal = useUploadModal();

  const onChange = (open: boolean) => {
    if (!open) {
      // Reset form

      uploadModal.onClose();
    }
  };

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      Upload modal
    </Modal>
  );
};

export default UploadModal;
