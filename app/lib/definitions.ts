import { ActionIconGroupProps, InputDescriptionProps, SegmentedControlItem } from "@mantine/core";
import { Icon, TablerIconsProps } from "@tabler/icons-react";
import React from "react";

export enum QueryType {
	English = 'English',
	Hanzi = 'Hanzi',
	Pinyin = 'Pinyin',
}
export enum ScriptType {
	Simplified = 'Simplified',
	Traditional = 'Traditional',
}
export type LinkData = { link: string, label: string, sublinks?: LinkData[], icon?: React.ReactNode };
export interface FirestoreUserData {
	uid: string;
	email: string | null;
	displayName: string | null;
	photoURL: string | null;
	photoFileName: string| null;
}
export type Word = {
	id: number;
	definition: string;
	pinyin: string;
	simplified: string;
	traditional: string;
}