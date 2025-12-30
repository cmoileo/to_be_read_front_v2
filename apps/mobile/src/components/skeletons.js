import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Skeleton({ className = "" }) {
    return _jsx("div", { className: `animate-pulse bg-gray-200 rounded ${className}` });
}
export function ReviewCardSkeleton() {
    return (_jsxs("div", { className: "bg-white rounded-xl p-4 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx(Skeleton, { className: "w-10 h-10 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx(Skeleton, { className: "h-4 w-24 mb-1" }), _jsx(Skeleton, { className: "h-3 w-16" })] })] }), _jsxs("div", { className: "flex gap-3 mb-3", children: [_jsx(Skeleton, { className: "w-16 h-24 rounded-md flex-shrink-0" }), _jsxs("div", { className: "flex-1", children: [_jsx(Skeleton, { className: "h-4 w-3/4 mb-2" }), _jsx(Skeleton, { className: "h-3 w-1/2 mb-3" }), _jsx(Skeleton, { className: "h-4 w-20" })] })] }), _jsx(Skeleton, { className: "h-16 w-full mb-3" }), _jsxs("div", { className: "flex justify-between", children: [_jsx(Skeleton, { className: "h-8 w-16" }), _jsx(Skeleton, { className: "h-8 w-16" })] })] }));
}
export function BookCardSkeleton() {
    return (_jsxs("div", { className: "flex gap-3 p-3 bg-white rounded-lg", children: [_jsx(Skeleton, { className: "w-16 h-24 rounded-md flex-shrink-0" }), _jsxs("div", { className: "flex-1", children: [_jsx(Skeleton, { className: "h-4 w-3/4 mb-2" }), _jsx(Skeleton, { className: "h-3 w-1/2 mb-3" }), _jsx(Skeleton, { className: "h-4 w-20" })] })] }));
}
export function ProfileHeaderSkeleton() {
    return (_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx(Skeleton, { className: "w-20 h-20 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx(Skeleton, { className: "h-5 w-32 mb-2" }), _jsx(Skeleton, { className: "h-4 w-24" })] })] }), _jsx(Skeleton, { className: "h-12 w-full mb-4" }), _jsxs("div", { className: "flex justify-around", children: [_jsxs("div", { className: "text-center", children: [_jsx(Skeleton, { className: "h-6 w-8 mx-auto mb-1" }), _jsx(Skeleton, { className: "h-3 w-16" })] }), _jsxs("div", { className: "text-center", children: [_jsx(Skeleton, { className: "h-6 w-8 mx-auto mb-1" }), _jsx(Skeleton, { className: "h-3 w-16" })] }), _jsxs("div", { className: "text-center", children: [_jsx(Skeleton, { className: "h-6 w-8 mx-auto mb-1" }), _jsx(Skeleton, { className: "h-3 w-16" })] })] })] }));
}
export function FeedSkeleton() {
    return (_jsx("div", { className: "space-y-4 p-4", children: [1, 2, 3].map((i) => (_jsx(ReviewCardSkeleton, {}, i))) }));
}
export function SearchResultsSkeleton() {
    return (_jsx("div", { className: "space-y-3 p-4", children: [1, 2, 3, 4, 5].map((i) => (_jsx(BookCardSkeleton, {}, i))) }));
}
export function NotificationsSkeleton() {
    return (_jsx("div", { className: "space-y-2 p-4", children: [1, 2, 3, 4].map((i) => (_jsxs("div", { className: "flex items-center gap-3 p-3 bg-white rounded-lg", children: [_jsx(Skeleton, { className: "w-10 h-10 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx(Skeleton, { className: "h-4 w-3/4 mb-1" }), _jsx(Skeleton, { className: "h-3 w-1/2" })] })] }, i))) }));
}
