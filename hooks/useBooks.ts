import { useQuery } from '@tanstack/react-query';

import { supabase } from "../lib/supabase";

export type Book = {
	id?: number;
	title: string;
	author: string;
	publishedDate: string;
	genre?: string;
};

const getBooks = async () => {
	if (!supabase) return [];

	const {data} = await supabase
		.from('books')
		.select();
	return data;
};


export const createBook = async ({title, author, publishedDate, genre}: Book) => {
	try {
		const { data, error, status } = await supabase
		  .from('books')
		  .insert({
				title,
				author,
				publishedDate: Date.parse(publishedDate)/1000,
				genre
			});
		return { data, error, status };
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
		return { data: [], error: err, status: 500 };
	}
};

export const updateBook = async (book: Book) => {
	try {
		const { data, error, status } = await supabase
		  .from('books')
		  .update(book);
		return { data, error, status };
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
		return { data: [], error: err, status: 500 };
	}
};

export const deleteBook = async (id: number) => {
	try {
		const { data, error, status } = await supabase
		  .from('books')
		  .delete()
			.eq('id', id);
		return { data, error, status };
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
		return { data: [], error: err, status: 500 };
	}
};

export const fetchBooks = () => useQuery({ queryKey: ['books'], queryFn: getBooks });
