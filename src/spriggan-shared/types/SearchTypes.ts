
export enum sortOptions {
	DateAsc,
	DateDesc,
	RatingAsc,
	RatingDesc,
	NameAsc,
	NameDesc,
};

export type SearchParams = {
	titleTerm: string;
	developerTerm: string;
	publisherTerm: string;
	offset: number;
	sort: sortOptions;
	tags: string[];
	status: string;
	includeAdultOnly: boolean;
};