import { ActionIconGroupProps, InputDescriptionProps, SegmentedControlItem } from "@mantine/core";
import { Icon, TablerIconsProps } from "@tabler/icons-react";
import React from "react";

export enum QueryType {
	English = 'English',
	Hanzi = 'Hanzi',
	Pinyin = 'Pinyin',
}
export enum ResultType {
	Simplified = 'Simplified',
	Traditional = 'Traditional',
}
export type LinkData = {link:string, label:string, links?:LinkData[], icon?:React.ReactNode};
