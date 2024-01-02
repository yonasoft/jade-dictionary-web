
export type Word = {
	_id: number;
	definition: string;
	pinyin: string;
	simplified: string;
	traditional: string;
};
export enum WordAspect {
	Definition = 'Definition',
	Hanzi = 'Hanzi',
	Pinyin = 'Pinyin',
}
export enum ScriptType {
	Simplified = 'Simplified',
	Traditional = 'Traditional',
}
