import { SegmentedControlItem } from "@mantine/core";

export enum QueryType {
	English = 'English',
	Hanzi = 'Hanzi',
	Pinyin = 'Pinyin',
}
export enum ResultType {
	Simplified = 'Simplified',
	Traditional = 'Traditional',
}
export type LinkData = {link:string, label:string, links?:LinkData[]};
