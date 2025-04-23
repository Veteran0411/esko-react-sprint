// just take an array on which we need to apply the pagination
import { useState, useEffect } from 'react';

export const usePagination = (filteredItems, itemsPerPage = 4) => {
    // initialize 1 on first mount (then if filtered pages is changed thaten again it is initialzed to 1)
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination data
  const indexOfLastItem = currentPage * itemsPerPage; // 1*3 === 3 
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; //3-3 ===0
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem); // current items (0,3) ==> 0,1,2
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage); // 9//3===3 {3 pages}

  // page 2 ==> indexOfLastItem= 2*3 == 6 &  indexOfFirstItem =6-3===3 & currentItems (3,6)==>3,4,5

  // Reset to first page when filtered items change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredItems]);
  
//   Even if the contents of filteredItems haven't changed deeply,
//    the reference changes (since filter() returns a new array), so useEffect runs and resets the page.

  return {
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
    itemsPerPage
  };
};