export function getAverageRating(ratings: any[]) {
  if (ratings.length === 0) {
    return 0;
  }

  let total = 0;
  for (let rating of ratings) {
    total += rating.value;
  }
  return total / ratings.length;
}