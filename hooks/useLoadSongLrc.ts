import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadSongLrc = (song: Song) => {
  const supabaseClient = useSupabaseClient();

  if (!song || !song.lrc_path) {
    return "";
  }

  const { data: songData } = supabaseClient.storage
    .from("lyrics")
    .getPublicUrl(song.lrc_path || "");

  return songData.publicUrl;
};

export default useLoadSongLrc;
