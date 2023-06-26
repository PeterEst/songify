"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import useUploadModal from "@/hooks/useUploadModal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const uploadModal = useUploadModal();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
      lrc: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];
      const lrcFile = values.lrc?.[0];
      const songTitle = values.title;
      const songAuthor = values.author;

      if (!imageFile || !songFile || !user || !songTitle || !songAuthor) {
        return toast.error("Missing Fields");
      }

      const uniqueId = uniqid();

      // Upload Song
      const { data: songData, error: songError } = await supabaseClient.storage
        .from("songs")
        .upload(`song-${values.title}-${uniqueId}`, songFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (songError) {
        setIsLoading(false);
        return toast.error("Failed to upload song.");
      }

      // Upload Image
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from("images")
          .upload(`image-${values.title}-${uniqueId}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

      if (imageError) {
        setIsLoading(false);
        return toast.error("Failed to upload image.");
      }

      // Upload LRC
      let lrcData;
      if (lrcFile) {
        const { data, error: lrcError } = await supabaseClient.storage
          .from("lyrics")
          .upload(`lyrics-${values.title}-${uniqueId}`, lrcFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (lrcError) {
          setIsLoading(false);
          return toast.error("Failed to upload lrc.");
        }

        lrcData = data;
      }

      const { error: supabaseError } = await supabaseClient
        .from("songs")
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData?.path,
          song_path: songData?.path,
          lrc_path: lrcFile ? lrcData?.path : null,
        });

      if (supabaseError) {
        setIsLoading(false);
        return toast.error("Supabase error.");
      }

      router.refresh();
      setIsLoading(false);
      toast.success("Song uploaded successfully.");
      reset();
      uploadModal.onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form
        className="
        flex
        flex-col
        gap-y-4
      "
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", {
            required: true,
          })}
          placeholder="Song Title"
        />
        {errors.title && <div className="text-red-500">Title is required</div>}
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", {
            required: true,
          })}
          placeholder="Song author"
        />
        {errors.author && (
          <div className="text-red-500">Author is required</div>
        )}
        <div>
          <div className="pb-1">Select a song file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register("song", {
              required: true,
            })}
          />
          {errors.song && <div className="text-red-500">Song is required</div>}
        </div>
        <div>
          <div className="pb-1">Select an image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", {
              required: true,
            })}
          />
          {errors.image && (
            <div className="text-red-500">Image is required</div>
          )}
        </div>
        <div>
          <div className="pb-1">Select an LRC File (lyrics)</div>
          <Input
            id="lrc"
            type="file"
            disabled={isLoading}
            accept=".lrc"
            {...register("lrc")}
          />
          {errors.lrc && (
            <div className="text-red-500">
              LRC file must be a .lrc or .txt file
            </div>
          )}
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
