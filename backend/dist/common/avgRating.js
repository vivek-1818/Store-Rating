"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAverageRating = getAverageRating;
function getAverageRating(ratings) {
    if (ratings.length === 0) {
        return 0;
    }
    let total = 0;
    for (let rating of ratings) {
        total += rating.value;
    }
    return total / ratings.length;
}
