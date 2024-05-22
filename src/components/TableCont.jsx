import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableCont = () => {
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true); 

  const fetchBooks = async () => {
    setLoading(true); 
    try {
      const response = await axios.get('https://openlibrary.org/subjects/science.json?limit=80');
      setTableData(response.data.works);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false); 
    }
  };

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableItems = [...tableData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a;
        let bValue = b;
        const keys = sortConfig.key.split('.');
        for (const key of keys) {
          aValue = aValue?.[key];
          bValue = bValue?.[key];
        }
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [tableData, sortConfig]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredData = sortedData.filter((book) =>
    searchQuery ? book.authors[0]?.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className='relative w-[95%] max-w-[100%] h-auto bg-white grid gap-y-1 rounded-lg shadow-2xl p-2'>

      <div className='sticky top-0 bg-white z-20 p-2 mt-2'>
        <div className='flex flex-wrap gap-y-3 mb-4'>
          <input
            type="text"
            value={searchQuery}
            onChange={handleChange}
            placeholder="Enter author name"
            className="px-3 py-1 rounded-md border border-gray-400 mr-2 outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-blue-600 transition duration-300"
            onClick={handleSubmit}
          >
            Search
          </button>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="ml-4 px-3 py-1 rounded-md border border-gray-400"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className='overflow-x-auto h-[45rem] bg-white border border-gray-50 rounded-md'>
        {loading ? (
          <div className='text-center text-2xl p-4'>Loading...</div> 
        ) : (
          <table className='w-full border-l border-r border-b border-gray-300 rounded-xl '>
            <thead className='sticky top-0 bg-sky-900 text-white border-gray-500 z-10 '>
              <tr>
                <th className='border-b border-r text-xl border-gray-300 p-3 cursor-pointer' onClick={() => handleSort('title')}>
                  Title
                </th>
                <th className='border-b border-r text-xl border-gray-300 p-3 cursor-pointer' onClick={() => handleSort('authors.0.name')}>
                  Author Name
                </th>
                <th className='border-b border-r border-gray-300 p-3 cursor-pointer' onClick={() => handleSort('first_publish_year')}>
                  First Publish Year
                </th>
                <th className='border-b border-r border-gray-300 p-3 cursor-pointer' onClick={() => handleSort('subject')}>
                  Subject
                </th>
                <th className='border-b border-r border-gray-300 p-3 cursor-pointer'>
                  Author Birth Date
                </th>
                <th className='border-b border-r border-gray-300 p-3 cursor-pointer'>
                  Author Top Work
                </th>
                <th className='border-b border-gray-300 p-2 cursor-pointer'>
                  Ratings Average
                </th>
              </tr>
            </thead>

            <tbody className='px-2'>
              {currentItems.length > 0 ? (
                currentItems.map((book) => (
                  <tr key={book.key}>
                    <td className='border-r border-b text-center p-4'>{book.title}</td>
                    <td className='border-r border-b text-center py-4'>{book.authors[0]?.name}</td>
                    <td className='border-r border-b text-center p-4'>{book.first_publish_year}</td>
                    <td className='border-r border-b px-2 py-4'>{book.subject?.slice(0, 2).join(', ')}</td>
                    <td className='border-r border-b text-center p-4'>{book.authors[0]?.birth_date || 'N/A'}</td>
                    <td className='border-r border-b text-center p-4'>{book.authors[0]?.top_work || 'N/A'}</td>
                    <td className='text-center p-4'>{book.ratings_average || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className='text-center p-4'>No Author Found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-center mt-4 pb-2">
        {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, index) => (
          <button
            key={index}
            className={`px-3 py-1 mx-1 rounded-md border border-gray-400 ${currentPage === index + 1 ? 'bg-gray-200' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TableCont;
