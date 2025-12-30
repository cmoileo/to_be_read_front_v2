import { useState } from "react";
import { SearchApi } from "@repo/api-client";
export function useSearchViewModel() {
    const [globalResults, setGlobalResults] = useState(null);
    const [usersResults, setUsersResults] = useState(null);
    const [booksResults, setBooksResults] = useState(null);
    const [reviewsResults, setReviewsResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isLoadingBooks, setIsLoadingBooks] = useState(false);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [error, setError] = useState(null);
    const globalSearch = async (query) => {
        if (!query.trim()) {
            setGlobalResults(null);
            return;
        }
        setIsSearching(true);
        setError(null);
        try {
            const results = await SearchApi.globalSearch(query);
            setGlobalResults(results);
        }
        catch (err) {
            setError("search.errors.loadFailed");
            console.error("Global search failed:", err);
        }
        finally {
            setIsSearching(false);
        }
    };
    const searchUsers = async (params, append = false) => {
        setIsLoadingUsers(true);
        setError(null);
        try {
            const results = await SearchApi.searchUsers(params);
            if (append && usersResults) {
                setUsersResults({
                    ...results,
                    data: [...usersResults.data, ...results.data],
                });
            }
            else {
                setUsersResults(results);
            }
        }
        catch (err) {
            setError("search.errors.loadFailed");
            console.error("Users search failed:", err);
        }
        finally {
            setIsLoadingUsers(false);
        }
    };
    const searchBooks = async (params, append = false) => {
        setIsLoadingBooks(true);
        setError(null);
        try {
            const results = await SearchApi.searchBooks(params);
            if (append && booksResults) {
                setBooksResults({
                    ...results,
                    data: [...booksResults.data, ...results.data],
                });
            }
            else {
                setBooksResults(results);
            }
        }
        catch (err) {
            setError("search.errors.loadFailed");
            console.error("Books search failed:", err);
        }
        finally {
            setIsLoadingBooks(false);
        }
    };
    const searchReviews = async (params, append = false) => {
        setIsLoadingReviews(true);
        setError(null);
        try {
            const results = await SearchApi.searchReviews(params);
            if (append && reviewsResults) {
                setReviewsResults({
                    ...results,
                    data: [...reviewsResults.data, ...results.data],
                });
            }
            else {
                setReviewsResults(results);
            }
        }
        catch (err) {
            setError("search.errors.loadFailed");
            console.error("Reviews search failed:", err);
        }
        finally {
            setIsLoadingReviews(false);
        }
    };
    return {
        globalResults,
        usersResults,
        booksResults,
        reviewsResults,
        isSearching,
        isLoadingUsers,
        isLoadingBooks,
        isLoadingReviews,
        error,
        globalSearch,
        searchUsers,
        searchBooks,
        searchReviews,
    };
}
