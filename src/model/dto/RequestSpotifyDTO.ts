import { Request } from "express";
import { UserSpotifyData } from "../../authSpotify";

export interface RequestSpotifyDTO extends Request {
	userSpotifyData: UserSpotifyData
	tagId: string;

	query: {
		playlist_uri: string
		id_device: string
		id_tag: string
	}
}